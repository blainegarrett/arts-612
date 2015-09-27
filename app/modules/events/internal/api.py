# Internal API Methods for Events

from pytz import timezone
import datetime
from google.appengine.ext import ndb

from rest.utils import get_key_from_resource_id, get_resource_id_from_key

from utils import ubercache

from modules.utils import get_entity_key_by_keystr
from modules.events.internal.models import Event, EventDate
from modules.events.internal import search as event_search
from modules.events.constants import EVENT_KIND
from modules.events.constants import QUERY_LIMIT
from modules.events.constants import CATEGORY
from modules.events.constants import PRIMARY_IMAGE_PROP

from modules.venues.internal import api as venue_api


def bulk_dereference_events(posts):
    """
    Bulk dereference image. This is to increase performance for rss and rest collections
    """

    # Step 1: Collect all the resources we need and prep the map
    entity_map = {}
    for post in posts:

        # Default the dereferenced prop placeholders
        setattr(post, PRIMARY_IMAGE_PROP, None)

        # Collect properties we want to collect
        if post.primary_image_resource_id:
            entity_map[get_key_from_resource_id(post.primary_image_resource_id)] = None

    # Fetch all of the entities we want to deref
    entities = ndb.get_multi(entity_map.keys())

    # Repopulate the map NOTE: This adds keys to map using resource_id rather than key
    for entity in entities:
        entity_map[get_resource_id_from_key(entity.key)] = entity

    # Step 3: Iterate over posts and link up the dereferenced props
    for post in posts:
        if post.primary_image_resource_id:
            e = entity_map.get(post.primary_image_resource_id, None)
            setattr(post, PRIMARY_IMAGE_PROP, e)

    return posts


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
    """

    q = Event.query()

    event = q.filter(Event.slug==slug).get()
    return event


def get_events(cursor=None, limit=QUERY_LIMIT):
    """
    Fetch a list of events doing a ndb query (vs. search api)

    Currently used to populate the admin page...

    :raises BadRequestError: If cursor is invalid

    """

    sort = -Event.modified_date

    if not limit:
        limit = QUERY_LIMIT

    q = Event.query().order(sort)

    events, cursor, more = q.fetch_page(limit, start_cursor=cursor)
    bulk_dereference_venues(events)
    return events, cursor, more


def generic_search(**kwargs):
    return search_helper(**kwargs)


def tonight(category=None, limit=QUERY_LIMIT):
    """
    TODO: Use `today`
    """

    dt = datetime.datetime(year=2014, month=11, day=15, hour=15, minute=0)
    end = dt # 3pm
    start = end + datetime.timedelta(hours=12) # 3am

    return search_helper(start=start, end=end, category=category, sort='start', iimit=limit)


def upcoming_events(limit=QUERY_LIMIT):
    # end is greater than this morning with category = reception and venue_category

    today = datetime.datetime.now(timezone('US/Central'))
    today = today.replace(hour=3, minute=0, second=0)

    #querystring = 'end >= %s AND (category: %s OR category: event)' % (unix_time(end), )
    end = today
    return search_helper(end=end, category=[CATEGORY.PERFORMANCE, CATEGORY.RECEPTION, CATEGORY.SALE], sort='start', limit=limit)


def now_showing(limit=QUERY_LIMIT):
    """
    Find all the events happening today (11pm UTC) - already started but haven't ended yet
    """

    today = datetime.datetime.now().replace(hour=0, minute=0, second=0, tzinfo=timezone('US/Central'))
    end = start = today
    return search_helper(end=end, start=start, category=CATEGORY.ONGOING, sort='end', limit=limit)


def going_on_now(limit=QUERY_LIMIT):
    # Going on "Now" or during some other date
    start = datetime.datetime(year=2014, month=11, day=15, hour=18, minute=0)
    end = start
    return search_helper(start=start, end=end, sort='end', limit=limit)


def get_this_week(limit=QUERY_LIMIT):
    #return upcoming_events()
    #return tonight(category='reception')
    #return tonight()
    #start = datetime.datetime.now()
    #end = start + datetime.timedelta(days=7)

    # Within 1 week - starts before 7 days from now but hasn't ended
    end = datetime.datetime.now()
    start = end + datetime.timedelta(days=7)

    # "Tonight"
    results = search_helper(start=start, end=end, category=[CATEGORY.ONGOING, CATEGORY.RECEPTION], limit=limit)
    return results


def search_helper(start=None, end=None, category=None, venue_slug=None, sort=None, limit=QUERY_LIMIT):
    """
    Helper method to perform search and populate items from datastore
    """

    if not limit:
        limit = QUERY_LIMIT

    search_results = event_search.simple_search(start=start, end=end, venue_slug=venue_slug, category=category, sort=sort, limit=limit)
    events = event_search.get_events_from_event_search_docs(search_results['index_results'])

    bulk_dereference_venues(events)

    return events


def bulk_dereference_venues(events):
    """
    """

    return_one = False

    if not isinstance(events, list):
        return_one = True
        events = [events]

    # Iterate over the event dates and collect venue keys

    venue_keys_to_fetch = []
    for event in events:
        for ed in event.event_dates:
            venue_slug = ed.venue_slug
            if not venue_slug:
                continue

            venue_key = venue_api.get_venue_key(venue_slug)
            venue_keys_to_fetch.append(venue_key)

    # Fetch all the venue keys

    venues = ndb.get_multi(venue_keys_to_fetch)
    venue_map = {}
    for v in venues:
        if v:
            venue_map[v.slug] = v

    # Iterate over the event dates and set venues
    for event in events:
        i = 0

        for i in range(len(event.event_dates)):
            ed = event.event_dates[i]

            venue_slug = ed.venue_slug
            if venue_slug:
                venue = venue_map.get(venue_slug, None)
                event.event_dates[i].venue = venue

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


def edit_event(entity, data):
    """
    Edit an event
    """

    # Create the base Event Model

    entity.slug = data['slug']
    entity.name = data['name']
    entity.url = data['url']

    entity.summary = data['summary']
    entity.content = data['content']
    entity.featured = bool(data['featured'])

    # Create the Event Dates
    # TODO: As we add different event types, pull this into its own method

    event_dates = []
    for d_data in data['event_dates']:
        ed = EventDate()

        ed.category = d_data['category']
        ed.venue_slug = d_data['venue_slug']

        # Check to ensure that venue_slug exists...
        v = venue_api.get_venue_by_slug(d_data['venue_slug'])
        if not v:
            raise Exception("%s is not a know venue slug." % d_data['venue_slug'])

        # TODO: Also check if start is before end, etc

        ed.label = d_data['label']
        ed.type = str(d_data['type']) # This is not a long term solution...
        ed.start = d_data['start'].replace(tzinfo=None) # Expected to be a DateTime or None
        ed.end = d_data['end'].replace(tzinfo=None) # Expected to be a DateTime or None
        event_dates.append(ed)

    entity.event_dates = event_dates

    entity.put()

    # Step 2: Next update the search indexes incase anything affecting them has changed
    event_search.maybe_up_update_search_index(entity)

    # Step 3: Kill All caches
    ubercache.cache_invalidate('events')

    return entity


def create_event(data):
    """
    Create an event
    # TODO: Make this transactional
    """

    # check if there are any other events with this slug

    v = Event.query(Event.slug == data['slug']).get()
    if v:
        raise Exception('There is already an Event with the slug "%s". Please select another.' % data['slug'])

    search_index = event_search.get_search_index()

    # Create the base Event Model
    entity = Event()
    entity.slug = data['slug']
    entity.name = data['name']
    entity.url = data['url']

    entity.summary = data['summary']
    entity.content = data['content']
    entity.featured = bool(data['featured'])

    # Create the Event Dates
    # TODO: As we add different event types, pull this into its own method

    event_dates = []
    for d_data in data['event_dates']:
        ed = EventDate()

        ed.category = d_data['category']
        ed.venue_slug = d_data['venue_slug']

        # Check to ensure that venue_slug exists...
        v = venue_api.get_venue_by_slug(d_data['venue_slug'])
        if not v:
            raise Exception("%s is not a know venue slug." % d_data['venue_slug'])

        # TODO: Also check if start is before end, etc

        ed.label = d_data['label']
        ed.type = str(d_data['type']) # This is not a long term solution...
        ed.start = d_data['start'].replace(tzinfo=None) # Expected to be a DateTime or None
        ed.end = d_data['end'].replace(tzinfo=None) # Expected to be a DateTime or None
        event_dates.append(ed)

    entity.event_dates = event_dates

    entity.put()

    # Build search indexes for event dates
    search_docs = event_search.build_index(entity)
    search_index.put(search_docs)

    # Step 3: Delete any cache keys related
    ubercache.cache_invalidate('events')

    return entity
