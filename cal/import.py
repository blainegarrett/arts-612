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
            },
            {
                "url" : "http://www.dimmedia.com/events/2013/ice-cream-social/",
                "event_dates": [{
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
                "event_dates": [{
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

        '''

        ERROR    2014-11-08 06:02:36,307 import.py:34] 2014-11-09 02:00:00+00:00
        ERROR    2014-11-08 06:02:36,307 import.py:34] 2014-11-09 01:00:00+00:00
        
        ERROR    2014-11-08 06:02:36,323 import.py:34] 2014-10-31 02:00:00+00:00
        ERROR    2014-11-08 06:02:36,323 import.py:34] 2014-10-30 23:00:00+00:00

        ERROR    2014-11-08 06:02:36,337 import.py:34] 2014-11-16 06:00:00+00:00
        ERROR    2014-11-08 06:02:36,338 import.py:34] 2014-11-16 00:00:00+00:00




        ERROR    2014-11-08 06:02:36,354 import.py:34] 2014-11-30 06:00:00+00:00
        ERROR    2014-11-08 06:02:36,355 import.py:34] 2014-10-31 05:00:00+00:00


        ERROR    2014-11-08 06:02:36,370 import.py:34] 2014-11-29 06:00:00+00:00
        ERROR    2014-11-08 06:02:36,370 import.py:34] 2014-10-24 05:00:00+00:00

        '''

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
