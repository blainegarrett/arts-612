# Models for Users/Authentication, etc

# Please, please, please keep this organized and clean

from google.appengine.ext import ndb


class User(ndb.Model):
    """
    Model representing a user - currently only used for 'author' for posts
    We want to keep these conceptually separate I think.
    Author should be separate than auth/permission
    """

    firstname = ndb.StringProperty()
    lastname = ndb.StringProperty()
    website = ndb.StringProperty()

    def __repr__(self):
        """
        For easy debugging
        """
        return '<User username="%s" is_authenticated="%s">' % (self.firstname, self.lastname)


class AuthUser(ndb.Model):
    """
    Lightweight model representing a user
    """

    username = ndb.StringProperty()
    email = ndb.StringProperty()
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()

    def __repr__(self):
        """
        For easy debugging
        """

        return '<AuthUser username="%s">' % (self.username)

    def get_display_name(self):
        """
        Helper Method for yeilding a nice display name
        """

        if self.first_name and self.last_name:
            return u'%s %s' % (self.first_name, self.last_name)
        else:
            return self.username

    def is_member(self):
        return True

    def is_authenticated(self):
        """
        TODO: Return if this user has been authenticated
        hasattr(self, '_authenticated') or perhaps set the auth token on the
        in memory object and validate it with each check?
        """

        return False # TODO: Obviously not working yet


class AnonymousAuthUser(object):
    """
    AuthUser-like interface for non authenticated users
    This should be kept in sync with AuthUser so they can be generally used
    with the same interface

    TODO: Think about how we'll keep track of authenticated people who just
        don't have users in our system - social logins, etc
    """

    username = None
    email = None
    first_name = None
    last_name = None

    def __repr__(self):
        return u'<AnonymousAuthUser />'

    def get_display_name(self):
        return u"Guest"

    def is_authenticated(self):
        """
        An AnonymousUser can never be authenticated... otherwise they'd be an
            AuthUser
        """
        return False

    def is_member(self):
        return False


class AuthUserMethod(ndb.Model):
    auth_type = ndb.StringProperty()  # GOOGLE, FACEBOOK, PASSWORD, etc
    auth_token = ndb.StringProperty()  # Whatever the token is for
    auth_data = ndb.StringProperty()
    user_key = ndb.KeyProperty(kind=AuthUser)
