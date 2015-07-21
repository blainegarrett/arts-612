# Tests for the basic handlers


import datetime

from mock import patch, Mock
from google.appengine.api import memcache
from google.appengine.ext import ndb

from utils import ubercache
from tests import BaseCase
import webapp2
import main


class IndexCase(BaseCase):
    def test_base(self):
        # This is a simple test to enumerate all known urls

        self.get_helper('/')
        self.get_helper('/?query=3543')

        self.get_helper('/about', 301)
        self.get_helper('/about/')

        # Written
        self.get_helper('/written', 301)
        self.get_helper('/written/')

        self.get_helper('/written/feed', 301)
        self.get_helper('/written/feed/')

        with patch('cal.controllers.events_api') as m_api:
            m_event = Mock(primary_image_resource_id=None)
            m_api.get_event_by_slug.return_value = m_event
            self.get_helper('/events/cool-event/', 200)
            m_api.get_event_by_slug.assert_called_once_with('cool-event')

        


        # Galleries
        self.get_helper('/galleries', 301)
        self.get_helper('/galleries/')

        with patch('venues.controllers.venues_api') as m_api:
            m_api.get_venue_by_slug.return_value = Mock(name='cheese')
            self.get_helper('/galleries/abstracted/', 200)
            m_api.get_venue_by_slug.assert_called_once_with('abstracted')

        with patch('venues.controllers.venues_api') as m_api:
            m_api.get_venue_by_slug.return_value = Mock(name='cheese')
            self.get_helper('/galleries/abstracted', 301)
            #m_api.get_venue_by_slug.assert_called_once_with('abstracted')




        self.get_helper('/some404', 404)


    def get_helper(self, path, expected_status=200):
        request = webapp2.Request.blank(path)

        # Get a response for that request.
        response = request.get_response(main.app)

        # Let's check if the response is correct.
        err_args = (path, response.status_int, expected_status)
        err = 'Path %s returned %s status but %s was expected.'
        self.assertEqual(response.status_int, expected_status, err % err_args)
