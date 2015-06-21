# Full text search hooks and helpers for Venues

import datetime

from google.appengine.api import search

from modules.venues.constants import VENUE_SEARCH_INDEX


def get_substrs(value):
    """
    Given Value, exploads each word into substrings
    """

    names = value.lower().split(' ')
    tokens = []
    for n in names:
        length = len(n)
        for i in xrange(0, length):
            tokens.append(n[:i+1])
    return " ".join(tokens)


def get_search_index():
    """
    Get the search index for Venues main search
    """

    return search.Index(VENUE_SEARCH_INDEX)


def build_index(venue):
    """
    Construct a search document for the venue.
    TODO: This needs to be done yet
    """

    # Construct Search document feilds
    fields = []
    fields.append(search.AtomField(name='slug', value=venue.slug))
    fields.append(search.TextField(name='name', value=venue.name))
    fields.append(search.AtomField(name='category', value=venue.category))
    fields.append(search.TextField(name='substrs', value=get_substrs(venue.name)))

    geopoint = None
    if venue.geo:
        pt = venue.geo[0]
        geopoint = search.GeoPoint(pt.lat, pt.lon)
        fields.append(search.GeoField(name='geo', value=geopoint))

    return search.Document(doc_id=venue.slug, fields=fields)


def simple_search(querystring):
    """
    TODO: "term", "near", "by type", "now" and any combo
    """

    #raise Exception('Searching for Venues is disabled for the time being.')

    search_query = search.Query(query_string=querystring, options=search.QueryOptions(limit=10))

    index = get_search_index()
    search_results = index.search(search_query)

    # Show # of results
    returned_count = len(search_results.results)
    number_found = search_results.number_found

    return {
        'number_found': number_found,
        'returned_count': returned_count,
        'index_results': search_results
    }


def unix_time(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()


def put_search_doc(venue):
    """
    Rebuild Search Doc for a single venue
    """

    search_index = get_search_index()
    search_doc = build_index(venue)
    search_index.put([search_doc])
    return venue

'''
def build_indexes():
    """
    Simple Helper to repopulate search docs for all venues
    """

    # TODO: Batch this for actual use
    venues = Venue.query().fetch(1000)
    index = get_search_index()

    docs_to_put = []
    for v in venues:
        doc = build_index(v)
        docs_to_put.append(doc)

    return index.put(docs_to_put)
'''
