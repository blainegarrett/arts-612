"""
Signup and Authentication routes
"""

import webapp2
from google.appengine.api import users
from auth.decorators import login_required
import logging
import jinja2
import os
import sys

from utils import get_domain

# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../external'))


from auth.decorators import rest_login_required
from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, ResourceIdField, ResourceUrlField
from rest.utils import get_key_from_resource_id

from auth import api as auth_api
from auth.models import User


# REST Controllers for private
resource_url = 'http://' + get_domain() + '/api/users/%s'

REST_RULES = [
    ResourceIdField(output_only=True),
    ResourceUrlField(resource_url, output_only=True),
    RestField(User.firstname, required=True),
    RestField(User.lastname, required=True),
    RestField(User.website, required=False),
]


class UsersApiHandler(RestHandlerBase):
    """
    Users Collection REST Endpoint
    """

    def get_param_schema(self):
        return {
            # 'limit' : voluptuous.Coerce(int),
            # 'cursor': coerce_to_cursor,
            # 'sort': voluptuous.Coerce(str),
            # 'get_by_slug': voluptuous.Coerce(str),
            # 'q': voluptuous.Coerce(str)
        }

    def get_rules(self):
        return REST_RULES

    def _get(self):
        """
        Get a list of Blog Posts
        """

        entities = auth_api.get_users()

        # Create A set of results based upon this result set - iterator??
        results = []
        for e in entities:
            results.append(Resource(e, REST_RULES).to_dict())

        self.serve_success(results)

    @rest_login_required
    def _post(self):
        """
        Create a User
        TODO: Needs admin decorator
        """

        e = auth_api.create_user(self.cleaned_data)
        self.serve_success(Resource(e, REST_RULES).to_dict())


class UserDetailApiHandler(RestHandlerBase):
    """
    Blog Post Resource Endpoint
    """

    def get_rules(self):
        return REST_RULES

    def _get(self, resource_id):
        # Get a Public User Profile
        key = get_key_from_resource_id(resource_id)
        e = key.get()
        self.serve_success(Resource(e, REST_RULES).to_dict())

    @rest_login_required
    def _put(self, resource_id):
        """
        Edit a User
        """

        key = get_key_from_resource_id(resource_id)
        e = key.get()

        e = auth_api.edit_user(e, self.cleaned_data)

        self.serve_success(Resource(e, REST_RULES).to_dict())
