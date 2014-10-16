# Internal API Methods for Events
from google.appengine.ext import ndb

from modules.events.internal.models import Event
from modules.events.internal import search as event_search
from modules.events.constants import EVENT_KIND


def get_event_key_by_keystr(keystr):
    """
    Given a urlsafe version of an Event key, get the actual key
    # TODO: Abstract this out into a helper that is kind agnostic
    """

    attr_err = 'Keystrings must be an instance of base string, recieved: %s' % keystr
    kind_err = 'Expected urlsafe keystr for kind %s but received keystr for kind %s instead.'
    if not keystr or not isinstance(keystr, basestring):
        raise RuntimeError(attr_err)

    key = ndb.Key(urlsafe=keystr)
    if not key.kind() == EVENT_KIND:
        raise RuntimeError(kind_err % (EVENT_KIND, key.kind()))

    return key


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