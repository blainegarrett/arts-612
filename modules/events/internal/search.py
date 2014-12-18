# Full text search hooks and helpers for Events

# Queryies we need to be able to perform

# Featured Openings/Closings This Weekend
# Stuff going on right now
# Nearby things happening in an hour
# Things happening tonight near...

import datetime

from google.appengine.api import search
from google.appengine.ext import ndb

from modules.events.internal.models import Event
from modules.events.constants import EVENT_SEARCH_INDEX, CATEGORY
from modules.venues.internal import api as venue_api


def get_search_index():
    """
    Get the search index for Events main search
    """

    return search.Index(EVENT_SEARCH_INDEX)


def _build_event_date(i, event, ed, venue, start, end, is_hours=False):
    """
    Helper to create a specific date - yeilds one search doc
    """
    category = ed.category
    if is_hours:
        category = CATEGORY.HOURS


    fields = []

    doc_id = '%s-%s' % (event.slug, i)
    fields.append(search.TextField(name='name', value=event.name))
    fields.append(search.AtomField(name='slug', value=event.slug))
    fields.append(search.AtomField(name='event_keystr', value=str(event.key.urlsafe())))

    # Populate bits specific to the event date
    fields.append(search.NumberField(name='start', value=unix_time(start)))
    fields.append(search.NumberField(name='end', value=unix_time(end)))
    fields.append(search.AtomField(name='category', value=category))

    # Attach Venue/Geo Information
    fields.append(search.AtomField(name='venue_slug', value=ed.venue_slug))

    venue_geo = None
    if venue.geo:
        venue_geo = search.GeoPoint(venue.geo.lat, venue.geo.lon)
    fields.append(search.GeoField(name='venue_geo', value=venue_geo))

    return search.Document(doc_id=doc_id, fields=fields)


def maybe_up_update_search_index(event):
    """
    On an edit event, we need to build a new set of documents
    """
    # TODO:  Optimize this to see if data has actually changed against what is in the index

    index = get_search_index()

    results = simple_search('event_keystr: %s' % str(event.key.urlsafe()))

    doc_ids = [] # Set??
    for doc in results['index_results']:
        doc_ids.append(doc.doc_id)

    if doc_ids:
        index.delete(doc_ids)

    # Next Rebuild the search index
    search_docs = build_index(event)
    index.put(search_docs)


def build_index(event):
    """
    Construct a search document for the event.
    """

    # We need to create one of these for each of the 'unfolded' event dates

    i = 0

    return_documents = []
    for ed in event.event_dates:

        v_slug = ed.venue_slug
        if not v_slug:
            raise Exception('Can\'t Create Search indexes for events w/o venues yet')

        v_key = venue_api.get_venue_key(v_slug)

        venue = v_key.get()
        if not venue:
            raise Exception('Venue with key %s not found' % ed.venue_slug)

        # Decide to unfold for gallery hours or not?
        if ed.category == CATEGORY.ONGOING:
            hours = venue.hours
            if hours:

                weekday_map = {
                    0:'Monday',
                    1:'Tuesday',
                    2:'Wednesday',
                    3:'Thursday',
                    4:'Friday',
                    5:'Saturday',
                    6:'Sunday'
                }

                test_dt = ed.start
                while(test_dt <= ed.end):
                    #logging.error(test_dt.weekday()) # 1 = Monday
                
                    weekday_key = weekday_map[test_dt.weekday()]
                    #logging.error(weekday_key)

                    has_hours = hours.get(weekday_key, False)
                    if has_hours:
                        #logging.error(has_hours)
                        weekd_day_start = test_dt.replace(hour=has_hours[0])
                        weekd_day_end = test_dt.replace(hour=has_hours[1])

                        return_documents.append(_build_event_date(i, event, ed, venue, weekd_day_start, weekd_day_end, is_hours=True))                    

                    i += 1
                    test_dt = test_dt + datetime.timedelta(days=1)

        # If it was ongoing, it'll remain so for search purposes

        i += 1
        return_documents.append(_build_event_date(i, event, ed, venue, ed.start, ed.end))
        
    return return_documents


