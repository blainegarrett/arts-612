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

from venues.internal.models import Venue
from google.appengine.ext import ndb
from venues.internal import search as vsearch
from venues.internal import api as vapi

INDEX_NAME = 'venues_indexx'

class GalleryData(webapp2.RequestHandler):
    def get(self):
        
        # Destroy all existing data
        results = Venue.query().fetch(1000)
        docs_to_put = []
        index = search.Index(name=INDEX_NAME)

        for r in results:
            r.key.delete()

        data = [
            {
                'slug': 'gamut',
                'name': 'Gamut Gallery',
                'address': '1006 Marquette Ave',
                'city': 'Minneapolis',
                'geo': '44.973357, -93.273592',
                'category': 'gallery',
                'website': 'http://www.gamutgallerympls.com/',
                'phone': '(612) 293-6497',
                'email': 'art@gamutgallerympls.com'
            }, {
                'slug': 'gallery13',
                'name': 'Gallery 13',
                'address': '811 Lasalle Ave',
                'city': 'Minneapolis',
                'geo': '44.976060, -93.274771',
                'category': 'gallery',
                'website': 'http://www.gallery13.com/',
                'phone': '(651) 592-5503',
                'email': ''
            }, {
                'slug': 'public-functionary',
                'name': 'Public Functionary',
                'address': '1400 12th Ave NE',
                'city': 'Minneapolis',
                'geo': '44.999343, -93.239475',
                'category': 'gallery',
                'website': 'http://publicfunctionary.org/',
                'phone': '612-238-9523',
                'email': 'tricia@publicfunctionary.org'
            }, {
                'slug': 'abstracted-gallery',
                'name': 'Abstracted Gallery',
                'address': '1618 Central Ave NE Suite 110',
                'city': 'Minneapolis',
                'geo': '45.004628, -93.247606',
                'category': 'gallery',
                'website': 'http://www.theabstracted.com/',
                'phone': '',
                'email': 'jcoleman@theabstracted.com'
            }, {
                'slug': 'soap-factory',
                'name': 'The Soap Factory',
                'address': '514 2nd St. SE',
                'city': 'Minneapolis',
                'geo': '44.983440, -93.249613',
                'category': 'gallery',
                'website': 'http://www.soapfactory.org/',
                'phone': '612-623-9176',
                'email': 'info@soapfactory.org'
            }, {
                'slug': 'soovac',
                'name': 'Soo Visual Arts Center',
                'address': '2638 Lyndale Ave. S',
                'city': 'Minneapolis',
                'geo': '44.954464, -93.288527',
                'category': 'gallery',
                'website': 'http://www.soovac.org/',
                'phone': '612.871.2263 ',
                'email': 'info@soovac.org'
            }, {
                'slug': 'obsidian-arts',
                'name': 'Obsidian Arts',
                'address': '2948 Chicago Ave. S',
                'city': 'Minneapolis',
                'geo': '44.950358, -93.262700',
                'category': 'gallery',
                'website': 'http://www.obsidianartscenter.org/',
                'phone': '612.787.3644',
                'email': ''
            }, {
                'slug': 'franklin-art-works',
                'name': 'Franklin Artworks',
                'address': '1021 E. Franklin Ave',
                'city': 'Minneapolis',
                'geo': '44.962665, -93.258792',
                'category': 'gallery',
                'website': 'http://www.franklinartworks.org',
                'phone': '612.872.7494',
                'email': ''
            }, {
                'slug': 'altered-esthetics',
                'name': 'Altered Esthetics',
                'address': '1224 Quincy St NE',
                'city': 'Minneapolis',
                'geo': '45.000907, -93.251606',
                'category': 'gallery',
                'website': 'http://www.alteredesthetics.org/',
                'phone': '(612) 378-8888',
                'email': 'contact@alteredesthetics.org'
            }, {
                'slug': 'rosalux',
                'name': 'Rosalux Gallery',
                'address': '1400 Van Buren Street NE #195, Mpls, MN 55413',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'http://rosaluxgallery.com',
                'phone': '',
                'email': 'rosalux@rosaluxgallery.com'
            }, {
                'slug': 'bockley',
                'name': 'Bockley Gallery',
                'address': '2123 W 21st Street, Mpls, MN 55405',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'http://www.bockleygallery.com/',
                'phone': '612 377 4669 ',
                'email': 'information@bockleygallery.com '
            }, {
                'slug': 'shoebox',
                'name': 'The Shoebox Gallery',
                'address': '2948 Chicago Ave S Minneapolis',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'https://plus.google.com/101590535253031148702/about?gl=us&hl=en',
                'phone': '(612) 825-3833',
                'email': ''
            }, {
                'slug': 'third-place',
                'name': 'The Third Place',
                'address': '3730 Chicago Ave So, Studio B, Minneapolis, MN 55407',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'http://www.wingyounghuie.com',
                'phone': '612-817-2771',
                'email': 'info@wingyounghuie.com'
            }, {
                'slug': 'kolman-pryor',
                'name': 'Kolman Pryor Gallery',
                'address': '1500 Jackson Street NE.,Studio 395, Minneapolis, MN 55413',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'http://www.kolmanpryorgallery.com',
                'phone': '612.385.4239',
                'email': 'info@kolmanpryorgallery.com'
            }, {
                'slug': 'all-my-relations',
                'name': 'All My Relations Gallery',
                'address': '1414 E. Franklin Ave., Minneapolis, MN 55404',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'http://www.nacdi.org/default/',
                'phone': '(612) 235-4976',
                'email': ''
            }, {
                'slug': 'midway-contemporary',
                'name': 'Midway Contemporary Art',
                'address': '527 Second Avenue SE, Mpls, MN 55414',
                'city': 'Minneapolis',
                'geo': '',
                'category': 'gallery',
                'website': 'http://www.midwayart.org',
                'phone': '612-605-4504',
                'email': 'info@midwayart.org'
            },
        ]
        
        stuff_to_put = []
        for v_data in data:

            v_data['state'] = 'MN'
            v_data['country'] = 'USA'
            stuff_to_put.append(vapi.create_venue(v_data))
        self.response.write('Created %s Venues' % len(stuff_to_put))
