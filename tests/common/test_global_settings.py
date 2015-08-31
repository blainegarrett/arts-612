from google.appengine.ext import ndb

from mock import patch, Mock
from tests import BaseCase

from common import global_settings as gs


@patch('common.global_settings._put_settings')
class GetGlobalSettingsTestCase(BaseCase):
    def test_no_entity(self, m_put):

        result = gs.get_global_settings()
        m_put.assert_called_once_with(result)

    def test_existing_entity(self, m_put):

        with patch('google.appengine.ext.ndb.Key.get') as m_ndb_get:

            # Setup Mocks
            m_ndb_get.return_value = 'not none'

            # Run Code To Test
            result = gs.get_global_settings()

            # Check Mocks
            self.assertEqual(result, m_ndb_get.return_value)
            m_ndb_get.assert_called_once_with()
            self.assertFalse(m_put.called)


@patch('common.global_settings.get_global_settings')
class GetGlobalSettingTestCase(BaseCase):
    def test_simple(self, m_get):

        # Set up Mocks
        mock_setting_entity = Mock(test_key='test_value')
        m_get.return_value = mock_setting_entity

        # Run Code to Test
        result = gs.get_global_setting('test_key')

        # Check Mocks
        m_get.assert_called_once_with()
        self.assertEqual(result, 'test_value')


@patch('common.global_settings._put_settings')
@patch('common.global_settings.get_global_settings')
class SetGlobalSettingTestCase(BaseCase):
    def test_simple(self, m_get, m_put):

        # Set up Mocks
        mock_setting_entity = Mock()
        m_get.return_value = mock_setting_entity

        # Run Code to Test
        result = gs.set_global_setting('test_key', 'test_value')

        # Check Mocks
        self.assertEqual(result, None)  # No return value
        self.assertEqual(mock_setting_entity.test_key, 'test_value')
        m_put.assert_called_once_with(mock_setting_entity)


class PutSettingsTestCase(BaseCase):
    def test_simple(self):

        # Set up Mocks
        mock_setting_entity = Mock()

        # Run Code to Test
        result = gs._put_settings(mock_setting_entity)

        #  Check Mocks
        self.assertEqual(result, None)
        mock_setting_entity.put.assert_called_once_with()



