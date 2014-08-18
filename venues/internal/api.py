# Internal API Methods for Photo Venues
from google.appengine.ext import ndb
from venues.internal.models import Venue
from venues.constants import VENUE_KIND


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


def create_venue(data, operator):
    """
    Create an Venue
    # TODO: Populate search index
    """

    slug = data['slug']
    title = data['title']
    description = data['description']

    key = get_venue_key(slug)
    entity = Venue(key=key, slug=slug, title=title, description=description, photo_ids=photo_ids)
    entity.put()
    return entity
