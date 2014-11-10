"""
Rest API for Venues/Galleries
"""

from google.appengine.ext import ndb

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField, GeoField

from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue

from framework.controllers import MerkabahBaseController

resource_url = 'http://localhost:8080/api/galleries/%s' #TODO: HRM?

REST_RULES = [
    ResourceIdField(always=True),
    ResourceUrlField(resource_url, always=True),
    SlugField(Venue.slug, always=True),
    RestField(Venue.name, always=True),
    
    RestField(Venue.address, always=True),
    RestField(Venue.address2, always=True),
    RestField(Venue.city, always=True),
    RestField(Venue.state, always=True),
    RestField(Venue.country, always=True),

    RestField(Venue.website, always=True),
    RestField(Venue.phone, always=True),
    RestField(Venue.email, always=True),
    RestField(Venue.category, always=True),
    RestField(Venue.hours, always=True),
    GeoField(Venue.geo, always=True),    
]

def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    import logging
    logging.warning('--------Venue Create Resource----------------')
    logging.warning(e)

    return Resource(e, REST_RULES).to_dict()

    try:
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
            'geo': None
        }
    except AttributeError, ex:
        raise Exception('Attempting to create venue resource? Received:  %s' % e)

    if e.geo:
        r['geo'] = {'lat': e.geo.lat, 'lon': e.geo.lon}
    
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
            "geo": {
                        "lat": 45.004628,
                        "lon": -93.247606
                    },
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


    def _delete(self, slug):
        """
        Delete a Resource
        """

        venue = venues_api.get_venue_by_slug(slug)

        if not venue:
            self.serve_404('Gallery Not Found')
            return False

        result = venues_api.delete_venue(venue, self.data)
        self.serve_success(result)



# Web Handlers

class GalleryMainHandler(MerkabahBaseController):
    """
    Main Handler For Gallery Listings
    """
    def get(self):
        pagemeta = {'title': 'Galleries and Venues', 'description': 'A Directory of Galleries and Places that Show Art in Minneapolis', 'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'}
        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)        


class GalleryDetailHandler(MerkabahBaseController):
    """
    Handler for Serving up the chrome for the gallery page
    """

    def get(self, slug):
        # TODO: Abstract this a bit more out into a rest-like service...
        e = venues_api.get_venue_by_slug(slug)

        if not e:
            self.response.write('Gallery Not Found with slug %s' % slug)
            #self.serve_404('Gallery Not Found')
            #return False

        pagemeta = {'title': 'cooooool', 'description': 'this is wicked cool', 'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'}
        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)

