# Auth Api methods
from auth.models import User


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
