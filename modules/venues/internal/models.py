from google.appengine.ext import ndb

class Venue(ndb.Model):
    """
    Model Representing a Place Where an Event Takes Place
    """

    slug = ndb.StringProperty()
    name = ndb.StringProperty()
    address = ndb.StringProperty()
    address2 = ndb.StringProperty()
    city = ndb.StringProperty()
    state = ndb.StringProperty()
    country = ndb.StringProperty()
    geo = ndb.GeoPtProperty()
    website = ndb.StringProperty()
    phone = ndb.StringProperty()
    email = ndb.StringProperty()
    category = ndb.StringProperty()
