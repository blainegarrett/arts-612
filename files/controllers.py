"""
Rest API for Venues/Galleries
"""
import logging
from auth.decorators import rest_login_required

from google.appengine.ext import ndb

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField, GeoField

from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue

from framework.controllers import MerkabahBaseController

resource_url = 'http://localhost:8080/api/galleries/%s' #TODO: HRM?


class UploadUrlField(ResourceUrlField):
    def to_resource(self, data):
        """
        Until we get subfields figured out - manually validate the props
        """

        val = super(UploadUrlField, self).to_resource(data)        
        return val

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """

        val = super(UploadUrlField, self).from_resource(obj, field)
        return val

    

REST_RULES = [
    UploadUrlField('jive', output_only=True)
]


class GalleryApiHandlerBase(RestHandlerBase):
    """
    Base Handler for all Gallery API endpoints
    """

    def get_rules(self):
        return REST_RULES
        
class UploadUrlHandler(RestHandlerBase):
    """
    """

    def get_rules(self):
        return REST_RULES

    def _get(self):
        # TODO: Abstract this a bit more out into a rest-like service...

        e = {'upload_url': 'http://google.com'}

        resource = Resource(e, REST_RULES).to_dict()
        self.serve_success(resource)