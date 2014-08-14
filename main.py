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

class GalleriesApiHandler(webapp2.RequestHandler):
    def get(self):
        from venues.internal.models import Venue
        
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
                #'geo': e.geo,
                'website': e.website,
                'phone': e.phone,
                'email': e.email,
                'category': e.category,
            }
            data['data'].append(e_data)
        
        
        self.response.write(json.dumps(data))
    

class GalleryDetailApiHandler(webapp2.RequestHandler):
    def get(self, slug):

        key = ndb.Key('Venue', slug)
        e = key.get()

        e_data = {
            'slug': e.slug,
            'name': e.name,
            'address': e.address,
            'address2': e.address2,
            'city': e.city,
            'state' : e.state,
            'country': e.country,
            #'geo': e.geo,
            'website': e.website,
            'phone': e.phone,
            'email': e.email,
            'category': e.category,
        }
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
