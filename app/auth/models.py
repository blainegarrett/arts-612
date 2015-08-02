# Models for Users/Authentication, etc

from google.appengine.ext import ndb


class User(ndb.Model):
    """
    Model representing a user
    """

    firstname = ndb.StringProperty()
    lastname = ndb.StringProperty()
    website = ndb.StringProperty()

    def __repr__(self):
        """
        For easy debugging
        """
        return '<User username="%s" is_authenticated="%s">' % (self.firstname, self.lastname)


class AuthMethod(ndb.Model):
    """
    Model Representing different Authentication bits
    """
    pass


class AnonymousUser(object):
    """

    """
    def __repr__(self):
        return '<AnonymousUser />'
