# Internal API Methods for Venues
from google.appengine.ext import ndb

from modules.utils import get_entity_key_by_keystr
from modules.venues.internal.models import Venue
from modules.venues.constants import VENUE_KIND
from modules.venues.internal import search as vsearch


def get_venue_key_by_keystr(keystr):
    """
    Given a urlsafe version of an Venue key, get the actual key
    """
    return get_entity_key_by_keystr(VENUE_KIND, keystr)


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


def get_venue_list():
    """
    Fetch a list of Venues
    """

    # TODO: Paginate this, etc
    entities = Venue.query().order(-Venue.title).fetch(1000)

    return entities


@ndb.transactional
def _create_venue_txn(key, data, operator_key):
    """
    Transactionally safe helper to create a venue
    TODO: Write the search index bits in a separate furious task?
    TODO: Do something with operator
    """

    # Check if something with same slug already exists
    if get_venue_by_slug(data['slug']):
        raise Exception('venue already exists with slug %s' % data['slug'])

    # Final Data Prep
    data['key'] = key

    # Create the actual Venue entity
    entity = Venue(**data)

    # Write the entity
    entity.put()

    # Build the search doc - TODO: In a deferred task?
    search_index = vsearch.get_search_index()
    search_doc = vsearch.build_index(entity)
    search_index.put([search_doc])

    return entity


def create_venue(data, operator=None):
    """
    Create an Venue
    """

    key = get_venue_key(data['slug'])

    # Prep go data...
    if data.get('geo', None):
        if isinstance(data['geo'], ndb.GeoPt): # Lazy...
            lat = data['geo'].lat
            lon = data['geo'].lon
        elif isinstance(data['geo'], dict): # Maybe this isn't the best solution to be flexible?
            lat = data['geo']['lat']
            lon = data['geo']['lon']
        else:
            geo_data = data['geo'].split(',')
            lat = geo_data[0].strip()
            lon = geo_data[1].strip()

        data['geo'] = ndb.GeoPt(lat=float(lat), lon=float(lon))
    else:
        data['geo'] = None


    # Operator prep
    operator_key = None
    if operator:
        operator_key = operator.key

    return _create_venue_txn(key, data, operator_key)


@ndb.transactional
def _edit_venue_txn(venue_key, data, operator_key):
    """
    Transactional Helper to edit a Venue
    """

    # TODO: If slug changes, we need to update the key
    # TODO: Update search indexes

    venue = venue_key.get()

    if not venue:
        raise RuntimeError('Venue could not be found by Key')

    for field, value in data.items():
        setattr(venue, field, value)

    # Record audit, clear cache, etc
    venue.put()

    # Build the search doc - TODO: In a deferred task?
    # Figure out if anything changed to even bother with the docs
    # Clean memcache?

    search_index = vsearch.get_search_index()
    search_doc = vsearch.build_index(venue)
    search_index.put([search_doc])

    return venue


def edit_venue(venue, data, operator=None):
    """
    Edit an event
    """

    # Operator prep
    operator_key = None
    if operator:
        operator_key = operator.key


    venue_key = venue.key


    # Prep go data...
    if data.get('geo', None):
        if isinstance(data['geo'], ndb.GeoPt): # Lazy...
            lat = data['geo'].lat
            lon = data['geo'].lon
        elif isinstance(data['geo'], dict): # Maybe this isn't the best solution to be flexible?
            lat = data['geo']['lat']
            lon = data['geo']['lon']
        else:
            geo_data = data['geo'].split(',')
            lat = geo_data[0].strip()
            lon = geo_data[1].strip()

        data['geo'] = ndb.GeoPt(lat=float(lat), lon=float(lon))
    else:
        data['geo'] = None


    return _edit_venue_txn(venue_key, data, operator_key)


@ndb.transactional
def _delete_venue_txn(venue_key, operator_key):
    """
    Transactional Helper to delete a Venue
    """

    # TODO: Delete the cloud storage document
    venue_key.delete()
    return True


def delete_venue(venue, operator=None):
    """
    Delete a series
    """

    # TODO: Find all the events with this series and remove the series
    # Prep the file on cloud storage to be deleted
    # Delete search index
    # Clear memcache, etc?

    operator_key = None
    if operator:
        operator_key = operator.key

    venue_key = venue.key
    
    return _delete_venue_txn(venue_key, operator_key)
