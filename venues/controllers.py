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
        'resource_id':e.slug,
        'resource':'http://localhost:8080/api/galleries/%s' % e.slug,
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
    
    def _post(self):
        """
        Create Venue Resource
        
        TODO: None of the data is validated right now...
        """

        """
        # Expected payload
        
        {
            "slug": "supercoolgallery",
            "name": "Super Cool Gallery",
            "address": "123 Whatever St",
            "address2": "",
            "city": "Minneapolis",
            "state": "MN",
            "country": "USA",
            "geo": null,
            "website": "http://supercool.com",
            "phone": "612-555-5555",
            "email": "info@totallycool.com",
            "category": "gallery"
        }
        """

        e = venues_api.create_venue(self.data)
        result = create_resource_from_entity(e)
        self.serve_success(result)


class GalleryDetailApiHandler(RestHandlerBase):
    """
    """

    def _get(self, slug):
        # TODO: Abstract this a bit more out into a rest-like service...
        e = venues_api.get_venue_by_slug(slug)

        if not e:
            self.serve_404('Gallery Not Found')
            return False

        resource = create_resource_from_entity(e)
        self.serve_success(resource)
    
    def _put(self, slug):
        """
        Edit a resource
        
        TODO: None of the data is validated right now...
        """

        """
        # Expected payload
        
        {
            "name": "Super Cool Gallery",
            "address": "123 Whatever St",
            "address2": "",
            "city": "Minneapolis",
            "state": "MN",
            "country": "USA",
            "geo": null,
            "website": "http://supercool.com",
            "phone": "612-555-5555",
            "email": "info@totallycool.com",
            "category": "gallery"
        }
        """
        
        venue = venues_api.get_venue_by_slug(slug)

        if not venue:
            self.serve_404('Gallery Not Found')
            return False

        venue = venues_api.edit_venue(venue, self.data)
        result = create_resource_from_entity(venue)
        self.serve_success(result)
