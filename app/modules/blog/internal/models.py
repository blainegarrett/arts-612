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
    published_date = ndb.DateTimeProperty(indexed=True)
    is_published = ndb.BooleanProperty(default=False, indexed=True)

    @property
    def permalink(self):
        #TODO: what to return if not published...

        pub_date = self.published_date
        return '/written/%s/%s/%s/' % (pub_date.year, pub_date.month, self.slug)

    @property
    def absolute_permalink(self):
        return 'http://%s%s' % (get_domain(), self.permalink)