# Internal API Methods for Events

import datetime
from google.appengine.ext import ndb

from modules.utils import get_entity_key_by_keystr
from modules.events.internal.models import Event
from modules.events.internal import search as event_search
from modules.events.constants import EVENT_KIND
from modules.events.constants import CATEGORY
from modules.venues.internal import api as venue_api


def get_event_key_by_keystr(keystr):
    """
    Given a urlsafe version of an Event key, get the actual key
    """
    return get_entity_key_by_keystr(EVENT_KIND, keystr)


def get_event_key(event_id):
    """
    Create a ndb.Key given an Event slug
    TODO: Keys will likely not be slugs for events
    """

    err = 'Event slug must be defined and of of type integer'

    if not event_id or not isinstance(event_id, (int, long)):
        raise RuntimeError(err)

    return ndb.Key(EVENT_KIND, event_id)


def get_event_by_slug(slug):
    """
    Given an event slug, fetch the event entity
    TODO: slug is not the key here but rather a property
    """

    event_key = get_event_key(slug)
    event = event_key.get()
    return event


def get_events():
    return search_helper(category=[CATEGORY.ONGOING, CATEGORY.RECEPTION])


def tonight(category=None, limit=5):
    """
    TODO: Use `today`
    """

    dt = datetime.datetime(year=2014, month=11, day=15, hour=15, minute=0)
    end = dt # 3pm
    start = end + datetime.timedelta(hours=12) # 3am

    return search_helper(start=start, end=end, category=category, sort='start')


def upcoming_events(limit=5):
    # end is greater than this morning with category = reception and venue_category
    today = datetime.datetime.now().replace(hour=3, minute=0, second=0) # TODO: Needs TZ
    #querystring = 'end >= %s AND (category: %s OR category: event)' % (unix_time(end), )
    end = today
    return search_helper(end=end, category=CATEGORY.RECEPTION, sort='end')


def going_on_now(limit=5):
    # Going on "Now" or during some other date
    start = datetime.datetime(year=2014, month=11, day=15, hour=18, minute=0)
    end = start
    return search_helper(start=start, end=end, sort='end')


def get_this_week():
    #return upcoming_events()
    #return tonight(category='reception')
    #return tonight()
    #start = datetime.datetime.now()
    #end = start + datetime.timedelta(days=7)

    # Within 1 week - starts before 7 days from now but hasn't ended
    end = datetime.datetime.now()
    start = end + datetime.timedelta(days=7)

    # "Tonight"
    results = search_helper(start=start, end=end, category=[CATEGORY.ONGOING, CATEGORY.RECEPTION])
    return results


def search_helper(start=None, end=None, category=None, sort=None, limit=20):

    search_results = event_search.simple_search(start=start, end=end, category=category, sort=sort)
    events = event_search.get_events_from_event_search_docs(search_results['index_results'])

    bulk_dereference_venues(events)

    return events

def bulk_dereference_venues(events):
    
    return_one = False
    if not isinstance(events, list):
        return_one = True
        events = [events]

    # Iterate over the event dates and collect venue keys
    venue_keys_to_fetch = []
    for event in events:
        for ed in event.event_dates:
            venue_slug = ed['venue_slug']
            if not venue_slug:
                continue

            venue_key = venue_api.get_venue_key(venue_slug)
            venue_keys_to_fetch.append(venue_key)

    # Fetch all the venue keys
    venues = ndb.get_multi(venue_keys_to_fetch)
    venue_map = {v.slug: v for v in venues}

    # Iterate over the event dates and set venues
    for event in events:
        i = 0
        
        for i in range(len(event.event_dates)):
            ed = event.event_dates[i]

            venue_slug = ed['venue_slug']
            if venue_slug:
                venue = venue_map.get(venue_slug, None)
                event.event_dates[i]['venue'] = venue
            
    """

    for doc in search_results['index_results']:
        venue_key = venue_api.get_venue_key(doc['venue_slug'][0].value)
        venue_keys_to_fetch.append(venue_key)

    venues = ndb.get_multi(venue_keys_to_fetch)
    venue_map = {v.slug: v for v in venues}

    import logging
    for event in events:
        i = 0

        for event_date in event.event_dates:
            venue = venue_map.get(event_date.get('venue_slug', None), None)
            event.event_dates[i]['venue'] = venue
            i += 1

    """
    
    
    
    

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
