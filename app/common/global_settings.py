"""
Simple Library for Global Settings
"""

from google.appengine.ext import ndb


GLOBAL_SETTING_KEY_ID = 'default'


class GlobalSettings(ndb.Model):
    """
    Model Representing Setting for the site
    """

    FEATURED_HEADER_RESOURCES = ndb.JsonProperty()


#  Accessor Methods
def get_global_settings():

    # TODO: Check if local thread and not stale

    global_settings_entity_key = ndb.Key('GlobalSettings', GLOBAL_SETTING_KEY_ID)
    setting_entity = global_settings_entity_key.get()

    if not setting_entity:
        setting_entity = GlobalSettings(key=global_settings_entity_key)
        _put_settings(setting_entity)

    return setting_entity


def set_global_setting(setting_key, setting_val):
    """
    TODO: Wrap this in a transaction
    TODO: What if we already have a setting obj available?
    """

    setting_entity = get_global_settings()
    if setting_entity is not None:
        setattr(setting_entity, setting_key, setting_val)
        _put_settings(setting_entity)


def _put_settings(setting_entity):
    """
    Write a populated GlobalSettings to disk
    """

    setting_entity.put()
    # TODO: Update local thread?
