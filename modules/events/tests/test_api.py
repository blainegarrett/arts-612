"""
Tests Cases for Events Plugin API Core methods
"""

import unittest
from mock import Mock, patch

from google.appengine.ext import ndb

from modules.events.internal import api
#from modules.events.internal import search
from modules.events.constants import EVENT_KIND


class EventApiTestBase(unittest.TestCase):
    """
    Base Test Case for Event Api helpers
    """
    pass


class GetEventKeyTests(EventApiTestBase):
    """
    Tests surrounding getting event key
    """

    def test_base(self):
        test_slug = 'test'
        result_key = api.get_event_key(test_slug)

        self.assertTrue(isinstance(result_key, ndb.Key))
        self.assertEqual(result_key.kind(), EVENT_KIND)

    def test_errors(self):
        """
        Ensure that passing in None or invalid types triggers errors
        """

        self.assertRaises(RuntimeError, api.get_event_key, None)
        self.assertRaises(RuntimeError, api.get_event_key, '')
        self.assertRaises(RuntimeError, api.get_event_key, {})
        self.assertRaises(RuntimeError, api.get_event_key, 612)


class GetEventKeyByKeyStrTests(EventApiTestBase):
    """
    Tests surrounding getting the event key via urlsafe keystr
    """

    @patch('modules.events.internal.api.ndb')
    def test_base(self, m_ndb):
        """
        Ensure our keystr helper wrapper calls the ndb.Key constructor correctly
        """

        # Setup Mocks
        m_key = Mock()
        m_key.kind.return_value = EVENT_KIND
        m_key_init = Mock(name='mocked Key class', return_value=m_key)
        m_ndb.Key = m_key_init

        # Run code under test
        result = api.get_event_key_by_keystr('some_url_safe_keystr')

        # Check mocks
        self.assertEqual(result, m_key)
        m_key_init.assert_called_once_with(urlsafe='some_url_safe_keystr')

    def test_invalid_kind(self):
        """
        Ensure urlsafe keys from other Kinds do not work
        """

        bad_keystr = ndb.Key('SomeOtherKind', 612).urlsafe()
        self.assertRaises(RuntimeError, api.get_event_key_by_keystr, bad_keystr)

    def test_errors(self):
        """
        Ensure that passing in None or invalid types triggers errors
        """

        self.assertRaises(RuntimeError, api.get_event_key_by_keystr, None)
        self.assertRaises(RuntimeError, api.get_event_key_by_keystr, '')
        self.assertRaises(RuntimeError, api.get_event_key_by_keystr, 612)


class GetEventBySlugTests(EventApiTestBase):
    """
    Tests surrounding getting event slug
    """

    @patch('modules.events.internal.api.get_event_key')
    def test_base(self, m_get_event_key):
        # Setup Mocks
        test_slug = 'test'
        mock_key = Mock()
        mock_key.get = Mock(return_value='EventEntity') # Mock key.get() call

        m_get_event_key.return_value = mock_key

        # Run code under test
        result = api.get_event_by_slug(test_slug)

        # Check mocks
        m_get_event_key.assert_called_once_with('test')
        mock_key.get.assert_called_once_with()
        self.assertEqual(result, 'EventEntity')

    def test_errors(self):
        """
        Ensure that passing in None or invalid types triggers errors
        Note: We may want to eventually catch exception and return None
        """

        self.assertRaises(RuntimeError, api.get_event_by_slug, None)
        self.assertRaises(RuntimeError, api.get_event_by_slug, '')
        self.assertRaises(RuntimeError, api.get_event_by_slug, {})
        self.assertRaises(RuntimeError, api.get_event_by_slug, 612)

'''

class CreateEventTests(EventApiTestBase):
    pass


class EditEventTests(EventApiTestBase):
    pass


class DeleteEventTests(EventApiTestBase):
    pass


class FetchEventListTests(EventApiTestBase):
    pass
'''