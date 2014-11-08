# Events Module Controllers

# Each Date record will have its own search document

from google.appengine.ext import ndb
import datetime

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField

from modules.events.internal import api as events_api
from modules.events.internal.models import Event
from modules.events.constants import CATEGORY, EVENT_DATE_TYPE

#from modules.venues.internal import search as vsearch
#from modules.venues.internal.models import Venue
from venues.controllers import create_resource_from_entity as v_resource
from framework.controllers import MerkabahBaseController

import logging

resource_url = 'http://localhost:8080/api/events/%s' #TODO: HRM?


class EventDateField(RestField):

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """

        val = super(EventDateField, self).from_resource(obj, field)

        return_value = []
        for event_date in val:
            
            # Resolve VenueResource
            v = event_date.venue
            if not isinstance(v, Resource): # TODO: Should be Resource base class
                event_date.venue = v_resource(v)

            event_date_resource = {}

            event_date_resource['start'] = event_date.start.strftime('%Y-%m-%d %H:%M:%S') # These need to be rest formatted
            event_date_resource['end'] = event_date.end.strftime('%Y-%m-%d %H:%M:%S') # These need to be rest formatted
            
            event_date_resource['type'] = event_date.type
            event_date_resource['category'] = event_date.category
            event_date_resource['label'] = event_date.label
            event_date_resource['venue_slug'] = event_date.venue_slug
            event_date_resource['venue'] = event_date.venue
            return_value.append(event_date_resource)

        return return_value


REST_RULES = [
    ResourceIdField(always=True),
    ResourceUrlField(resource_url, always=True),
    SlugField(Event.slug, always=True),
    RestField(Event.name, always=True),

    RestField(Event.url, always=True),
    EventDateField(Event.event_dates, always=True)
]


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    return Resource(e, REST_RULES).to_dict()

    r = {
        'resource_id':e.key.id(),
        'resource':'http://localhost:8080/api/events/%s' % e.key.id(),
        'slug': e.slug,
        'name': e.name,
        'url': e.url,
        'event_dates': []
    }

    # This needs to be gooder about resources...
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
        
        slug = long(slug)
        
        key = events_api.get_event_key(slug)
        if not key:
            raise Exception('404 - TODO: Throw legit 404') # or Resource Not Found

        e = key.get()
        if not e:
            raise Exception('404 or something')

        events_api.bulk_dereference_venues(e)

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


# Web Handlers

class CalendarMainHandler(MerkabahBaseController):
    """
    Main Handler For Calendar Listings
    """
    def get(self):
        pagemeta = {'title': 'EVENT CAL!!!', 'description': 'A Directory of Galleries and Places that Show Art in Minneapolis', 'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'}
        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)        


class CalendarDetailHandler(MerkabahBaseController):
    """
    Handler for Serving up the chrome for the event page
    """

    def get(self, event_id):
        """
        Web handler for an event
        """

        from modules.events.internal import api as events_api

        # TODO: Abstract this a bit more out into a rest-like service...
        e = events_api.get_event_key(long(event_id))

        if not e:
            self.response.write('Event Not Found with id %s' % event_id)
            #self.serve_404('Gallery Not Found')
            #return False

        pagemeta = {'title': 'cooooool', 'description': 'this is wicked cool', 'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'}
        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)
