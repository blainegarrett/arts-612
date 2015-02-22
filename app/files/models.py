from google.appengine.ext import ndb


class FileContainer(ndb.Model):
    """
    Model Representing a File Attachment Storage Object
    """

    filename = ndb.StringProperty()
    blob_key = ndb.BlobKeyProperty()
    content_type = ndb.StringProperty()
    gcs_filename = ndb.StringProperty()
    size = ndb.IntegerProperty()
    #creator = ndb.KeyProperty(kind=User)
    created_date = ndb.DateTimeProperty(auto_now_add=True)
    modified_date = ndb.DateTimeProperty(auto_now=True)
    caption = ndb.StringProperty()
    versions = ndb.JsonProperty()
    file_type = ndb.StringProperty() # Primative types, IMG, etc
