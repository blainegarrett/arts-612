"""
Controllers for Venues/Galleries
"""

from google.appengine.ext import ndb

from framework.controllers import MerkabahBaseController
from framework.rest import RestHandlerBase
from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue


class GalleriesApiHandler(RestHandlerBase):
    """
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

        results = []
        for e in entities:
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

            results.append(e_data)

        self.serve_success(results)


class GalleryMainHandler(MerkabahBaseController):
    """
    Main Handler For Gallery Listings
    """
    def get(self):
        """
        """

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


class GalleryDetailApiHandler(RestHandlerBase):
    """
    """

    def _get(self, slug):
        # TODO: Abstract this a bit more out into a rest-like service...
        e = venues_api.get_venue_by_slug(slug)

        if not e:
            self.serve_404('Gallery Not Found')
            return False

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
