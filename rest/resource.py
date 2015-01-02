"""
REST Resource and Feild Types
Note: This is designed to work similar django Forms
"""

from google.appengine.ext import ndb
import voluptuous


NON_FIELD_ERRORS = '__all__'


class RestValueException(Exception):
    """
    Value Error for a Rest rule - similar to django.forms.ValidationError
    """

    def __init__(self, field, value, error):
        self.field = field
        self.value = value
        self.error = error

    def __str__(self):
        return 'Invalid value "%s" for "prop" %s. Error: %s' % (self.value, self.field.key,
                                                                self.error)


class ResourceList(object):
    """
    List Endpoint helper
    TODO: Do this yet
    """


class Resource(object):
    """
    Object to represent a REST Resource
    """

    def __init__(self, obj, fields):
        """
        :param obj:
            Instance of ndb.Model or None when attempting to validate a resource payload
        """

        # Make sure entities is a list
        if not obj:
            obj = None

        if obj and not isinstance(obj, (ndb.Model, dict)):
            raise TypeError('Resource requires a object of type ndb.Model. Received: %s' % obj)

        self.obj = obj
        self.fields = fields

        self.errors = {}
        #_errors
        self.cleaned_data = {}

    def from_dict(self, data):
        """
        Loads in a Rest Resource from a dictionary of a values

        Validates it too
        """

        # First validate that all input keys are allowed input fields
        allowed_input_field_keys = []
        required_input_field_keys = []
        self.cleaned_data = {}

        for field in self.fields:
            if not field.output_only: # or allowed...
                allowed_input_field_keys.append(field.key)

            if field.required:
                required_input_field_keys.append(field.key)

        allowed_input_field_keys = set(allowed_input_field_keys)
        required_input_field_keys = set(required_input_field_keys)

        given_field_keys = set(data.keys())

        for key in given_field_keys.difference(allowed_input_field_keys):
            # TODO: Collect these and present them as a single error dict
            raise Exception('key "%s" is not an allowed input field for a resource.' % key)

        # Next validate that required keys are not abscent
        for key in required_input_field_keys.difference(given_field_keys):
            # TODO: Collect these and present them as a single error dict
            raise Exception('key "%s" is a required input field for a resource.' % key)

        #Next Validate the various properties
        for field in self.fields:
            if not field.output_only:
                value = field.to_resource(data)
                self.cleaned_data[field.key] = value

        return self.cleaned_data

    def to_dict(self):
        """
        Dumps a rest Resource to a dictionary of values
        """

        result = {}

        obj = self.obj

        for field in self.fields:
            result[field.key] = field.from_resource(obj, field.key)
        return result


class RestField(object):
    """
    Baseclass for a specific field for a Rest Resource.
    """

    def __init__(self, prop, always=True, validator=None, output_only=False, input_only=False,
                 required=False):

        self.key = None # This is the dict key for Resource dict

        self.prop = prop
        self.always = always

        self.validator = validator
        self.input_only = input_only
        self.output_only = output_only
        self.required = required # Required on input

        import logging
        logging.error(self.prop)

        if isinstance(self.prop, ndb.model.Property):
            self.key = self.key or self.prop._name
        elif isinstance(self, (ResourceUrlField, ResourceIdField)):
            self.key = self.prop
        elif isinstance(self.prop, basestring):
            self.key = self.prop
        else:
            raise Exception('Rest Property not supported %s', prop)

    def validate(self, value):
        # TODO: Have this throw errors django forms style
        # TODO: This does not yet look at self.required

        try:
            is_valid = voluptuous.Schema(self.validator, required=True)(value)
        except Exception, e:
            raise RestValueException(self, value, e)

        return is_valid

    def from_resource(self, obj, field):
        """
        Default handler for properties
        """
        if isinstance(obj, dict):
            return obj.get(field)
        return getattr(obj, field)

    def to_resource(self, data):
        """
        Input a field to a dict value
        """

        import logging
        logging.warning(data);
        
        value = data.get(self.key) # TODO: Need to figure out Required to exist vs. Not None

        if not value and self.required:
            logging.warning(bool(value));
            raise Exception('Field "%s" is a required input field.' % self.key)

        if value and self.output_only:
            raise Exception('Field "%s" is not an allowed input field.' % self.key)
        return value


class ResourceUrlField(RestField):
    """
    Field to populate the endpoint url to get the full resource
    TODO: This should always be output only
    """

    def __init__(self, url_template, **kwargs):
        prop = 'resource_url' #This is sort of a dummy value
        self.url_template = url_template
        super(ResourceUrlField, self).__init__(prop, **kwargs)

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """

        return self.url_template % obj.key.urlsafe()


class ResourceIdField(RestField):
    """
    Field to populate the resource key of the resource
    TODO: This should always be output only?
    """

    def __init__(self, **kwargs):
        prop = 'resource_id'
        super(ResourceIdField, self).__init__(prop, **kwargs)

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """
        import logging
        logging.error(obj)

        try:
            key = obj.key.urlsafe()
        except:
            logging.error(obj)
        return key


class UploadField(RestField):
    """
    """
    def __init__(self, prop, **kwargs):
        super(UploadField, self).__init__(prop, **kwargs)

    def to_resource(self, data):
        val = super(UploadField, self).to_resource(data)
        
        if val:
            return ndb.GeoPt(lat=val['lat'], lon=val['lon'])
        return None

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """
        
        #FieldStorage(u'the_file', u'title_bar.jpg') evals to false for some reason...

        val = super(UploadField, self).from_resource(obj, field)

        if not val:
            return None

        return {'lat': val.lat, 'lon': val.lon}

class GeoField(RestField):
    """
    Field to support a Geo coordinate property
    """

    def __init__(self, prop, **kwargs):
        super(GeoField, self).__init__(prop, **kwargs)


    def to_resource(self, data):
        val = super(GeoField, self).to_resource(data)

        if val:
            return ndb.GeoPt(lat=val['lat'], lon=val['lon'])
        return None

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """

        val = super(GeoField, self).from_resource(obj, field)

        if not val:
            return None

        return {'lat': val.lat, 'lon': val.lon}


class SlugField(RestField):
    """
    Field to support a slug - must match input format
    """

    def __init__(self, prop, **kwargs):
        kwargs['validator'] = int

        super(SlugField, self).__init__(prop, **kwargs)
