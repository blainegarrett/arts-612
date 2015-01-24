"""
Calendar REST Helpers
"""
from rest.resource import RestField, Resource
from rest.params import coerce_to_datetime

from venues.controllers import create_resource_from_entity as v_resource
from modules.venues.internal.api import get_venue_by_slug


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

            event_date_resource['start'] = coerce_to_datetime(event_date['start'])
            event_date_resource['end'] = coerce_to_datetime(event_date['end'])

            # Janky Validation
            if (event_date_resource['end'] < event_date_resource['start']):
                # Should be a rest validation form error...
                raise Exception('End time cannot occur before start time')

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
