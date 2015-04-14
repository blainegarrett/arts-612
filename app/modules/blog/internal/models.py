from google.appengine.ext import ndb
from utils import get_domain

class BlogPost(ndb.Model):
    """
    Model for Blog Post
    """

    title = ndb.StringProperty() # Post Name
    slug = ndb.StringProperty() # Post slug for permalinks
    content = ndb.TextProperty()
    summary = ndb.TextProperty()

    author_resource_id = ndb.StringProperty()

    primary_image_resource_id = ndb.StringProperty()
    attachment_resources =  ndb.StringProperty(repeated=True)
    created_date = ndb.DateTimeProperty(auto_now_add=True)
    modified_date = ndb.DateTimeProperty(auto_now=True)
    published_date = ndb.DateTimeProperty()
    
    @property
    def permalink(self):
        return '/written/%s/%s/%s/' % (self.modified_date.year, self.modified_date.month, self.slug)

    @property
    def absolute_permalink(self):
        return 'http://%s%s' % (get_domain(), self.permalink)