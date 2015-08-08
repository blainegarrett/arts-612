"""
Auth System Helpers
"""

from rest.utils import get_key_from_resource_id, get_resource_id_from_key # TODO: Don't depend on REST
from auth.models import AnonymousAuthUser, AuthUser, AuthUserMethod
from auth.constants import REQUEST_USER_KEY

import jwt


JWT_SECRET = 'fartssmell'
JWT_ALGORITHM = 'HS256'


def get_auth_token_from_request(request):
    """
    Fetch jwt token off request's headers if they are present.

    :param request: webapp2 Request object
    :return: str of non validated jwt token or None

    TODO: If Debug Enabled, let error bubble up otherwise return None
    """

    prefix = 'Bearer '

    unvalidated_token_str = None
    raw_auth_header_val = request.headers.get('Authorization', None)

    if raw_auth_header_val:

        # TODO: This feels like it should be a regexp
        if prefix not in raw_auth_header_val:
            err = 'Invalid format for Authorization header. Received  "%s"'
            raise RuntimeError(err % raw_auth_header_val)
        unvalidated_token_str = raw_auth_header_val.replace(prefix, '').strip()
        if not unvalidated_token_str:
            raise RuntimeError('No Token Resolved')

    return unvalidated_token_str


def activate_user(user, request):
    """
    Activate the given user on the given request

    :param user: Instance of AuthUser or AnonymousAuthUser
    :param request: webapp2 Request object
    """

    if not isinstance(user, (AnonymousAuthUser, AuthUser)):
        err = 'Arg user must be an instance of a User. Received %s instead'
        raise TypeError(err % user)

    setattr(request, REQUEST_USER_KEY, user)  # Sets request._user = user
    return True


def get_token_payload_from_user(user):
    """
    Generate the payload for a token.
    :param user: Instance of AuthUser or AnonymousAuthUser
    :returns dict payload containing username and resource_id

    Note: This currently assumes that the given user is not AnonymousAuthUser
    TODO: I don't know that we want to depend on REST's resource abstraction?
    """

    #  if isinstance(user, AnonymousAuthUser):
    #    err = 'Can not generate token payload for AnonymousAuthUser yet.'
    #    raise RuntimeError(err)

    if not isinstance(user, (AuthUser, AnonymousAuthUser)):
        err = 'Arg user must be an instance of AuthUser. Received %s'
        raise TypeError(err % user)

    payload = {
        'is_authenticated': user.is_authenticated(),
        'is_member': user.is_member(),
        'username': user.username,
        'resource_id': None
    }
    if isinstance(user, AuthUser):
        payload['resource_id'] = get_resource_id_from_key(user.key)

    return payload


def read_token(token):
    """
    Validate the token
    # TODO: This needs unit tests and exception handling, etc
    """

    payload = jwt.decode(token, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return payload


def make_token(payload):
    """
    Generate a token with the target payload
    # TODO: This needs unit tests and exception handling, etc
    """

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def get_user_from_token_payload(user_token_payload):
    #TODO: Needs Unit Tests

    raise Exception('chicken balls')

    user_key = get_key_from_resource_id(user_token_payload['user_id'])
    user = user_key.get()
    return user


def get_user(request):
    """
    Given a request with Authorization header, resolve the user

    TODO: Wrap this in a bunch of try catch
    TODO: If header is over x minutes old, requery the datastore to update
    TODO: Needs Unit Tests
    """

    # Step 1: Get The Raw JWT Token
    #   Note: This can throw exceptions for bad formats
    token = get_auth_token_from_request(request)
    if not token:
        return AnonymousAuthUser()

    # Step 2: Validate the JWT token
    # This could raise all sorts of jwt exceptions
    user_token_payload = read_token(token)
    user = get_user_from_token_payload(user_token_payload)

    # TODO: Do various checks for active status, etc
    return user


def get_user_for_auth_method(auth_type, auth_token):
    """
    """

    q = AuthUserMethod.query().filter(AuthUserMethod.auth_type == auth_type).filter(AuthUserMethod.auth_token == auth_token)
    login = q.get()

    if login:
        return login.user_key.get()
    return None
