# Handlers for bulk importing data
# We need to figure out a better way to bulk import data...

import pytz
from pytz import timezone
import webapp2
import datetime
from google.appengine.api import search

from modules.events.internal.models import Event
from modules.events.internal import search as esearch
from modules.events.internal import api as eapi
from modules.events.constants import EVENT_SEARCH_INDEX

import logging
def convert_rest_dt_to_datetime(dt):
    centraltz = timezone('US/Central')

    try:
        fmt = '%Y-%m-%d %H:%M:%S'
        dt = datetime.datetime.strptime(dt, fmt)
    except ValueError:
        # Attempt full day method
        fmt = '%Y-%m-%d'
        dt = datetime.datetime.strptime(dt, fmt)

    dt = timezone('US/Central').localize(dt)
    dt =  dt.astimezone(timezone('UTC'))
    return dt.replace(tzinfo=None)
    

class EventData(webapp2.RequestHandler):
    """
    Temporary Handler to import a bunch of Events
    """

    def get(self):

        raise Exception('This is here to not accidentally overwrite data in production...')
        return

        # Destroy all existing data
        results = Event.query().fetch(1000)
        docs_to_put = []
        index = esearch.get_search_index()

        for r in results:
            r.key.delete()

        data = [
            {
                    "url": "http://www.kolmanpryorgallery.com/exhibition/mutable-landscapes/",
                    "event_dates": [{
                        "category": "reception",
                        "start": "2014-11-08 19:00:00",
                        "end": "2014-11-08 22:00:00",
                        "label": "opening night!",
                        "type": "timed",
                        "venue_slug": "kolman-pryor"
                    }],
                    "slug": "mutable-landscapes",
                    "name": "Mutable Landscapes - Patrick Kemal Pryor"
            },
            {
                "url" : "http://www.tuckunder.org/",
                "event_dates": [{
                    "category": "reception",
                    "start": "2014-10-30 18:00:00",
                    "end": "2014-10-30 21:00:00",
                    "type": "timed",
                    "label": "On Display",
                    "venue_slug": "tuckunder-projects"
                }],
                "slug": "36chmbrz",
                "name": "36CHMBRZ"
            },
            {
                "url" : "http://www.soapfactory.org/exhibit.php?content_id=706",
                "event_dates": [{
                    "category": "reception",
                    "start": "2014-11-15 18:00:00",
                    "end": "2014-11-16 00:00:00",
                    "type": "timed",
                    "label": "Party",
                    "venue_slug": "soap-factory"
                }],
                "slug": "soap-factory-day",
                "name": "Soap Factory Day and 25th Anniversary Party"
            }, {
            "url" : "https://www.facebook.com/events/724306997652799",
            "slug": "mark-schoening-shapeshifter",
            "name": "Mark Schoening: shapeshifter",
            "event_dates": [{
                "category": "reception",
                "start": "2014-11-14 19:00:00",
                "end": "2014-11-14 22:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "midnight-brigade"
            }],                
            }, {
            "url" : "http://www.soovac.org/index.php/shows/view/untitled_11_soovacs_11th_annual_juried_exhibition/",
            "slug": "soovac-untitled-11",
            "name": "Untitled 11: SooVac's 11th Annual Juried Exhibition",
            "event_dates": [{
                "category": "reception",
                "start": "2014-11-15 19:00:00",
                "end": "2014-11-15 21:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "soovac"
            },
            {
                "category": "ongoing",
                "start": "2014-11-15 00:00:00",
                "end": "2014-12-28 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "soovac"
            }
            
            ],
            },

            {
            "url" : "https://www.facebook.com/events/677020089080861/",
            "slug": "gamut-c4w-2104-finale",
            "name": "C4W:2014 - Curated by Kristoffer Knutson",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-24 00:00:00",
                "end": "2014-11-22 00:00:00",
                "type": "reoccurring",
                "label": "Ongoing",
                "venue_slug": "gamut"
             }],
             },
            
             {
            "url" : "http://publicfunctionary.org/now/",
            "slug": "inkala-chaos-complex",
            "name": "Inkala: Chaos Complex",
            "event_dates": [{
                "category": "reception",
                "start": "2014-11-22 19:00:00",
                "end": "2014-11-23 00:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "public-functionary"
            },
            {
                "category": "ongoing",
                "start": "2014-11-22 00:00:00",
                "end": "2014-12-20 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "public-functionary"
            }
            
            ],
            }, {
            "url" : "http://www.hangitinc.com/art_shows.html",
            "slug": "doodles-5-year-journey",
            "name": "Doodles: A 5 Year Journey",
            "event_dates": [{
                "category": "reception",
                "start": "2014-12-05 19:00:00",
                "end": "2014-12-05 21:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "gallery-122"
            }],
            },  {
            "url" : "http://highpointprintmaking.org/",
            "slug": "prints-on-ice",
            "name": "Prints on Ice",
            "event_dates": [{
                "category": "sale",
                "start": "2014-12-05 19:30:00",
                "end": "2014-12-05 21:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "highpoint"
            }],
            }, {
            "url" : "https://www.facebook.com/events/882117088465341/",
            "slug": "raging-art-on-2014",
            "name": "Raging Art On - 2014",
            "event_dates": [{
                "category": "sale",
                "start": "2014-12-12 12:00:00",
                "end": "2014-12-13 22:00:00",
                "type": "timed",
                "label": "Opening Night",
                "venue_slug": "gamut"
            },],

            }, 
             {
            "url" : "http://www.midwayart.org/events/mdr7/",
            "slug": "monster-drawing-rally-7",
            "name": "7th Annual Monster Drawing Rally",
            "event_dates": [{
                "category": "reception",
                "start": "2014-12-13 18:00:00",
                "end": "2014-12-13 22:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "grainbelt-bottling-house"
            }],
            }, {
            "url" : "http://mcad.edu/events-fellowships/art-sale",
            "slug": "mcad-art-sale-2014",
            "name": "MCAD Art Sale",
            "event_dates": [{
                "category": "sale",
                "start": "2014-11-22 18:00:00",
                "end": "2014-11-22 21:00:00",
                "type": "timed",
                "label": "Day 1",
                "venue_slug": "mcad"
            }, {
                "category": "sale",
                "start": "2014-11-23 18:00:00",
                "end": "2014-11-23 21:00:00",
                "type": "timed",
                "label": "Day 2",
                "venue_slug": "mcad"
                }],
            }, 
            
            {
            "url" : "https://www.facebook.com/events/1502473189988054/",
            "slug": "on-fertile-ground",
            "name": "On Fertile Ground",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-08-15 00:00:00",
                "end": "2014-11-15 00:00:00",
                "type": "reoccurring",
                "label": "On Display",
                "venue_slug": "all-my-relations"
            }]
            },

            {
            "url" : "http://foxtaxservice.com/gallery/",
            "slug": "patefacio",
            "name": u"Patefaci\u014D",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-18 00:00:00",
                "end": "2014-11-15 00:00:00",
                "type": "reoccurring",
                "label": "On Display",
                "venue_slug": "fox-tax"
            }]
            },
            

            {
            "url" : "http://www.circagallery.org/",
            "slug": "carmen-vetter-folding-vaulting",
            "name": u"Carmen Vetter: Folding | Vaulting",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-04 00:00:00",
                "end": "2014-11-15 00:00:00",
                "type": "reoccurring",
                "label": "On Display",
                "venue_slug": "circa-gallery"
            }]
            },

            {
            "url" : "https://www.facebook.com/events/189268111243845/",
            "slug": "doors-to-the-underworld",
            "name": u"Doorways to the Underworld",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-25 00:00:00",
                "end": "2014-11-15 00:00:00",
                "type": "reoccurring",
                "label": "On Display",
                "venue_slug": "stevens-square-arts"
            }]
            },

             {
                "url" : "https://art.umn.edu/nash",
                "slug": "thinking-making-living",
                "name": u"Thinking Making Living",
                "event_dates": [{
                    "category": "ongoing",
                    "start": "2014-09-02 00:00:00",
                    "end": "2014-12-13 00:00:00",
                    "type": "reoccurring",
                    "label": "On Display",
                    "venue_slug": "nash-gallery"
                }]
            },

             {
                "url" : "http://www.midwayart.org/exhibitions/14_04_megan_francis_sullivan/",
                "slug": "click-click-space-space",
                "name": u"click click, space space - Megan Francis Sullivan",
                "event_dates": [{
                    "category": "ongoing",
                    "start": "2014-11-07 00:00:00",
                    "end": "2014-12-20 00:00:00",
                    "type": "reoccurring",
                    "label": "On Display",
                    "venue_slug": "midway-contemporary"
                }]
            },

             {
                "url" : "http://www.intermediaarts.org/catalyst-series-the-blacker-the-berry",
                "slug": "the-blacker-the-berry",
                "name": u"The Blacker The Berry ...",
                "event_dates": [{
                    "category": "ongoing",
                    "start": "2014-11-05 00:00:00",
                    "end": "2015-01-10 00:00:00",
                    "type": "reoccurring",
                    "label": "On Display",
                    "venue_slug": "intermedia-arts"
                }]
            },

            {
            "url" : "https://www.facebook.com/events/310047975865939/",
            "slug": "made-by-hands",
            "name": "Made By Hands - Holiday Sale",
            "event_dates": [{
                "category": "sale",
                "start": "2014-11-30 12:00:00",
                "end": "2014-11-30 19:00:00",
                "type": "timed",
                "label": "Event",
                "venue_slug": "bauhaus"
            }],
            },

            {
            "url" : "https://www.facebook.com/events/673422836110831/",
            "slug": "drew-peterson-waterworks",
            "name": "Drew Peterson / Waterworks",
            "event_dates": [{
                "category": "reception",
                "start": "2014-12-12 18:00:00",
                "end": "2014-12-12 21:00:00",
                "type": "timed",
                "label": "Event",
                "venue_slug": "burnet-gallery"
            }],
            },


            
            
            {
            "url" : "http://burlesquedesign.com/blogs/main/15907508-co-exhibitions-world-craft-fair-coming-soon",
            "slug": "co-exhibitions-world-craft-fair",
            "name": "CO Exhibition's 5th Annual World Fair",
            "event_dates": [{
                "category": "sale",
                "start": "2014-12-13 10:00:00",
                "end": "2014-12-13 18:00:00",
                "type": "timed",
                "label": "Sale",
                "venue_slug": "co-exhibitions-gallery"
            }],
            },
            {
            "url" : "https://www.facebook.com/events/1513775338906703/",
            "slug": "elements-of-the-underground-makers-market",
            "name": "Elements of the Underground Makers Market",
            "event_dates": [{
                "category": "sale",
                "start": "2014-12-13 14:00:00",
                "end": "2014-12-13 21:00:00",
                "type": "timed",
                "label": "Sale",
                "venue_slug": "abstracted-gallery"
            }],
            },

            {
            "url" : "http://gallery360mpls.com/events/upcoming.php?page=upcoming",
            "slug": "oil-paintings-by-clinton-rost",
            "name": "Oil Paintings by Clinton Rost",
            "event_dates": [{
                "category": "reception",
                "start": "2015-01-11 19:00:00",
                "end": "2015-01-11 22:00:00",
                "type": "timed",
                "label": "Opening",
                "venue_slug": "gallery-360"
            }],
            },
            


            {
            "url" : "https://art.umn.edu/nash",
            "slug": "longest-way-around-james-henkel-joyce-lyon",
            "name": "The Longest Way Around is the Shortest Way Home: James Henkel & Joyce Lyon",
            "event_dates": [{
                "category": "reception",
                "start": "2015-02-25 19:00:00",
                "end": "2015-02-25 21:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "nash-gallery"
            }, {
                    "category": "ongoing",
                    "start": "2015-02-24 00:00:00",
                    "end": "2015-03-28 00:00:00",
                    "type": "reoccurring",
                    "label": "Showing",
                    "venue_slug": "nash-gallery"
                 }
            
            ],
            },

            {
            "url" : "http://www.formandcontent.org/upcoming-exhibitions/",
            "slug": "sticky-valentines-mark-ostapchuk",
            "name": "Sticky Valentines: Mark Ostapchuk",
            "event_dates": [{
                "category": "reception",
                "start": "2015-01-03 18:00:00",
                "end": "2015-01-03 20:00:00",
                "type": "timed",
                "label": "Opening",
                "venue_slug": "form-content-gallery"
            }, {
                    "category": "ongoing",
                    "start": "2015-01-02 08:00:00",
                    "end": "2015-02-21 00:00:00",
                    "type": "reoccurring",
                    "label": "Showing",
                    "venue_slug": "form-content-gallery"
                }],
            },

            {
                "url" : "http://www.bockleygallery.com/exhibitions.html",
                "slug": "jim-denomie-dialogues",
                "name": "Jim Denomie: Dialogues",
                "event_dates": [{
                    "category": "ongoing",
                    "start": "2014-11-01 00:00:00",
                    "end": "2014-12-13 00:00:00",
                    "type": "reoccurring",
                    "label": "Showing",
                    "venue_slug": "bockley"
                }],
            },


        {
            "url" : "http://www.formandcontent.org/current-exhibition/",
            "slug": "mrs-darwins-gardens",
            "name": "Mrs. Darwin's Gardens - Paintings by Vesna Kittelson",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-13 00:00:00",
                "end": "2014-12-20 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "form-content-gallery"
            }],
        },


        {
            "url" : "http://www.augsburg.edu/galleries/",
            "slug": "entrance-to-wood-stephanie-hunder",
            "name": "Entrance to Wood: Stephanie Hunder",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-03 00:00:00",
                "end": "2014-12-18 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "christiansen-center"
            }],
        },

            
        {
            "url" : "http://trafficzoneart.com/index.php?id=2",
            "slug": "gestura-anne-george",
            "name": "Gestura - Anne George",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-14 00:00:00",
                "end": "2015-01-02 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "traffic-zone"
            }],
        },

        {
            "url" : "http://www.circagallery.org/",
            "slug": "myke-reilly-emanate",
            "name": "Myke Reilly:Emanate",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-22 00:00:00",
                "end": "2015-01-03 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "circa-gallery"
            }],
        },
        {
            "url" : "http://www.weisman.umn.edu/event/anishinaabensag-biimskowebshkigewag-native-kids-ride-bikes",
            "slug": "native-kids-on-bikes",
            "name": "Anishinaabensag Biimskowebshkigewag (Native Kids Ride Bikes)",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-03 00:00:00",
                "end": "2015-01-04 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "weisman-art-museum"
            }],
        },
        
        {
            "url" : "http://new.artsmia.org/italian-style/",
            "slug": "italian-style-fasion-since-1945",
            "name": "Italian Style: Fasion since 1945",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-26 00:00:00",
                "end": "2015-01-04 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "mia"
            }],
        },

        {
            "url" : "https://www.facebook.com/events/668745859890013/",
            "slug": "make-garden",
            "name": "Make Garden",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-22 00:00:00",
                "end": "2015-01-10 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "instinct-gallery"
            }],
        },
        
        

        {
            "url" : "http://trafficzoneart.com/index.php?id=2",
            "slug": "adetomiwa-gbadebo-solo-exhibition",
            "name": "Adetomiwa Gbadebo (Solo Exhibition)",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-20 00:00:00",
                "end": "2015-01-10 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "exit-realty-metro"
            }],
        },
        


        {
            "url" : "http://gallery360mpls.com/current/index.php",
            "slug": "benevolent-beasts",
            "name": "Benevolent Beasts...",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-15 00:00:00",
                "end": "2015-01-11 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "gallery-360"
            }],
        },
        


        {
            "url" : "http://weinstein-gallery.com/exhibits.php?eid=51",
            "slug": "fashion-weinstein-gallery",
            "name": "Fashion",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-11-07 00:00:00",
                "end": "2015-01-17 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "weinstein-gallery"
            }],
        },
        
        {
            "url" : "http://www.walkerart.org/75/",
            "slug": "art-at-the-center-walker-75",
            "name": "Art At The Center - 75 years of Walker Collections",
            "event_dates": [{
                "category": "ongoing",
                "start": "2014-10-16 00:00:00",
                "end": "2015-09-11 00:00:00",
                "type": "reoccurring",
                "label": "Showing",
                "venue_slug": "walker-arts-center"
            }],
        },
        






 

        ]


        stuff_to_put = []
        j = 0
        for v_data in data: 
            i = 0

            for event_dates in v_data['event_dates']:
                v_data['event_dates'][i]['start'] = convert_rest_dt_to_datetime(event_dates['start'])
                v_data['event_dates'][i]['end'] = convert_rest_dt_to_datetime(event_dates['end'])
                i += 1
            j += 1
            
            stuff_to_put.append(eapi.create_event(v_data))
        self.response.write('Created %s Events' % len(stuff_to_put))
