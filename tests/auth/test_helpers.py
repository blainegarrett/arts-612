# Tests for the basic handlers


import datetime

from mock import patch, Mock
from google.appengine.api import memcache
from google.appengine.ext import ndb

from utils import ubercache
from tests import BaseCase
import webapp2
import main

from auth import helpers as auth_helpers
from auth import models as auth_models
from auth.constants import REQUEST_USER_KEY


class GetAuthTokenFromRequestTestCase(BaseCase):

    def mock_auth_header_request(self, header_value):
        request = Mock()
        request.headers = Mock()
        request.headers.get = Mock(return_value=header_value)
        return request

    def test_base(self):

        # Authorization -> Bearer token_string
        request = self.mock_auth_header_request(u'Bearer token_string')
        result = auth_helpers.get_auth_token_from_request(request)
        self.assertEqual(result, 'token_string')

    def test_invalid_format(self):

        # Authorization -> Bearer token_string
        request = self.mock_auth_header_request(u'Bearer: token_string')
        self.assertRaises(RuntimeError,
                          auth_helpers.get_auth_token_from_request, request)

    def test_no_token(self):
        request = self.mock_auth_header_request(u'Bearer ')
        self.assertRaises(RuntimeError,
                          auth_helpers.get_auth_token_from_request, request)


class ActivateUserTestCase(BaseCase):

    def test_invalid_args(self):
        mock_request = Mock()
        mock_user = 612  # Not an instance of a AuthUser or AnonymousAuthUser
        self.assertRaises(TypeError,
                          auth_helpers.activate_user, mock_user, mock_request)

    def test_anonymous_user_success(self):

        mock_user = auth_models.AnonymousAuthUser()
        mock_request = Mock()

        result = auth_helpers.activate_user(mock_user, mock_request)

        self.assertEqual(result, True)
        self.assertEqual(getattr(mock_request, REQUEST_USER_KEY), mock_user)

    def test_known_user_success(self):
        mock_user = auth_models.AuthUser()
        mock_request = Mock()

        result = auth_helpers.activate_user(mock_user, mock_request)

        self.assertEqual(result, True)
        self.assertEqual(getattr(mock_request, REQUEST_USER_KEY), mock_user)


@patch('auth.helpers.get_resource_id_from_key', return_value='resource_id')
class GetTokenPayloadFromUserTests(BaseCase):
    def test_invalid_args(self, m_get_id):
        u = 612
        self.assertRaises(TypeError, auth_helpers.get_token_payload_from_user, u)

    def test_anon_user(self, m_get_id):
        u = auth_models.AnonymousAuthUser()
        self.assertRaises(RuntimeError, auth_helpers.get_token_payload_from_user, u)

    def test_known_user(self, m_get_id):
        # Set Up Test
        u_key = ndb.Key('AuthUser', 612)
        u = auth_models.AuthUser(key=u_key, username='testuser')

        # Run Code To Test
        result = auth_helpers.get_token_payload_from_user(u)

        # Check result and Mocks
        expected_payload = {
            'username': 'testuser',
            'resource_id': m_get_id.return_value
        }

        self.assertDictEqual(result, expected_payload)
        m_get_id.assert_called_once_with(u_key)

