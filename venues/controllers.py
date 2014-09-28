"""
Rest API for Venues/Galleries
"""

import webapp2
import json
import traceback

from google.appengine.ext import ndb

#from framework.controllers import MerkabahBaseController
#from framework.rest import RestHandlerBase
from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue


class RestHandlerBase(webapp2.RequestHandler):
    """
    Base Class for All Rest Endpoints
    """
    
    def get(self, *args, **kwargs):
        try:
            self._get(*args, **kwargs)
        except Exception, e:
            self.serve_error(e)
        
    def serve_success(self, result):
        self.serve_response(200, result)

    def serve_404(self, msg='Page Not Found'):
        self.serve_response(404, [], msg)

    def serve_error(self, exception):
        # TODO: Pass in exception stack

        import sys
        exc_type, exc_value, exc_traceback = sys.exc_info()
        formatted_lines = traceback.format_exc().splitlines()

        self.serve_response(500, formatted_lines, str(exception))

    def serve_response(self, status, result, messages=None):
        """
        Serve the response
        """

        payload = {'status': status, 'results': result, 'messages': messages}
        
        #If in debug mode, include stack trace?
        self.response.set_status(status)
        self.response.write(json.dumps(payload))



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
