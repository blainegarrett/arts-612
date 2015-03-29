from google.appengine.ext import ndb

class EventDate(ndb.Model):
    """
    Model for StructuredProperty - Event.event_dates
    """

    start = ndb.DateTimeProperty()
    end = ndb.DateTimeProperty()
    type = ndb.StringProperty()
    category = ndb.StringProperty()
    label = ndb.StringProperty()
    venue_slug = ndb.StringProperty()
    # Eventually, address, etc if no target venue...


class Event(ndb.Model):
    """
    Model Representing an "Event", which may consist of one or more dates
    """

    name = ndb.StringProperty() # Event Name
    slug = ndb.StringProperty() # Event slug for permalinks
    url = ndb.StringProperty() # Main external url for the event

    event_dates = ndb.StructuredProperty(EventDate, repeated=True)
    primary_image_resource_id = ndb.StringProperty()
    attachment_resources =  ndb.StringProperty(repeated=True)
    created_date = ndb.DateTimeProperty(auto_now_add=True)
    modified_date = ndb.DateTimeProperty(auto_now=True)

    content = ndb.TextProperty()
    summary = ndb.TextProperty()
    featured = ndb.BooleanProperty()


    '''
    event_date is a list of dicts for the different event_dates
    this is non queryable storage used to populate search indexes which are used for querying
    
    // Event dates can either be associated with a specific venue OR can be an ad-hoc location eg. some place we really don't want to list anywhere else ever someone's home, etc

    // Example of a "Timed Event" (i.e. one with a consise start/end time)
    {
        'type': 'timed',
        'category': '',
        'label': 'Opening Reception',
        'start': 2014-10-31 18:00:00,
        'end': 2014-10-31 11:59:00,
        'venue_slug': 'abstracted-gallery', //or
        'location: {
            'name':
            'address': ...
        }'
        '': ,
    }

    // Need to figure out
     - rules based on a venue's hours (gallery hours)
     - full day events ()
     - re-occurring events (rules are stored) (gallery hours?)
     - Long running 'anytime' events (public installation?)
    '''

    # Related links
    # Price, etc

    # ?? 
    #start_time = ndb.DateTimeProperty()
    #end_time = ndb.DateTimeProperty()
    #venue_key = ndb.KeyProperty()
    #category = ndb.StringProperty() # Categorization reception, opening, closing, event, gallery hours
    #label = ndb.StringProperty() # "Opening Reception"
