from tests import BaseCase
from google.appengine.ext import ndb
from rest import utils
import mock


class RestUtilsBaseCase(BaseCase):
    pass


@mock.patch('base64.urlsafe_b64encode')
class GetResourceIdTestCase(RestUtilsBaseCase):

    def test_single_pair(self, m_encode):
        key = ndb.Key('Parent', 123)
        utils.get_resource_id_from_key(key)
        m_encode.assert_called_once_with(u'Parent\x1e\x1f123')

    def test_multiple_pair(self, m_encode):
        key = ndb.Key('Parent', 123, 'Child', 'el-ni\u2099o')
        utils.get_resource_id_from_key(key)
        m_encode.assert_called_once_with(u'Parent\x1e\x1f123\x1eChild\x1eel-ni\\u2099o')


class GetResourceIdIntegrationCase(RestUtilsBaseCase):

    def test_single_pair(self):
        key = ndb.Key('Parent', 123)
        result = utils.get_resource_id_from_key(key)
        self.assertEqual(result, 'UGFyZW50Hh8xMjM')

    def test_multiple_pair(self):
        key = ndb.Key('Parent', 123, 'Child', 'el-ni\u2099o')
        result = utils.get_resource_id_from_key(key)
        self.assertEqual(result, 'UGFyZW50Hh8xMjMeQ2hpbGQeZWwtbmlcdTIwOTlv')


class GetKeyFromResource(RestUtilsBaseCase):

    def test_base_case(self):
        """
        Test general conversion including int ids
        """

        result = utils.get_key_from_resource_id('UGFyZW50Hh8xMjMeQ2hpbGQeZWwtbmlcdTIwOTlv')
        self.assertEqual(result, ndb.Key('Parent', 123, 'Child', 'el-ni\u2099o'))

    def test_get_triple(self):
        """
        Additional Test Case to ensure that we can do more than 3 pairs
        """

        result = utils.get_key_from_resource_id('UGFyZW50Hh8xMjMeQ2hpbGQeHzQ1Nh5HcmFuZB4fNzg5')
        self.assertEqual(result, ndb.Key('Parent', 123, 'Child', 456, 'Grand', 789))
