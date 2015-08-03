# Auth Api methods
from auth.models import User
from rest.utils import get_key_from_resource_id


def get_user_by_resource_id(resource_id):
    user_key = get_key_from_resource_id(resource_id)
    user = user_key.get()
    return user


def get_users():
    """
    Fetch a list of users
    """
    return User.query().fetch(1000)


def create_user(data):
    """
    Create a new user
    """

    user = User(**data)
    user.put()

    return user


def edit_user(user, data):
    """
    Edit a User
    """

    for k, v in data.iteritems():
        setattr(user, k, v)

    user.put()
    return user
