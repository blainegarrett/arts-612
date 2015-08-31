"""
Simple Library for Global Settings
"""

from google.appengine.ext import ndb

from auth.decorators import rest_login_required

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, JSONField


GLOBAL_SETTING_KEY_ID = 'default'


class GlobalSettings(ndb.Model):
    """
    Model Representing Setting for the site
    """

    FEATURED_HEADER_RESOURCES = ndb.JsonProperty()
    GOOGLE_ANALYTICS_ID = ndb.StringProperty()


#  Accessor Methods
def get_global_settings():

    # TODO: Check if local thread and not stale

    global_settings_entity_key = ndb.Key('GlobalSettings', GLOBAL_SETTING_KEY_ID)
    setting_entity = global_settings_entity_key.get()

    if not setting_entity:
        setting_entity = GlobalSettings(key=global_settings_entity_key)
        _put_settings(setting_entity)

    return setting_entity


def set_global_settings(pairs):
    """
    TODO: What if we already have a setting obj available?
    """

    setting_entity = get_global_settings()
    if not pairs:
        return setting_entity

    for setting_key, setting_val in pairs.items():
        setattr(setting_entity, setting_key, setting_val)

    _put_settings(setting_entity)
    return setting_entity


def set_global_setting(setting_key, setting_val):
    """
    TODO: What if we already have a setting obj available?
    """

    return set_global_settings({setting_key: setting_val})


def get_global_setting(setting_key):
    setting_entity = get_global_settings()
    return getattr(setting_entity, setting_key)


def _put_settings(setting_entity):
    """
    Write a populated GlobalSettings to disk
    """

    setting_entity.put()
    # TODO: Update local thread?


# Handlers


REST_RULES = [
    JSONField(GlobalSettings.FEATURED_HEADER_RESOURCES),
    RestField(GlobalSettings.GOOGLE_ANALYTICS_ID),
]


class GlobalSettingsHandler(RestHandlerBase):

    def get_rules(self):
        return REST_RULES

    def _get(self):
        e = get_global_settings()

        results = Resource(e, REST_RULES).to_dict()
        self.serve_success(results)

    @rest_login_required
    def _put(self):

        # Note: At the moment this is doing a .put() for key/val pair
        e = set_global_settings(self.cleaned_data)

        results = Resource(e, REST_RULES).to_dict()
        self.serve_success(results)
