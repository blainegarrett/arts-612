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


class Event(ndb.Model):
    """
    Model Representing an Event that may occur spanning multiple days (Event Date)
    """

    slug = ndb.StringProperty()
    title = ndb.StringProperty()
    intro = ndb.TextProperty()
    description = ndb.TextProperty()
    featured = ndb.BooleanProperty(default=False)
    venue_key = ndb.KeyProperty(kind=Venue)


class EventDate(ndb.Model):
    """
    Model Representing a specific block of time
    """
    event_key = ndb.KeyProperty(kind=Event)
    start_datetime = ndb.DateTimeProperty()
    end_datetime = ndb.DateTimeProperty()
    venue_key = ndb.KeyProperty(kind=Venue)
    label = ndb.StringProperty()

