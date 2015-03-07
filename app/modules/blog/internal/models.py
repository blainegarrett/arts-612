from google.appengine.ext import ndb


class BlogPost(ndb.Model):
    """
    Model for Blog Post
    """

    title = ndb.StringProperty() # Post Name
    slug = ndb.StringProperty() # Post slug for permalinks
    content = ndb.TextProperty()
    summary = ndb.TextProperty()
    # author
    # primary_image
    primary_image_resource_id = ndb.StringProperty()
    attachment_resources =  ndb.StringProperty(repeated=True)
    created_date = ndb.DateTimeProperty(auto_now_add=True)
    modified_date = ndb.DateTimeProperty(auto_now=True)
    published_date = ndb.DateTimeProperty()