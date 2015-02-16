"""
Rest Helpers for the Files Bits
"""

from google.appengine.ext import ndb

from utils import get_domain
from rest.resource import Resource
from rest.resource import ResourceIdField, ResourceUrlField, DatetimeField
from rest.resource import RestField

from files.models import FileContainer

resource_url = 'http://' + get_domain() + '/api/files/%s'

REST_RESOURCE_RULES = [

    ResourceIdField(output_only=True),
    ResourceUrlField(resource_url, output_only=True),
    RestField(FileContainer.caption, required=False),
    DatetimeField(FileContainer.created_date, output_only=True),
    DatetimeField(FileContainer.modified_date, output_only=True),
    RestField(FileContainer.versions, required=False),
]



class FileField(RestField):
    """
    File Resource
    """

    def __init__(self, prop, resource_id_prop, **kwargs):
        self.resource_id_prop = resource_id_prop
        super(FileField, self).__init__(prop, **kwargs)


    def from_resource(self, obj, field):
        """
        """

        resource_id = super(FileField, self).from_resource(obj, self.resource_id_prop)

        if not resource_id:
            return None
        
        resource_key = ndb.Key(urlsafe=resource_id)
        return Resource(resource_key.get(), REST_RESOURCE_RULES).to_dict()
