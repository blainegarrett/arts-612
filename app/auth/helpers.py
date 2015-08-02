"""
Auth System Helpers
"""

from rest.utils import get_key_from_resource_id # TODO: Don't depend on REST
from auth.models import AnonymousUser

import jwt


JWT_SECRET = 'fartssmell'
JWT_ALGORITHM = 'HS256'


def get_auth_token_from_request(request):
    """
    Helper to extract token from raw request
    TODO: If Debug Enabled, let error bubble up
    TODO: Case where "Bearer" - not trimmed, spelled wrong, etc
    """

    token = None
    auth_header = request.headers.get('Authorization', None)
    if auth_header:
        token = auth_header.replace('Bearer ', '')  # TODO: Beef this up

    return token


def read_token(token):
    """
    Validate the token
    """

    payload = jwt.decode(token, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return payload


def make_token(payload):
    """
    Generate a token with the target payload
    """

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def get_user(request):
    """
    TODO: Wrap this in a bunch of try catch
    """

    user = AnonymousUser()

    token = get_auth_token_from_request(request)
    if not token:
        return user

    # This will raise all sorts of jwt exceptions
    payload = read_token(token)

    # TODO: we probably don't want to use user_id
    if int(payload['user_id']) == 1234:
        payload['user_id'] = 'VXNlch4fNTYyOTQ5OTUzNDIxMzEyMA'


    user_key = get_key_from_resource_id(payload['user_id'])
    user = user_key.get()

    # TODO: Do various checks for active status, etc
    return user















