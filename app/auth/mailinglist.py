"""
Super Simple mailing list signup model and api
"""

from google.appengine.ext import ndb

class MailingListRecord(ndb.Model):
  """
  Models an individual Guestbook entry with content and date.
  """
  email = ndb.StringProperty()
  created = ndb.DateTimeProperty(auto_now_add=True)
  ip_address = ndb.StringProperty()


@ndb.transactional
def _create_record(email, ip_address=None):
    """
    """
    
    # Finally Create the Record
    record = MailingListRecord(email=email, ip_address=ip_address)
    record.put()
    return True

def create_record(email, ip_address):
    """
    Nice Interface to Create a Mailing List Record
    """

    existing_record = MailingListRecord.query().filter(MailingListRecord.email == email).get()
    if existing_record:
        return False

    return _create_record(email, ip_address)