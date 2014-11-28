# Handlers for bulk importing data

import webapp2
from google.appengine.api import search

from modules.venues.internal.models import Venue
from modules.venues.internal import search as vsearch
from modules.venues.internal import api as vapi
from modules.venues.constants import VENUE_SEARCH_INDEX


class GalleryData(webapp2.RequestHandler):
    """
    Temporary Handler to import a bunch of Venues
    """

    def get(self):
        
        # Fetch all Events
        docs_to_put = []
        results = Venue.query().fetch(1000)
        search_index = search.Index(name=VENUE_SEARCH_INDEX)

        for entity in results:
            docs_to_put.append(vsearch.build_index(entity))
        
        search_index.put(docs_to_put)
        
        raise Exception(docs_to_put)
        return 
        
        # Destroy all existing data
        results = Venue.query().fetch(1000)
        docs_to_put = []
        index = search.Index(name=VENUE_SEARCH_INDEX)

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
                'phone': '612-293-6497',
                'email': 'art@gamutgallerympls.com'
            }, {
                'slug': 'gallery13',
                'name': 'Gallery 13',
                'address': '811 Lasalle Ave',
                'city': 'Minneapolis',
                'geo': '44.976060, -93.274771',
                'category': 'gallery',
                'website': 'http://www.gallery13.com/',
                'phone': '651-592-5503',
                'email': 'info@gallery13.com'
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
                'phone': '612-871-2263 ',
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
                'phone': '612-872-7494',
                'email': ''
            }, {
                'slug': 'altered-esthetics',
                'name': 'Altered Esthetics',
                'address': '1224 Quincy St NE',
                'city': 'Minneapolis',
                'geo': '45.000907, -93.251606',
                'category': 'gallery',
                'website': 'http://www.alteredesthetics.org/',
                'phone': '612-378-8888',
                'email': 'contact@alteredesthetics.org'
            }, {
                'slug': 'rosalux',
                'name': 'Rosalux Gallery',
                'address': '1400 Van Buren Street NE #195',
                'city': 'Minneapolis',
                'geo': '45.002803, -93.248836',
                'category': 'gallery',
                'website': 'http://rosaluxgallery.com',
                'phone': '',
                'email': 'rosalux@rosaluxgallery.com'
            }, {
                'slug': 'bockley',
                'name': 'Bockley Gallery',
                'address': '2123 W 21st Street, Mpls, MN 55405',
                'city': 'Minneapolis',
                'geo': '44.961904, -93.308112',
                'category': 'gallery',
                'website': 'http://www.bockleygallery.com/',
                'phone': '612-377-4669 ',
                'email': 'information@bockleygallery.com '
            }, {
                'slug': 'shoebox',
                'name': 'The Shoebox Gallery',
                'address': '2948 Chicago Ave S',
                'city': 'Minneapolis',
                'geo': '44.950392, -93.262682',
                'category': 'gallery',
                'website': 'https://plus.google.com/101590535253031148702/about?gl=us&hl=en',
                'phone': '612-825-3833',
                'email': ''
            }, {
                'slug': 'third-place',
                'name': 'The Third Place',
                'address': '3730 Chicago Ave So, Studio B',
                'city': 'Minneapolis',
                'geo': '44.935334, -93.262516',
                'category': 'gallery',
                'website': 'http://www.wingyounghuie.com',
                'phone': '612-817-2771',
                'email': 'info@wingyounghuie.com'
            }, {
                'slug': 'kolman-pryor',
                'name': 'Kolman Pryor Gallery',
                'address': '1500 Jackson St NE #395',
                'city': 'Minneapolis',
                'geo': '45.004171, -93.250036',
                'category': 'gallery',
                'website': 'http://www.kolmanpryorgallery.com',
                'phone': '612-385-4239',
                'email': 'info@kolmanpryorgallery.com'
            }, {
                'slug': 'all-my-relations',
                'name': 'All My Relations Gallery',
                'address': '1414 E. Franklin Ave',
                'city': 'Minneapolis',
                'geo': '44.963038, -93.254424',
                'category': 'gallery',
                'website': 'http://www.nacdi.org/default/',
                'phone': '612-235-4976',
                'email': ''
            }, {
                'slug': 'midway-contemporary',
                'name': 'Midway Contemporary Art',
                'address': '527 Second Avenue SE',
                'city': 'Minneapolis',
                'geo': '44.988944, -93.251482',
                'category': 'gallery',
                'website': 'http://www.midwayart.org',
                'phone': '612-605-4504',
                'email': 'info@midwayart.org'
            }, {
                'slug': 'form-content-gallery',
                'name': 'Form + Content Gallery',
                'address': '210 2nd St N',
                'city': 'Minneapolis',
                'geo': '44.985837, -93.270745',
                'category': 'gallery',
                'website': 'http://www.formandcontent.org/',
                'phone': '612-436-1151',
                'email': 'formandcontent@gmail.com'
            }, {
                'slug': 'veronique-wantz-gallery',
                'name': 'Veronique Wantz Gallery',
                'address': '125 N 1st St',
                'city': 'Minneapolis',
                'geo': '44.985385, -93.269060',
                'category': 'gallery',
                'website': 'http://veroniquewantz.com',
                'phone': '612-254-2838',
                'email': 'veronique@veroniquewantz.com'
            }, {
                'slug': 'gallery-427',
                'name': 'Gallery 427',
                'address': '1500 Jackson St NE; #427',
                'city': 'Minneapolis',
                'geo': '45.004209, -93.250025',
                'category': 'gallery',
                'website': 'http://www.gallery427.com',
                'phone': '612-379-2237',
                'email': 'info@gallery427.com'
            }, {
                'slug': 'nash-gallery',
                'name': 'Katherine E. Nash Gallery',
                'address': '405 21st Ave S',
                'city': 'Minneapolis',
                'geo': '44.969566, -93.242290',
                'category': 'gallery',
                'website': 'https://art.umn.edu/nash',
                'phone': '612-624-7530',
                'email': 'artdept@umn.edu'
            }, {
                'slug': 'tuckunder-projects',
                'name': 'Tuck Under Projects',
                'address': '5120 York Ave S',
                'city': 'Minneapolis',
                'geo': '44.969566, -93.242290',
                'category': 'gallery',
                'website': 'http://www.tuckunder.org/',
                'phone': '',
                'email': 'info@tuckunder.org'
            },
            
            {
                'slug': 'sebastian-joes-franklin',
                'name': "Sebastian Joe's Ice Cream Cafe",
                'address': '1007 W Franklin Ave, Minneapolis',
                'city': 'Minneapolis',
                'geo': '44.96246,-93.292142',
                'category': 'business',
                'website': 'http://sebastianjoesicecream.com/',
                'phone': '',
                'email': '',
            }, {
                'slug': 'temp',
                'name': 'Temporary Autonomous Museum of Contemporary Art',
                'address': '3400 Cedar Avenue S',
                'city': 'Minneapolis',
                'geo': '44.9412077,-93.2476723',
                'category': 'gallery',
                'website': 'http://www.ryanfontaine.com/theTEMP',
                'phone': '',
                'email': ''
            }, {
                'slug': 'northrup-king-building',
                'name': 'Northrup King Building',
                'address': '1500 Jackson St NE',
                'city': 'Minneapolis',
                'geo': '45.0045658,-93.2488449',
                'category': 'studios',
                'website': 'http://www.northrupkingbuilding.com/',
                'phone': '',
                'email': ''
            }, {
                'slug': 'soo-local',
                'name': 'Soo Local',
                'address': '3506 Nicollet Ave',
                'city': 'Minneapolis',
                'geo': '44.9395448,-93.277924',
                'category': 'gallery',
                'website': 'http://www.soovac.org/',
                'phone': '',
                'email': ''
            }, {
                'slug': 'vine-arts',
                'name': 'Vine Arts',
                'address': '2637 27th AVE S',
                'city': 'Minneapolis',
                'geo': '44.9546669,-93.2327891',
                'category': 'studios',
                'website': 'http://www.vineartscenter.com/',
                'phone': '',
                'email': ''
            }, {
                'slug': 'fox-tax',
                'name': 'Fox Tax',
                'address': '503 1st Ave NE',
                'city': 'Minneapolis',
                'geo': '44.9903532,-93.254127',
                'category': 'business',
                'website': 'http://www.foxtaxservice.com/',
                'phone': '',
                'email': ''
            },
            {
                'slug': 'circa-gallery',
                'name': 'Circa Gallery',
                'address': '210 N First St',
                'city': 'Minneapolis',
                'geo': '44.9843177,-93.2692948',
                'category': 'gallery',
                'website': 'http://www.circagallery.org/',
                'phone': '',
                'email': ''
            }, {
                'slug': 'gallery-122',
                'name': 'Gallery 122 at Hang It',
                'address': '122 8th Street SE',
                'city': 'Minneapolis',
                'geo': '44.991017,-93.250127',
                'category': 'gallery',
                'website': 'http://www.hangitinc.com/',
                'phone': '',
                'email': '',
            }, {
                'slug': 'midnight-brigade',
                'name': 'The Midnight Brigade',
                'address': '1830 E 35th St',
                'city': 'Minneapolis',
                'geo': '44.9396802,-93.2468541',
                'category': 'gallery',
                'website': 'https://www.facebook.com/pages/The-Midnight-Brigade/292777424261005',
                'phone': '',
                'email': ''
            }, {
                'slug': 'stevens-square-arts',
                'name': 'Stevens Square Center for the Arts',
                'address': '1905 3rd Ave S',
                'city': 'Minneapolis',
                'geo': '44.96374,-93.272387',
                'category': 'gallery',
                'website': 'http://www.stevensarts.org/',
                'phone': '(612) 879-0200',
                'email': 'ssca@stevensarts.org'
            }, {
                'slug': 'intermedia-arts',
                'name': 'Intermedia Arts',
                'address': '2822 Lyndale Ave S',
                'city': 'Minneapolis',
                'geo': '44.951095,-93.2885514',
                'category': 'gallery',
                'website': 'http://www.intermediaarts.org/',
                'phone': '(612) 871-4444',
                'email': 'Info@IntermediaArts.org'
            }, {
                'slug': 'highpoint',
                'name': 'Highpoint Center for Printmaking',
                'address': '912 West Lake Street',
                'city': 'Minneapolis',
                'geo': '44.9486836,-93.2914843',
                'category': 'gallery',
                'website': 'http://highpointprintmaking.org/',
                'phone': '',
                'email': ''
            }, {
                'slug': 'mcad',
                'name': 'Minneapolis College of Art and Design',
                'address': '2501 Stevens Avenue',
                'city': 'Minneapolis',
                'geo': '44.9567218,-93.2746323',
                'category': 'gallery',
                'website': 'http://mcad.edu/',
                'phone': '',
                'email': ''
            }, {
                'slug': 'grainbelt-bottling-house',
                'name': 'Grain Belt Bottling House',
                'address': '79 13th Ave NE',
                'city': 'Minneapolis',
                'geo': '44.999758,-93.271099',
                'category': 'studios',
                'website': '',
                'phone': '',
                'email': ''
            }, {
                'slug': 'bauhaus',
                'name': 'Bauhaus Brew Labs',
                'address': '1315 Tyler St NE',
                'city': 'Minneapolis',
                'geo': '45.0010838,-93.2457776',
                'category': 'business',
                'website': 'http://bauhausbrewlabs.com/',
                'phone': '',
                'email': ''
            },
                
        ]
        
        stuff_to_put = []
        for v_data in data:

            v_data['state'] = 'MN'
            v_data['country'] = 'USA'
            stuff_to_put.append(vapi.create_venue(v_data))
        self.response.write('Created %s Venues' % len(stuff_to_put))
