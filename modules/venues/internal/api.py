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
    if data['geo']:
        geo_data = data['geo'].split(',')
        data['geo'] = ndb.GeoPt(lat=float(geo_data[0].strip()), lon=float(geo_data[1].strip()))
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

    return _edit_venue_txn(venue_key, data, operator_key)


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
