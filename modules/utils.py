# General Utilities for Data Modules
from google.appengine.ext import ndb


def get_entity_key_by_keystr(expected_kind, keystr):
    """
    Helper to get a key for an entity by its keystr and validate the kind
    """

    attr_err = 'Keystrings must be an instance of base string, recieved: %s' % keystr
    kind_err = 'Expected urlsafe keystr for kind %s but received keystr for kind %s instead.'

    if not keystr or not isinstance(keystr, basestring):
        raise RuntimeError(attr_err)

    key = ndb.Key(urlsafe=keystr)
    if not key.kind() == expected_kind:
        raise RuntimeError(kind_err % (expected_kind, key.kind()))

    return key
