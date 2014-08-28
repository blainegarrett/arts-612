# Internal API Methods for Photo Venues
from google.appengine.ext import ndb
from modules.venues.internal.models import Venue, Event, EventDate
from modules.venues.constants import VENUE_KIND


from modules.venues.internal import search as vsearch

def get_venue_key_by_keystr(keystr):
    """
    Given a urlsafe version of an Venue key, get the actual key
    """
    attr_err = 'Keystrings must be an instance of base string, recieved: %s' % keystr
    kind_err = 'Expected urlsafe keystr for kind %s but received keystr for kind %s instead.'
    if not keystr or not isinstance(keystr, basestring):
        raise RuntimeError(attr_err)

    key = ndb.Key(urlsafe=keystr)
    if not key.kind() == VENUE_KIND:
        raise RuntimeError(kind_err % (VENUE_KIND, key.kind()))

    return key


def get_venue_key(slug):
    """
    Create a ndb.Key given an Venue slug
    """
    err = 'Venue slug must be defined and of of type basestring'

    if not slug or not isinstance(slug, basestring):
        raise RuntimeError(err)

    return ndb.Key(VENUE_KIND, slug)


def get_venue_by_slug(slug):
    """
    Given an venue slug, fetch the venue entity
    """

    venue_key = get_venue_key(slug)
    venue = venue_key.get()
    return venue


def edit_venue(venue_key, data, operator):
    """
    Edit a series
    """
    # TODO: This should be transactional
    # TODO: If slug changes, we need to update the key
    # TODO: Update search indexes

    venue = venue_key.get()

    if not venue:
        raise RuntimeError('Venue could not be found by Key')

    for field, value in data.items():
        setattr(venue, field, value)

    # Record audit, clear cache, etc
    venue.put()

    return venue


def delete_venue(venue_key, operator):
    """
    Delete a series
    """
    # TODO: Find all the events with this series and remove the series

    # Prep the file on cloud storage to be deleted
    venue = venue_key.get()

    if not venue:
        raise RuntimeError('Venue could not be found by Key')

    venue_key.delete()
    return True


def get_venue_list():
    """
    Fetch a list of Venues
    """

    # TODO: Paginate this, etc
    entities = Venue.query().order(-Venue.title).fetch(1000)

    return entities


def create_venue(data, operator=None):
    """
    Create an Venue
    # TODO: Populate search index
    # TODO: Ensure that no other event exists by slug - transactional??
    """

    search_index = vsearch.get_search_index()

    # Prep the data
    data['key'] = get_venue_key(data['slug'])

    if data['geo']:
        geo_data = data['geo'].split(',')
        data['geo'] = ndb.GeoPt(lat=float(geo_data[0].strip()), lon=float(geo_data[1].strip()))
    else:
        data['geo'] = None    


    entity = Venue(**data)
    search_doc = vsearch.build_index(entity)

    entity.put()
    search_index.put([search_doc])
    return entity



    '''
    class Event(ndb.Model):
        """
        Model Representing an Event that may occur spanning multiple days (Event Date)
        """

        slug = ndb.StringProperty()
        title = ndb.StringProperty()
        intro = ndb.TextProperty()
        description = ndb.TextProperty()
        featured = ndb.BooleanProperty(default=False)
        venue = ndb.KeyProperty(kind=Venue)


    class EventDate(ndb.Model):
        """
        Model Representing a specific block of time
        """
        event_key = ndb.KeyProperty(kind=Event)
        start_datetime = ndb.DateTimeProperty()
        end_datetime = ndb.DateTimeProperty()
        venue = ndb.KeyProperty(kind=Venue)
        label = ndb.StringProperty()
    '''




########## Move all of this very soon###############
def create_event(data, *args, **kwargs):
    """
    """
    import datetime
    search_index = vsearch.get_event_search_index()

    # TODO: Do this outside of a txn
    v = get_venue_by_slug(data['venue_slug'])

    e = Event()
    e.slug = 'generate_unique_slug_for_event'
    e.title = data['title']
    e.intro = 'This is Great'
    e.description = 'Super Great'
    e.featured = True
    e.venue_key = v.key
    e.put()

    fmt = '%Y-%m-%d %H:%M:%S'

    e_dates = []
    for d_data in data['dates']:
        ed = EventDate(parent=e.key)
        ed.event_key = e.key
        ed.venue_key = v.key
        ed.label = d_data['label']

        ed.start_datetime = datetime.datetime.strptime(d_data['start_datetime'], fmt)
        ed.end_datetime = datetime.datetime.strptime(d_data['end_datetime'], fmt)
        ed.put()
        e_dates.append(ed)

    # Create the search index for this event
    search_doc = vsearch.build_event_index(e, e_dates, v)
    search_index.put([search_doc])

    return e