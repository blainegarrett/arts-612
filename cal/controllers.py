# Events Module Controllers

# Each Date record will have its own search document

from google.appengine.ext import ndb
import datetime

from rest.controllers import RestHandlerBase

from modules.events.internal import api as events_api
from modules.events.constants import CATEGORY, EVENT_DATE_TYPE

#from modules.venues.internal import search as vsearch
#from modules.venues.internal.models import Venue


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    r = {
        'slug': e.slug,
        'name': e.name
    }
    return r


class EventsApiHandler(RestHandlerBase):
    """
    Main Handler for Events Endpoint
    """

    def _post(self):
        """
        Create Event
        """
        
        """
        # Expected payload
        {
            "url": "http://google.com/?q=fishtacos",
            "dates": [
                {"category": "reception",
                "end": "2014-10-15 20:00:00",
                "label": "opening night!",
                "start": "2014-10-15 17:00:00",
                "type": "timed",
                "venue_slug": "gamut"}
            ],
            "slug": "curative", 
            "name": "Curative"
        }
        """

        e = events_api.create_event(self.data)
        result = create_resource_from_entity(e)
        self.serve_success(result)
        
    def _get(self):

        data = {
            'slug': 'curative',
            'name': 'Curative',
            'url': 'http://google.com/?q=fishtacos',
            'dates': [
                {
                    'venue_slug': 'gamut',
                    'start': datetime.datetime(year=2014, month=10, day=15, hour=17, minute=0),
                    'end': datetime.datetime(year=2014, month=10, day=15, hour=20, minute=0),
                    'category': CATEGORY.RECEPTION,
                    'label': 'opening night!',
                    'type': EVENT_DATE_TYPE.TIMED
                }
            ]
        }

        results = []
        events = events_api.get_events()
        for event in events:
            results.append(create_resource_from_entity(event))

        self.serve_success(results)
        