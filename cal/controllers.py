# Events Module Controllers

# Each Date record will have its own search document

from pytz import timezone
from google.appengine.ext import ndb
import datetime
import logging
            
from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField

from modules.events.internal import api as events_api
from modules.events.internal.models import Event
from modules.events.constants import CATEGORY, EVENT_DATE_TYPE

from venues.controllers import create_resource_from_entity as v_resource
from modules.venues.internal.api import get_venue_by_slug

from framework.controllers import MerkabahBaseController

import logging

resource_url = 'http://localhost:8080/api/events/%s' #TODO: HRM?



def convert_rest_dt_to_datetime(dt):
    """
    Helper to convert a input datetime string to a UTC datetime
    """

    centraltz = timezone('US/Central')

    try:
        fmt = '%Y-%m-%dT%H:%M:%SZ'
        dt = datetime.datetime.strptime(dt, fmt)
    except ValueError:
        # Attempt full day method
        fmt = '%Y-%m-%d'
        dt = datetime.datetime.strptime(dt, fmt)

    dt = timezone('UTC').localize(dt)
    #dt =  dt.astimezone(timezone('UTC'))
    return dt.replace(tzinfo=None)

class EventDateField(RestField):
    """
    Temporary workaround until we can get subfields working
    """

    def to_resource(self, data):
        """
        Until we get subfields figured out - manually validate the props
        """

        val = super(EventDateField, self).to_resource(data)

        return_value = []
        for event_date in val:
            event_date_resource = {}

            event_date_resource['start'] = convert_rest_dt_to_datetime(event_date['start'])
            event_date_resource['end'] = convert_rest_dt_to_datetime(event_date['end'])

            event_date_resource['type'] = event_date['type']
            event_date_resource['category'] = event_date['category']
            event_date_resource['label'] = event_date['label']
            event_date_resource['venue_slug'] = event_date['venue_slug']
            return_value.append(event_date_resource)

        return return_value
        


    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """
        logging.error('IN EVENT DATES FROM RESOURCE')

        val = super(EventDateField, self).from_resource(obj, field)

        return_value = []
        for event_date in val:
            
            # Resolve VenueResource
            v = getattr(event_date, 'venue', None)
            if not isinstance(v, Resource): # TODO: Should be Resource base class
                v = get_venue_by_slug(event_date.venue_slug)
                event_date.venue = v_resource(v)

            event_date_resource = {}

            event_date_resource['start'] = event_date.start.isoformat() + 'Z'
            event_date_resource['end'] = event_date.end.isoformat() + 'Z'

            event_date_resource['type'] = event_date.type
            event_date_resource['category'] = event_date.category
            event_date_resource['label'] = event_date.label
            event_date_resource['venue_slug'] = event_date.venue_slug
            event_date_resource['venue'] = event_date.venue
            
            return_value.append(event_date_resource)

        return return_value


# verbosity vs. input vs. output

REST_RULES = [
    ResourceIdField(output_only=True),
    ResourceUrlField(resource_url, output_only=True),
    SlugField(Event.slug, required=True),
    RestField(Event.name, required=True),

    RestField(Event.url, required=False),
    EventDateField(Event.event_dates, required=True)
]


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    import logging
    logging.warning('--------Event Create Resource----------------')
    logging.warning(e)

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

    def get_rules(self):
        return REST_RULES

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

        e = events_api.create_event(self.cleaned_data)
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
