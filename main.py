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

import os
import jinja2
from venues import controllers as vc

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    variable_start_string='{[{',
    variable_end_string='}]}',
    autoescape=True)


class MainHandler(webapp2.RequestHandler):
    """
    """

    def get(self):
        self.response.write('Hello world!')


# Web Routes
# TODO: WE need to somehow inject these into the angular app

# WebGalleries
web_routes = []
rest_routes = []

web_routes += [
    (r'/galleries/([a-z0-9-]+)', 'venues.controllers.GalleryDetailHandler'),
    (r'/galleries', 'venues.controllers.GalleryMainHandler'),
    (r'/import/galleries', 'loaddata.GalleryData'),
    (r'/import/events', 'loaddata.EventData'),
    (r'/', 'main.MainHandler')
]


rest_routes += [('/galleries/([a-z0-9-]+)', vc.GalleryDetailHandler),
    ('/api/galleries', vc.GalleriesApiHandler),
    ('/api/galleries/([a-z0-9-]+)', vc.GalleryDetailApiHandler),
]


# Rest Routes
routes = web_routes + rest_routes
app = webapp2.WSGIApplication(routes, debug=True)
