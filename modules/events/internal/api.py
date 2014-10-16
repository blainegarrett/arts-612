# Internal API Methods for Events
from google.appengine.ext import ndb

from modules.utils import get_entity_key_by_keystr
from modules.events.internal.models import Event
from modules.events.internal import search as event_search
from modules.events.constants import EVENT_KIND


def get_event_key_by_keystr(keystr):
    """
    Given a urlsafe version of an Event key, get the actual key
    """
    return get_entity_key_by_keystr(EVENT_KIND, keystr)


def get_event_key(slug):
    """
    Create a ndb.Key given an Event slug
    TODO: Keys will likely not be slugs for events
    """

    err = 'Event slug must be defined and of of type basestring'

    if not slug or not isinstance(slug, basestring):
        raise RuntimeError(err)

    return ndb.Key(EVENT_KIND, slug)


def get_event_by_slug(slug):
    """
    Given an event slug, fetch the event entity
    """

    event_key = get_event_key(slug)
    event = event_key.get()
    return event


def get_events():
    events = Event.query().fetch(100)
    return events


def create_event(data):
    """
    Create an event
    # TODO: Make this transactional
    """

    search_index = event_search.get_search_index()

    # Create the base Event Model
    entity = Event()
    entity.slug = data['slug']
    entity.name = data['name']
    entity.url = data['url']

    #entity.summary = 'This is Great'
    #entity.description = 'Super Great'
    #entity.featured = True

    # Create the Event Dates
    # TODO: As we add different event types, pull this into its own method

    event_dates = []
    for d_data in data['dates']:
        ed = {}

        ed['category'] = d_data['category']
        ed['venue_slug'] = d_data['venue_slug']

        ed['label'] = d_data['label']
        ed['type'] = str(d_data['type']) # This is not a long term solution...
        ed['start'] = str(d_data['start']) # This is not a long term solution...
        ed['end'] = str(d_data['end']) # This is not a long term solution...
        event_dates.append(ed)

    entity.event_dates = event_dates
    entity.put()

    # Build search indexes for event dates
    search_docs = event_search.build_index(entity)
    search_index.put(search_docs)

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

    '''
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
    '''
