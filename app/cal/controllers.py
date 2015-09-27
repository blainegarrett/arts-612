# Events Module Controllers


# Each Date record will have its own search document
import voluptuous
import logging
import json

from rest.params import coerce_to_cursor

from auth.decorators import rest_login_required

from framework.controllers import BaseHandler
from rest.controllers import RestHandlerBase

from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField
from rest.resource import BooleanField, ResourceField
from rest.params import coerce_to_datetime
from rest.utils import get_key_from_resource_id

from files.rest_helpers import REST_RESOURCE_RULES as FILE_REST_RULES

from modules.events.internal import api as events_api
from modules.events.internal.models import Event
from modules.events.constants import CATEGORY, PRIMARY_IMAGE_PROP
from utils import ubercache

from cal.rest_helpers import EventDateField
from utils import get_domain

resource_url = 'http://' + get_domain() + '/api/events/%s'  # TODO: HRM?

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
    BooleanField(Event.featured),

    RestField(Event.primary_image_resource_id, required=False),
    ResourceField(PRIMARY_IMAGE_PROP, required=False, output_only=True,
        resource_id_prop='primary_image_resource_id', resource_rules=FILE_REST_RULES),

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
            'limit': voluptuous.Coerce(int),
            'cursor': coerce_to_cursor,
            'sort': voluptuous.Coerce(str),
            'category': coerce_to_category,
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
        key = str(hash(json.dumps(self.params)))

        cached_events = ubercache.cache_get(key)
        if cached_events:
            results = cached_events
        else:

            logging.warning('Upcoming Events were not cached. Querying for new list.')

            results = []
            events = events_api.generic_search(**params)

            events_api.bulk_dereference_events(events)

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

        """
        results = []
        cached_events = memcache.get(NOWSHOWING_CACHE_KEY)
        if cached_events is not None:
            results = cached_events
        else:
            logging.warning('Nowshowing Events were not cached. Querying for new list.')
            events = events_api.now_showing(limit=self.cleaned_params.get('limit', None))

            for event in events:
                results.append(create_resource_from_entity(event))
            memcache.add(NOWSHOWING_CACHE_KEY, results)

        self.serve_success(results)
        """


class EventsApiHandler(RestHandlerBase):
    """
    Main Handler for Events Endpoint
    """

    def get_rules(self):
        return REST_RULES

    def get_param_schema(self):
        return {
            'limit': voluptuous.Coerce(int),
            'cursor': coerce_to_cursor,
            # 'sort': voluptuous.Coerce(str),
            'get_by_slug': voluptuous.Coerce(str),
            'q': voluptuous.Coerce(str)
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
        cursor = None
        more = None

        # Serialize the params for cache key
        cache_key = 'events-api-' + str(hash(json.dumps(self.params)))

        cached_result = ubercache.cache_get(cache_key)

        if cached_result is not None:  # TODO: Caching for this param
            results, cursor, more = cached_result
        else:
            events, cursor, more = events_api.get_events(cursor=self.cleaned_params.get('cursor', None), limit=self.cleaned_params.get('limit', None))
            for event in events:
                results.append(create_resource_from_entity(event))
            if cursor:
                cursor = cursor.urlsafe()
            ubercache.cache_set(cache_key, [results, cursor, more], category='events')

        self.serve_success(results, {'cursor': cursor, 'more': more})


class EventsWeeksApiHandler(RestHandlerBase):
    """
    """

    def _get(self):
        results = []
        events = events_api.get_events()
        for event in events:
            results.append(create_resource_from_entity(event))

        self.serve_success(results)


class CalendarDetailHandler(BaseHandler):
    """
    Handler for Serving up the chrome for the event page
    """

    def get(self, slug):
        """
        Web handler for an event permalink page
        """

        # TODO: Abstract this a bit more out into a rest-like service...
        e = events_api.get_event_by_slug(slug)

        if not e:
            return self.serve_404('Event Not Found with slug %s' % slug)

        # Page Meta
        image_url = None
        image_id = e.primary_image_resource_id
        if image_id:
            key = get_key_from_resource_id(image_id)
            image = key.get()
            if image and image.versions['CARD_SMALL']:
                image_url = image.versions['CARD_SMALL']['url']


        pagemeta = {
            'title': e.name,
            'description': e.summary,
            'image': image_url
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)
