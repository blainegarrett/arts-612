"""
Signup and Authentication routes
"""

from oauth2client import client, crypt

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, ResourceIdField, ResourceUrlField
from rest.utils import get_key_from_resource_id
from auth.decorators import rest_login_required
from utils import get_domain

from auth import helpers as auth_helpers
from auth import api as auth_api
from auth.models import User, AnonymousAuthUser

# TODO: Pull this from global settings
GOOGLE_CLIENT_ID = '945216243808-b7mu8t6ejidit13uperfiv615lf3ridg'

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
    """
    Base Handler for Auth Services
    """

    def get_param_schema(self):
        return {}


class AuthenticateHandler(BaseAuthHandler):
    """
    Handler to authenticate (ouath2, password, etc)
    """

    def get_rules(self):
        return []

    def google_signin(self, google_auth_token):
        """
        Callback for checking out the google auth
        """

        # Let's call out to the Google Auth Service to verify the token
        token = google_auth_token

        # (Receive token by HTTPS POST)
        CLIENT_ID = '%s.apps.googleusercontent.com' % GOOGLE_CLIENT_ID

        # Do the standard checks
        idinfo = client.verify_id_token(token, CLIENT_ID)
        try:
            if idinfo['aud'] not in [CLIENT_ID]: #[ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID]:
                raise crypt.AppIdentityError("Unrecognized client.")
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise crypt.AppIdentityError("Wrong issuer.")
            # if idinfo['hd'] != APPS_DOMAIN_NAME:
            #    raise crypt.AppIdentityError("Wrong hosted domain.")
            userid = idinfo['sub']
        except crypt.AppIdentityError:
            # Invalid token
            userid = idinfo['sub']

        # TODO: We need to link this up

        # Find a Login of type Google with key 109109826248405970889 ?
        # If found,
        #    get the user

        # This is emulating a login query
        import logging

        logging.error('------------------------------------------------------')
        logging.error(idinfo['sub'])
        logging.error('------------------------------------------------------')

        # 109109826248405970889 - workiva
        # 100873466909530814434 - mplsart
        # 109438460339487239529 - blaine

        return auth_helpers.get_user_for_auth_method('GOOGLE', userid)

    def _post(self):
        """
        Handle an authentication attempt
        """

        # Django style iterate over params until we find an auth protocol
        #   that acceps those creds ?

        # This will probably return a Login eventually?
        user = self.google_signin(self.request.POST[u'google_auth_token'])

        if not user:
            # No User was found matching the given credentials
            user = AnonymousAuthUser()

        user_payload = auth_helpers.get_token_payload_from_user(user)

        self.serve_success(user_payload)


class DeauthenticateHandler(BaseAuthHandler):
    pass


class SecureHandlerBase(BaseAuthHandler):
    """
    Base handler that acts as middleware to add user to request
    """

    def dispatch(self):
        """
        """

        # Get User off the request header auth token
        user = auth_helpers.get_user(self.request)

        # This will attach user to request and update last access
        auth_helpers.activate_user(user, self.request)
        super(SecureHandlerBase, self).dispatch()


class SomeSecureHandler(SecureHandlerBase):
    """
    """

    def _get(self):
        """
        Some sort of example handler
        """

        payload = {'frog': True}
        self.serve_success(payload)


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










class StatusHandler(BaseAuthHandler):
    """
    Handler to get authentication status for debugging
    """

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
