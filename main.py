#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2

import json
import loaddata
from google.appengine.ext import ndb
from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue
import traceback


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

class MainHandler(webapp2.RequestHandler):
    """
    """

    def get(self):
        self.response.write('Hello world!')

app = webapp2.WSGIApplication([
    ('/import/galleries', loaddata.GalleryData),
    ('/import/events', loaddata.EventData),
    ('/api/galleries', GalleriesApiHandler),
    ('/api/galleries/([a-z0-9-]+)', GalleryDetailApiHandler),
    ('/', MainHandler)],
    debug=True)

