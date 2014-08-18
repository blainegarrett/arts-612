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
from google.appengine.api import search
import datetime
import json
import loaddata
from google.appengine.ext import ndb
from venues.internal import api as venues_api
from venues.internal import search as vsearch

class GalleriesApiHandler(webapp2.RequestHandler):
    def get(self):
        from venues.internal.models import Venue
        
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
        
        data = {'data': [] }
        for e in entities:
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

            data['data'].append(e_data)

        self.response.write(json.dumps(data))
    

class GalleryDetailApiHandler(webapp2.RequestHandler):
    def get(self, slug):
        
        
        # TODO: Abstract this a bit more out into a rest-like service...
        e = venues_api.get_venue_by_slug(slug)

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

        data = {'data': e_data }
        self.response.write(json.dumps(data))


class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')



app = webapp2.WSGIApplication([
    ('/import/galleries', loaddata.GalleryData),
    ('/api/galleries', GalleriesApiHandler),
    ('/api/galleries/([a-z0-9-]+)', GalleryDetailApiHandler),
    ('/', MainHandler)
], debug=True)
