# Events Module Controllers


# Each Date record will have its own search document
import voluptuous
import logging

from rest.params import coerce_to_cursor
from google.appengine.api import memcache

from auth.decorators import rest_login_required

from rest.controllers import RestHandlerBase

from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField
from rest.params import coerce_to_datetime
from rest.utils import get_key_from_resource_id

from files.rest_helpers import FileField

from modules.events.internal import api as events_api
from modules.events.internal.models import Event
from modules.events.constants import CATEGORY

from framework.controllers import MerkabahBaseController
from cal.rest_helpers import EventDateField
from utils import get_domain

resource_url = 'http://' + get_domain()  + '/api/events/%s' #TODO: HRM?

# verbosity vs. input vs. output

REST_RULES = [
    ResourceIdField(output_only=True),
    ResourceUrlField(resource_url, output_only=True),
    SlugField(Event.slug, required=True),
    RestField(Event.name, required=True),

    RestField(Event.url, required=False),
    EventDateField(Event.event_dates, required=True),

    RestField(Event.content),
    RestField(Event.summary),

    RestField(Event.primary_image_resource_id, required=False),
    FileField('primary_image_resource', required=False, output_only=True, resource_id_prop='primary_image_resource_id')
]


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    return Resource(e, REST_RULES).to_dict()


class EventDetailApiHandler(RestHandlerBase):
    """
    """

    def get_rules(self):
        return REST_RULES

    @rest_login_required
    def _put(self, slug):
        # Edit an event

        resource_id = slug
        key = get_key_from_resource_id(resource_id)

        if not key:
            raise Exception('404 - TODO: Throw legit 404') # or Resource Not Found

        e = key.get()

        e = events_api.edit_event(e, self.cleaned_data)
        result = create_resource_from_entity(e)
        self.serve_success(result)

    def _get(self, slug):

        #slug = long(slug)
        #key = events_api.get_event_key(slug)
        resource_id = slug
        key = get_key_from_resource_id(resource_id)

        if not key:
            raise Exception('404 - TODO: Throw legit 404') # or Resource Not Found

        e = key.get()
        if not e:
            raise Exception('404 or something')

        events_api.bulk_dereference_venues(e)

        result = create_resource_from_entity(e)
        self.serve_success(result)

def coerce_to_category(val):
    """
    """
    # TODO: Validate that category is set on CATEGORY
    #    val.upper() is pretty lame...

    cats = val.split(',')
    return_cats = []
    for cat in cats:
        cat = cat.strip()

        if not hasattr(CATEGORY, cat.upper()):
            raise voluptuous.Invalid('Invalid filter value for category filter "%s" in "%s"' % (cat, val))
        
        return_cats.append(cat)

    return return_cats


class EventsUpcomingHandler(RestHandlerBase):
    """

    """

    def get_param_schema(self):
        return {
            'limit' : voluptuous.Coerce(int),
            'cursor': coerce_to_cursor,
            'sort': voluptuous.Coerce(str),
            'category':  coerce_to_category,
            'start': coerce_to_datetime,
            'end': coerce_to_datetime,
            'venue_slug': voluptuous.Coerce(str),
        }

    def _get(self):
        """
        Temp handler for upcoming events
        """

        # This is temp code...
        # TODO: Figure out something for defaults...
        params = self.cleaned_params
        params['sort'] = self.cleaned_params.get('sort', 'start')

        # Serialize the params for cache key
        from utils import ubercache
        import json

        key = str(hash(json.dumps(self.params)))

        cached_events = ubercache.cache_get(key)
        if cached_events:
            results = cached_events
        else:
            
            logging.warning('Upcoming Events were not cached. Querying for new list.')

            results = []
            events = events_api.generic_search(**params)

            for event in events:
                results.append(create_resource_from_entity(event))

            ubercache.cache_set(key, results, category='events')

        self.serve_success(results)


class EventsNowShowingHandler(RestHandlerBase):
    """
    """

    def _get(self):
        """
        Temp handler for Now Showing events
        """
        raise Exception('Don\'t use this...')

        results = []
        cached_events = memcache.get(NOWSHOWING_CACHE_KEY)
        if False and cached_events is not None:
            results = cached_events
        else:
            logging.warning('Nowshowing Events were not cached. Querying for new list.')
            events = events_api.now_showing(limit=self.cleaned_params.get('limit', None))

            for event in events:
                results.append(create_resource_from_entity(event))
            memcache.add(NOWSHOWING_CACHE_KEY, results)

        self.serve_success(results)



class EventsApiHandler(RestHandlerBase):
    """
    Main Handler for Events Endpoint
    """



    def get_rules(self):
        return REST_RULES

    def get_param_schema(self):
        return {
            #'limit' : voluptuous.Coerce(int),
            #'cursor': coerce_to_cursor,
            #'sort': voluptuous.Coerce(str),
            'get_by_slug': voluptuous.Coerce(str),
            #'q': voluptuous.Coerce(str)
        }

    @rest_login_required
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

    @rest_login_required
    def _get(self):
        """
        Main Endpoint

        TODO: This has some really basic silly caching on it to prevent being slashdotted to death
        """

        # Check if there is a query filter, etc
        get_by_slug = self.cleaned_params.get('get_by_slug', None)
        
        if get_by_slug:
            event = events_api.get_event_by_slug(get_by_slug)
            if not event:
                self.serve_404('Event Not Found')
                return False

            resource = create_resource_from_entity(event)
            self.serve_success(resource)
            return

        results = []

        cash_key = 'testing_events_cache'
        cached_events = memcache.get(cash_key)
        if False and cached_events is not None:
            results = cached_events
        else:
            events, cursor, more = events_api.get_events(cursor=self.cleaned_params.get('cursor', None), limit=self.cleaned_params.get('limit', None))
            for event in events:
                results.append(create_resource_from_entity(event))
            if cursor:
                cursor = cursor.urlsafe()
            memcache.add(cash_key, results, 60)

        self.serve_success(results, {'cursor': cursor, 'more': more})



# Web Handlers
class CalendarMainHandler(MerkabahBaseController):
    """
    Main Handler For Calendar Listings
    """

    def get(self):
        pagemeta = {
            'title': 'EVENT CAL!!!',
            'description': 'A Directory of Galleries and Places that Show Art in Minneapolis',
            'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)


class EventsWeeksApiHandler(RestHandlerBase):
    """
    """

    def _get(self):
        results = []
        events = events_api.get_events()
        for event in events:
            results.append(create_resource_from_entity(event))

        self.serve_success(results)


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

        pagemeta = {
            'title': 'cooooool',
            'description': 'this is wicked cool',
            'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)
