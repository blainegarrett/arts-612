"""
Signup and Authentication routes
"""

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, ResourceIdField, ResourceUrlField
from rest.utils import get_key_from_resource_id
from auth.decorators import rest_login_required
from utils import get_domain

from auth import helpers as auth_helpers
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


class BaseAuthHandler(RestHandlerBase):
    def get_param_schema(self):
        return {}


class StatusHandler(BaseAuthHandler):

    def _get(self):
        # Endpoint to debug current authentication state

        checks = []

        # Check 1: Do you have auth header
        token = auth_helpers.get_auth_token_from_request(self.request)
        checks.append(('jwt_token', token))

        if token:
            payload = auth_helpers.read_token(token)
            checks.append(('decoded_jwt_payload', payload))

        results = {'checks': checks}
        self.serve_success(results)


class AuthenticateHandler(BaseAuthHandler):
    pass


class DeauthenticateHandler(BaseAuthHandler):
    pass


class SecureHandlerBase(BaseAuthHandler):
    """
    Base handler that acts as middleware to add user to request
    """

    def dispatch(self):
        """
        """

        user = auth_helpers.get_user(self.request)

        setattr(self.request, 'user', user)
        super(SecureHandlerBase, self).dispatch()


class SomeSecureHandler(SecureHandlerBase):
    """
    """

    def _get(self):

        self.serve_success(str(self.request.user))


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
