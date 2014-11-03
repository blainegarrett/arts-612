# Events Module Controllers

# Each Date record will have its own search document

from google.appengine.ext import ndb
import datetime

from rest.controllers import RestHandlerBase

from modules.events.internal import api as events_api
from modules.events.constants import CATEGORY, EVENT_DATE_TYPE

#from modules.venues.internal import search as vsearch
#from modules.venues.internal.models import Venue
from venues.controllers import create_resource_from_entity as v_resource


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    r = {
        'slug': e.slug,
        'name': e.name,
        'url': e.url,
        'event_dates': []
    }

    for event_date in e.event_dates:
        v = event_date.get('venue', None)
        if not isinstance(v, dict): # TODO: Should be Resource base class
            event_date['venue'] = v_resource(v)
        r['event_dates'].append(event_date)
    
    return r

class EventsWeeksApiHandler(RestHandlerBase):
    """
    """

    def _get(self):
        results = []
        events = events_api.get_events()
        for event in events:
            results.append(create_resource_from_entity(event))

        self.serve_success(results)
    
class EventDetailApiHandler(RestHandlerBase):
    """
    """
    def _get(self, slug):
        result = create_resource_from_entity(e)
        self.serve_success(result)


class EventsWeeksApiHandler(RestHandlerBase):
    """
    """

    def _get(self):
        results = []
        events = events_api.get_this_week()
        for event in events:
            results.append(create_resource_from_entity(event))

        self.serve_success(results)

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
        """
        Main Endpoint
        """

        results = []
        events = events_api.get_events()
        for event in events:
            results.append(create_resource_from_entity(event))

        self.serve_success(results)
        