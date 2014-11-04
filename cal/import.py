# Handlers for bulk importing data

import webapp2
from google.appengine.api import search

from modules.events.internal.models import Event
from modules.events.internal import search as esearch
from modules.events.internal import api as eapi
from modules.events.constants import EVENT_SEARCH_INDEX


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
                    "dates": [{
                        "category": "reception",
                        "start": "2014-11-08 19:00:00",
                        "end": "2014-11-08 20:00:00",
                        "label": "opening night!",
                        "type": "timed",
                        "venue_slug": "kolman-pryor"
                    }],
                    "slug": "mutable-landscapes",
                    "name": "Mutable Landscapes - Patrick Kemal Pryor"
            },
            {
                "url" : "http://www.tuckunder.org/",
                "dates": [{
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
                "dates": [{
                    "category": "reception",
                    "start": "2014-11-15 18:00:00",
                    "end": "2014-11-16 00:00:00",
                    "type": "timed",
                    "label": "Party",
                    "venue_slug": "soap-factory"
                }],
                "slug": "soap-factory-day",
                "name": "Soap Factory Day and 25th Anniversary Party"
            },
            {
                "url" : "http://www.dimmedia.com/events/2013/ice-cream-social/",
                "dates": [{
                    "category": "ongoing",
                    "start": "2014-10-31",
                    "end": "2014-11-30",
                    "type": "reoccurring",
                    "label": "On Display",
                    "venue_slug": "sebastian-joes-franklin"
                }],
                "slug": "icecream-social",
                "name": "Dim Media - Ice Cream Social"
            },
            {
                "url" : "http://www.hangitinc.com/art_shows.html",
                "dates": [{
                    "category": "ongoing",
                    "start": "2014-10-24",
                    "end": "2014-11-29",
                    "type": "reoccurring",
                    "label": "On Display",
                    "venue_slug": "gallery-122"
                }],
                "slug": "afterlife-merriment",
                "name": "Afterlife Merriment"
            },
        ]

        stuff_to_put = []
        for v_data in data:
            stuff_to_put.append(eapi.create_event(v_data))
        self.response.write('Created %s Events' % len(stuff_to_put))
