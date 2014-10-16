"""
Tests Cases for Events Plugin API Core methods
"""

import unittest
from mock import Mock, patch

from google.appengine.ext import ndb

from modules.venues.internal import api
#from modules.venues.internal import search
from modules.venues.constants import VENUE_KIND


class VenueApiTestBase(unittest.TestCase):
    """
    Base Test Case for Venue Api helpers
    """
    pass


class GetVenueKeyTests(VenueApiTestBase):
    """
    Tests surrounding getting venue key
    """

    def test_base(self):
        test_slug = 'test'
        result_key = api.get_venue_key(test_slug)

        self.assertTrue(isinstance(result_key, ndb.Key))
        self.assertEqual(result_key.kind(), VENUE_KIND)

    def test_errors(self):
        """
        Ensure that passing in None or invalid types triggers errors
        """

        self.assertRaises(RuntimeError, api.get_venue_key, None)
        self.assertRaises(RuntimeError, api.get_venue_key, '')
        self.assertRaises(RuntimeError, api.get_venue_key, {})
        self.assertRaises(RuntimeError, api.get_venue_key, 612)


class GetVenueKeyByKeyStrTestsCases(VenueApiTestBase):
    """
    Tests surrounding getting the venue key via urlsafe keystr
    """
    @patch('modules.venues.internal.api.get_entity_key_by_keystr')
    def test_base(self, m_get):
        """
        Ensure our keystr helper wrapper calls the ndb.Key constructor correctly
        """

        # Run code under test
        result = api.get_venue_key_by_keystr('some_url_safe_keystr')

        # Check mocks
        self.assertEqual(result, m_get.return_value)
        m_get.assert_called_once_with(VENUE_KIND, 'some_url_safe_keystr')


class GetVenueBySlugTests(VenueApiTestBase):
    """
    Tests surrounding getting venue slug
    """

    @patch('modules.venues.internal.api.get_venue_key')
    def test_base(self, m_get_venue_key):
        # Setup Mocks
        test_slug = 'test'
        mock_key = Mock()
        mock_key.get = Mock(return_value='VenueEntity') # Mock key.get() call

        m_get_venue_key.return_value = mock_key

        # Run code under test
        result = api.get_venue_by_slug(test_slug)

        # Check mocks
        m_get_venue_key.assert_called_once_with('test')
        mock_key.get.assert_called_once_with()
        self.assertEqual(result, 'VenueEntity')

    def test_errors(self):
        """
        Ensure that passing in None or invalid types triggers errors
        Note: We may want to eventually catch exception and return None
        """

        self.assertRaises(RuntimeError, api.get_venue_by_slug, None)
        self.assertRaises(RuntimeError, api.get_venue_by_slug, '')
        self.assertRaises(RuntimeError, api.get_venue_by_slug, {})
        self.assertRaises(RuntimeError, api.get_venue_by_slug, 612)


class CreateVenueTests(VenueApiTestBase):
    pass


class EditVenueTests(VenueApiTestBase):
    pass


class DeleteVenueTests(VenueApiTestBase):
    pass


class FetchVenueListTests(VenueApiTestBase):
    pass