def simple_search(querystring=None, start=None, end=None, category=None, limit=100, sort=None):
    """
    TODO: "term", "near", "by type", "now" and any combo
    """

    if not querystring:
        querystring = ''

    # Now = started and hasn't ended yet
    if start:
        if querystring:
            querystring += ' AND '
        querystring += 'start <= %s' % unix_time(start)
    if end:
        if querystring:
            querystring += ' AND '
        querystring += 'end >= %s' % unix_time(end)

    if category:
        if querystring:
            querystring += ' AND '
        if isinstance(category, list):
            querystring += ' ('
            x = 0
            for c in category:
                if x > 0:
                    querystring += ' OR '
                querystring += ' category: %s' % c
                x += 1
            querystring += ' ) '
        else:    
            querystring += 'category: %s' % category


    #DISTANCE_LIMIT = int(3 * 111) # 3 KM - 3 * 10,000km per 90 degrees
    #querystring += ' AND distance(venue_geo, geopoint(%s,%s)) < %s' % (44.958815,-93.238138, DISTANCE_LIMIT)
    
    sort_expressions = []
    if sort:
        direction = search.SortExpression.ASCENDING

        if sort[0] == '-':
            direction = search.SortExpression.DESCENDING
            sort = sort[1:]

        sort_expressions.append(search.SortExpression(expression=sort, direction=direction, default_value=0))

    sort_options = search.SortOptions(expressions=sort_expressions)

    q_options = search.QueryOptions(limit=limit, sort_options=sort_options)

    search_query = search.Query(query_string=querystring, options=q_options)

    index = get_search_index()
    search_results = index.search(search_query)

    # Show # of results
    returned_count = len(search_results.results)
    number_found = search_results.number_found

    return {'number_found': number_found, 'returned_count': returned_count,
            'index_results': search_results}


def get_events_from_event_search_docs(event_docs):
    """
    
    """

    from modules.events.internal.api import get_event_key_by_keystr

    event_keys_to_fetch = [] # Set??
    for doc in event_docs: #search_results['index_results']:
        event_keys_to_fetch.append(get_event_key_by_keystr(doc['event_keystr'][0].value))

    events = ndb.get_multi(event_keys_to_fetch)
    return events


def unix_time(dt):
    if isinstance(dt, basestring):
        try:
            fmt = '%Y-%m-%d %H:%M:%S'
            dt = datetime.datetime.strptime(dt, fmt)
        except ValueError:
            # Attempt full day method
            fmt = '%Y-%m-%d'
            dt = datetime.datetime.strptime(dt, fmt)

    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()


def unix_time_millis(dt):
    return unix_time(dt) * 1000.0


def build_event_index(event, event_dates, venue):
    """
    Construct a search index for the event
    """
    fields = []

    ed = event_dates[0]
    venue_geo = search.GeoPoint(venue.geo.lat, venue.geo.lon)
    fields.append(search.TextField(name='event_slug', value=event.slug))
    fields.append(search.TextField(name='event_title', value=event.title))
    fields.append(search.TextField(name='event_date_label', value=ed.label))
    fields.append(search.NumberField(name='event_date_start_datetime', value=unix_time(ed.start_datetime)))
    fields.append(search.NumberField(name='event_date_end_datetime', value=unix_time(ed.end_datetime)))
    fields.append(search.GeoField(name='venue_geo', value=venue_geo))

    '''
    fields = [
        search.TextField(name='slug', value='222'),
        
        
        search.DateField(name='updated', value=datetime.datetime.now().date()),
        search.TextField(name='name', value='Signed 0003'),
        search.TextField(name='desc', value='uncool'),
        search.AtomField(name='category', value='showing'),
        search.GeoField(name='venuelocation', value=geopoint),
        search.NumberField(name='start_time', value=55),
        search.NumberField(name='end_time', value=67)
        ]
    '''

    return search.Document(doc_id=event.slug, fields=fields)



def put_search_doc(event):
    """
    Rebuild Search Doc for a single Event (and it's date rules)
    """

    search_index = get_search_index()
    search_doc = build_index(event)
    search_index.put([search_doc])
    return event



def build_indexes():
    # TODO: Batch this for actual use
    venues = Event.query().fetch(1000)
    index = get_search_index()

    docs_to_put = []
    for v in venues:
        doc = build_index(v)
        docs_to_put.append(doc)

    return index.put(docs_to_put)
    #raise Exception(add_result) # [search.PutResult(code='OK', id=u'666'), search.PutResult(code='OK', id=u'777')]