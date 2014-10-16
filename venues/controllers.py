"""
Rest API for Venues/Galleries
"""

from google.appengine.ext import ndb

from rest.controllers import RestHandlerBase

from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue



def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    r = {
        'slug': e.slug,
        'name': e.name,
        'address': e.address,
        'address2': e.address2,
        'city': e.city,
        'state': e.state,
        'country': e.country,
        'website': e.website,
        'phone': e.phone,
        'email': e.email,
        'category': e.category,
        'geo': None}

    if e.geo:
        r['geo'] = {'lat': e.geo.lat, 'long': e.geo.lon}
    
    return r


class GalleriesApiHandler(RestHandlerBase):
    """
    Main Handler for Galleries Endpoint
    """

    def _get(self):
        # Check if there is a query filter, etc
        q = self.request.get('q', None)

        if q:
            results = vsearch.simple_search(q)
            # hydrate the search results
            keys_to_fetch = []
            #raise Exception(results)

            for r in results['index_results']:
                keys_to_fetch.append(venues_api.get_venue_key(r.doc_id))

            entities = ndb.get_multi(keys_to_fetch)

        else:
            entities = Venue.query().fetch(1000)


        # Create A set of results based upon this result set - iterator??
        results = []
        for e in entities:
            results.append(create_resource_from_entity(e))

        self.serve_success(results)


class GalleryDetailApiHandler(RestHandlerBase):
    """
    """

    def _get(self, slug):
        # TODO: Abstract this a bit more out into a rest-like service...
        e = venues_api.get_venue_by_slug(slug)

        if not e:
            self.serve_404('Gallery Not Found')
            return False

        vsearch.put_search_doc(e)

        e_data = {
            'slug': e.slug,
            'name': e.name,
            'address': e.address,
            'address2': e.address2,
            'city': e.city,
            'state': e.state,
            'country': e.country,
            'website': e.website,
            'phone': e.phone,
            'email': e.email,
            'category': e.category,
            'geo': None}

        if e.geo:
            e_data['geo'] = {'lat': e.geo.lat, 'long': e.geo.lon}

        self.serve_success(e_data)
