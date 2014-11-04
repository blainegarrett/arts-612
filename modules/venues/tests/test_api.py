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

    def setUp(self):
        """
        Set up a fake gallery and key to tinker with
        """

        self.fake_venue_key = ndb.Key(VENUE_KIND, 'x-gallery')
        self.fake_venue = Mock(name="Fake Venue Entity") # TODO: spec to the kind
        self.fake_venue.slug = 'x-gallery'
        self.fake_venue.key = self.fake_venue_key


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


@patch('modules.venues.internal.api.get_venue_key')
@patch('modules.venues.internal.api._create_venue_txn')
class CreateVenueTestCases(VenueApiTestBase):
    """
    Tests around the method to create venues
    """

    def test_base(self, m_txn, m_get_key):
        """
        Trivial test to ensure that our transactional helper is called
        """

        # Run Code To Test
        result = api.create_venue({'some': 'data', 'slug': 'z-gallery'})

        # Test Mocks
        self.assertEqual(result, m_txn.return_value)
        m_get_key.assert_called_once_with('z-gallery')
        m_txn.assert_called_once_with(m_get_key.return_value, 
                                      {'geo': None, 'some': 'data', 'slug': 'z-gallery'},
                                      None)


    def test_with_geo_dict(self, m_txn, m_get_key):
        """
        Test to ensure that Geo coords work as expected
        """

        # Run Code To Test
        geo_dict = {'lat': 44, 'lon': 33}
        result = api.create_venue({'geo': geo_dict, 'slug': 'z-gallery'})

        # Test Mocks
        self.assertEqual(result, m_txn.return_value)
        m_get_key.assert_called_once_with('z-gallery')
        m_txn.assert_called_once_with(m_get_key.return_value, 
                                     {'geo': ndb.GeoPt(lat=44, lon=33),
                                     'slug': 'z-gallery'}, None)

    def test_with_geo_string(self, m_txn, m_get_key):
         """
         Test to ensure that Geo coords work as expected
         """

         # Run Code To Test
         geo_dict = '44, -33'
         result = api.create_venue({'geo': geo_dict, 'slug': 'z-gallery'})

         # Test Mocks
         self.assertEqual(result, m_txn.return_value)
         m_get_key.assert_called_once_with('z-gallery')
         m_txn.assert_called_once_with(m_get_key.return_value,
                                      {'geo': ndb.GeoPt(lat=44, lon=-33),
                                      'slug': 'z-gallery'}, None)


class CreateVenueTxnTestCases(VenueApiTestBase):
    """
    Tests around the transactional helper to create venues
    """


@patch('modules.venues.internal.api._edit_venue_txn')
class EditVenueTestsCases(VenueApiTestBase):
    """
    Tests around method to edit venues
    """

    def test_base(self, m_txn):
        """
        """
        
        # Run Code To Test
        result = api.edit_venue(self.fake_venue, {'some': 'data'})

        # Test Mocks
        self.assertEqual(result, m_txn.return_value)
        m_txn.assert_called_once_with(self.fake_venue_key, {'some': 'data'}, None)


class EditVenueTxnTestsCases(VenueApiTestBase):
    """
    Tests around the transactional helper to edit venues
    """


class DeleteVenueTestCases(VenueApiTestBase):
    """
    Tests around method to delete venues
    """

    # TODO: Refactor the txn code to be more unit testable


@patch('modules.venues.internal.api._delete_venue_txn')
class DeleteVenueTxnTestCases(VenueApiTestBase):
    """
    Tests around the transactional helper to delete venues
    """

    def test_base(self, m_txn):
        """
        Test to ensure our delete method calls the transactional helper
        """

        # Run Code to Test
        result = api.delete_venue(self.fake_venue)

        # Check Mocks
        self.assertEqual(result, m_txn.return_value)
        m_txn.assert_called_once_with(self.fake_venue_key, None)
