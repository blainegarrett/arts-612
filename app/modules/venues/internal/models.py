from google.appengine.ext import ndb


class Venue(ndb.Model):
    """
    Model Representing a Place Where an Event Takes Place
    """

    # class? commercial gallery, university, non-profit, etc
    # open, closed, etc?

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
    hours = ndb.JsonProperty()

    primary_image_resource_id = ndb.StringProperty()
    attachment_resources =  ndb.StringProperty(repeated=True)