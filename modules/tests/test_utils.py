"""
Tests for Module Utilities
"""

import unittest
from mock import Mock, patch

from google.appengine.ext import ndb

from modules import utils as api


class ModuleUtilsBaseCase(unittest.TestCase):
    pass


class GetEventKeyByKeyStrTestsUTIL(ModuleUtilsBaseCase):
    """
    Tests surrounding getting the event key via urlsafe keystr
    """

    @patch('modules.utils.ndb')
    def test_base(self, m_ndb):
        """
        Ensure our keystr helper wrapper calls the ndb.Key constructor correctly
        """

        # Setup Mocks
        m_key = Mock()
        m_key.kind.return_value = 'SomeKind'
        m_key_init = Mock(name='mocked Key class', return_value=m_key)
        m_ndb.Key = m_key_init

        # Run code under test
        result = api.get_entity_key_by_keystr('SomeKind', 'some_url_safe_keystr')

        # Check mocks
        self.assertEqual(result, m_key)
        m_key_init.assert_called_once_with(urlsafe='some_url_safe_keystr')

    def test_invalid_kind(self):
        """
        Ensure urlsafe keys from other Kinds do not work
        """

        bad_keystr = ndb.Key('SomeOtherKind', 612).urlsafe()
        self.assertRaises(RuntimeError, api.get_entity_key_by_keystr, 'SomeKind', bad_keystr)

    def test_errors(self):
        """
        Ensure that passing in None or invalid types triggers errors
        """

        self.assertRaises(RuntimeError, api.get_entity_key_by_keystr, 'SomeKind', None)
        self.assertRaises(RuntimeError, api.get_entity_key_by_keystr, 'SomeKind', '')
        self.assertRaises(RuntimeError, api.get_entity_key_by_keystr, 'SomeKind', 612)
