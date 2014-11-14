# Handlers for bulk importing data

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
            }],
            }, {
            "url" : "https://www.facebook.com/events/677020089080861/",
            "slug": "gamut-c4w-2104-finale",
            "name": "C4W:2014 Finale - With Improv Orchestra \"Improvestra\"",
            "event_dates": [{
                "category": "reception",
                "start": "2014-11-22 19:00:00",
                "end": "2014-11-22 22:00:00",
                "type": "timed",
                "label": "Reception",
                "venue_slug": "gamut"
            },
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
            }],
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
            }, {
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
                "end": "2014-12-12 22:00:00",
                "type": "timed",
                "label": "Opening Night",
                "venue_slug": "gamut"
            }, {
                    "category": "sale",
                    "start": "2014-12-13 12:00:00",
                    "end": "2014-12-13 22:00:00",
                    "type": "timed",
                    "label": "Opening Night",
                    "venue_slug": "gamut"
                }
            ],
            }, {
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
                    "end": "2014-12-10 00:00:00",
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
