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
        return 'Invalid value "%s" for "prop" %s. Error: %s' % (self.value, self.field.key, self.error)


class ResourceList(object):
    """
    List Endpoint helper
    TODO: Do this yet
    """
    
    

class Resource(object):
    """
    Object to represent a REST Resource
    """

    def __init__(self, objects, fields, default_verbose=False):

        # Make sure entities is a list
        if not objects:
            objects = []

        if not isinstance(objects, list):
            objects = [objects]

        self.objects = objects
        self.verbose = default_verbose
        self.fields = fields

        self.errors = {}
        #_errors
        #cleaned_data

        #self.validate()
        #raise Exception(self.errors)


    def add_error(self, field, error):
        pass
        

    def is_valid(self):
        """
        
        """

        return self.validate()

    def validate(self):
        """
        Run the validation rules on every field
        """

        obj = self.objects[0]
        is_valid = True

        for field in self.fields: # Iterate over RestField objects
            value = field.handler(obj, field.key)
            
            try:
                field.validate(value)
            except RestValueException, e:
                is_valid = False
                self.errors[field.key] = str(e)
        

    def to_dict(self):
        """
        Dumps a Rest Resource to a dictionary of values
        """

        result = {}

        obj = self.objects[0]

        for field in self.fields:
            value = field.from_resource(obj, field.key)

            result[field.key] = value

        
        return result
        
        


class RestField(object):

    def __init__(self, prop, always=True, validator=None, input_only=None):

        self.key = None
        self.prop = prop
        self.always = always

        self.validator = validator
        self.input_only = input_only

        if isinstance(self.prop, ndb.model.Property):
            self.key = self.key or self.prop._name
        elif isinstance(self, (ResourceUrlField, ResourceIdField)):
            self.key = self.prop
        else:
            raise Exception('Rest Property not supported %s', prop)

    
    def validate(self, value):
        # TODO: Have this throw errors django forms style
        try:
            is_valid = voluptuous.Schema(self.validator, required=True)(value)
        except Exception, e:
            raise RestValueException(self, value, e)

        return is_valid
    
    def from_resource(self, obj, field):
        return getattr(obj, field)

class ResourceUrlField(RestField):
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
    def __init__(self, **kwargs):
        prop = 'resource_id'
        super(ResourceIdField, self).__init__(prop, **kwargs)

    def to_resource():
        """
        Input a field to a dict value
        """
        pass
        

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """

        key = obj.key.urlsafe()
        return key


class GeoField(RestField):
    """
    """
    def __init__(self, prop, **kwargs):
        super(GeoField, self).__init__(prop, **kwargs)

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """

        val = super(GeoField, self).from_resource(obj, field)

        if not val:
            return None

        return {'lat': val.lat, 'lon': val.lon}


class SlugField(RestField):
    
    def __init__(self, prop, **kwargs):
        kwargs['validator'] = int

        super(SlugField, self).__init__(prop, **kwargs)

        
        #validated = voluptuous.Schema(
        #    schema, required=True, extra=True)(new_data)

#class DateTimeField(RestField):
#    """
#    """
 