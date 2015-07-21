# Models for Users/Authentication, etc

from google.appengine.ext import ndb


class User(ndb.Model):
    """
    Model representing a user
    """

    firstname = ndb.StringProperty()
    lastname = ndb.StringProperty()
    website = ndb.StringProperty()
