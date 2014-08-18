# Full text search hooks and helpers

from google.appengine.api import search

from venues.internal.models import Venue

doc_limit = 5
INDEX_NAME = 'venues_indexx'

def get_search_index():
    return search.Index(INDEX_NAME)

def simple_search(querystring):
    #querystring = self.request.GET.get('q')

    search_query = search.Query(query_string=querystring, options=search.QueryOptions(limit=doc_limit))

    index = search.Index(INDEX_NAME)
    search_results = index.search(search_query)


    # Show # of results
    returned_count = len(search_results.results)
    number_found = search_results.number_found
    
    return {'number_found': number_found, 'returned_count': returned_count, 'index_results': search_results}


def build_index(venue):
    """
    Construct a search index for the venue
    """
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
    # Precision Grind
    #geopoint = search.GeoPoint(44.962853, -93.239702)

    fields = []
    
    fields.append(search.TextField(name='slug', value=venue.slug))
    fields.append(search.TextField(name='name', value=venue.name))
    fields.append(search.TextField(name='category', value=venue.category))

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

    return search.Document(doc_id=venue.slug, fields=fields)

    

def build_indexes():
    # TODO: Batch this for actual use
    venues = Venue.query().fetch(1000)
    index = search.Index(name=INDEX_NAME)

    docs_to_put = []
    for v in venues:
        doc = build_index(v)
        docs_to_put.append(doc)

    return index.put(docs_to_put)
    #raise Exception(add_result) # [search.PutResult(code='OK', id=u'666'), search.PutResult(code='OK', id=u'777')]