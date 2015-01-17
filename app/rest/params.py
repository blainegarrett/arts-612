from voluptuous import Schema
from google.appengine.datastore.datastore_query import Cursor

class ResourceParams(object):
    def __init__(self, schema):
        self.param_schema = schema
        
    
    def from_dict(self, input_params):
        """
        :param input_params dict: 
        """

        schema = Schema(self.param_schema)
        validated_params = schema(input_params)
        
        return validated_params


def coerce_to_cursor(val):
    """
    Validate that val is None or a db.Cursor
    """

    if not val:
        return None

    cursor = Cursor(urlsafe=val)
    return cursor