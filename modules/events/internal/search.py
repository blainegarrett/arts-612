# Full text search hooks and helpers for Events

# Queryies we need to be able to perform

# Featured Openings/Closings This Weekend
# Stuff going on right now
# Nearby things happening in an hour
# Things happening tonight near...

import datetime

from google.appengine.api import search

from modules.events.internal.models import Event
from modules.events.constants import EVENT_SEARCH_INDEX


def get_search_index():
    """
    Get the search index for Events main search
    """

    return search.Index(EVENT_SEARCH_INDEX)


def build_index(event):
    """
    Construct a search document for the event.
    """
    
    # We need to create one of these for each of the 'unfolded' event dates

    i = 0

    return_documents = []
    for ed in event.event_dates:
        
        fields = []

        doc_id = '%s-%s' % (event.slug, i)
        fields.append(search.TextField(name='name', value=event.name))
        fields.append(search.TextField(name='slug', value=event.slug))
        fields.append(search.TextField(name='event_keystr', value=str(event.key.urlsafe())))

        # Populate bits specific to the event date
        fields.append(search.NumberField(name='start', value=unix_time(ed['start'])))
        fields.append(search.NumberField(name='end', value=unix_time(ed['end'])))
        fields.append(search.TextField(name='category', value=ed['category']))

        # Attach Venue/Geo Information
        fields.append(search.TextField(name='venue_slug', value=ed['venue_slug']))

        #venue_geo = None
        #if venue.geo:
        #    venue_geo = search.GeoPoint(venue.geo.lat, venue.geo.lon)
        # fields.append(search.GeoField(name='venue_geo', value=venue_geo))

        return_documents.append(search.Document(doc_id=doc_id, fields=fields))
    return return_documents


def simple_search(querystring):
    """
    TODO: "term", "near", "by type", "now" and any combo
    
    """

    #querystring = self.request.GET.get('q')

    search_query = search.Query(query_string=querystring, options=search.QueryOptions(limit=5))

    index = get_search_index()
    search_results = index.search(search_query)

    # Show # of results
    returned_count = len(search_results.results)
    number_found = search_results.number_found

    return {'number_found': number_found, 'returned_count': returned_count, 'index_results': search_results}



def unix_time(dt):
    if isinstance(dt, basestring):
        fmt = '%Y-%m-%d %H:%M:%S'
        dt = datetime.datetime.strptime(dt, fmt)
        #raise Exception(dt) # 2014-10-15 17:00:00

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