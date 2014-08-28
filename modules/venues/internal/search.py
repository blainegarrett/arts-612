# Full text search hooks and helpers for Venues

import datetime

from google.appengine.api import search

from modules.venues.internal.models import Venue
from modules.venues.constants import VENUE_SEARCH_INDEX


'''
EVENT_INDEX_NAME = 'events_indexx'

def get_event_search_index():
    return search.Index(EVENT_INDEX_NAME)

def unix_time(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

def unix_time_millis(dt):
    return unix_time(dt) * 1000.0
'''


def get_search_index():
    """
    Get the search index for Venues main search
    """

    return search.Index(VENUE_SEARCH_INDEX)


def build_index(venue):
    """
    Construct a search document for the venue.
    """

    #geopoint = search.GeoPoint(44.962853, -93.239702)

    fields = []
    fields.append(search.TextField(name='slug', value=venue.slug))
    fields.append(search.TextField(name='name', value=venue.name))
    fields.append(search.TextField(name='category', value=venue.category))

    return search.Document(doc_id=venue.slug, fields=fields)


'''
slug = ndb.StringProperty()
name = ndb.StringProperty()
address = ndb.StringProperty()
address2 = ndb.StringProperty()
city = ndb.StringProperty()
state = ndb.StringProperty()
country = ndb.StringProperty()
geo = ndb.GeoPtProperty()
website = ndb.StringProperty()
phone = ndb.StringProperty()
email = ndb.StringProperty()
category = ndb.StringProperty()


e_data = {
    'slug': e.slug,
    'name': e.name,
    'address': e.address,
    'address2': e.address2,
    'city': e.city,
    'state' : e.state,
    'country': e.country,
    'website': e.website,
    'phone': e.phone,
    'email': e.email,
    'category': e.category,
    'geo' : None
}

if e.geo:
    e_data['geo'] = {'lat': e.geo.lat, 'long': e.geo.lon}


'''









def simple_search(querystring):
    """
    
    """

    #querystring = self.request.GET.get('q')

    search_query = search.Query(query_string=querystring, options=search.QueryOptions(limit=5))

    index = get_event_search_index()
    search_results = index.search(search_query)


    # Show # of results
    returned_count = len(search_results.results)
    number_found = search_results.number_found
    
    return {'number_found': number_found, 'returned_count': returned_count, 'index_results': search_results}


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




    

def build_indexes():
    # TODO: Batch this for actual use
    venues = Venue.query().fetch(1000)
    index = get_event_search_index()

    docs_to_put = []
    for v in venues:
        doc = build_index(v)
        docs_to_put.append(doc)

    return index.put(docs_to_put)
    #raise Exception(add_result) # [search.PutResult(code='OK', id=u'666'), search.PutResult(code='OK', id=u'777')]