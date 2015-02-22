"""
Tests for uber cache module

# TODO: Add Test for when memcache_miss and entity is expired
"""
import datetime

from mock import patch
from google.appengine.api import memcache
from google.appengine.ext import ndb

from utils import ubercache
from tests import BaseCase

'''

@patch('utils.ubercache.datetime')
class TestUbercache(BaseCase):

    def test_fork(self, m_dt):

        m_dt.now.return_value = datetime.datetime(year=2015, month=1, day=1)

        pass

    def test_integration(self, m_dt):
        """
        This is an integration test
        """

        m_dt.now.return_value = datetime.datetime(year=2015, month=1, day=1)

        self.assertTrue(ubercache.cache_set('fish', 'some cool data', 60, category='events'))
        self.assertEqual('some cool data', ubercache.cache_get('fish'))

        ubercache.cache_invalidate('events')

    def test_add(self, m_dt):
        """
        Tests surrounding adding a key
        """
        val = 'some cool data'

        m_dt.now.return_value = datetime.datetime(year=2015, month=1, day=1)


        self.assertTrue(ubercache.cache_set('baseball', val, 60, category='events'))

        # Check if it is in memcache
        self.assertEqual(memcache.get('baseball'), val)

        # Check if it is in datastore
        key = ndb.Key('MemcacheEntity', 'baseball') # Implicitly tests key
        entity = key.get()

        # Check various properties to ensure they were set
        self.assertEqual(entity.expiration_time, 60) # Expiration value
        self.assertEqual(entity.expires, datetime.datetime(year=2015, month=1, day=1, minute=1))
        self.assertEqual(entity.category, ['events']) # Categories
        self.assertEqual(entity.value, val) # Categories

    def test_add_no_category_nor_expiration(self, m_dt):
        """
        Tests surrounding not having a catgory or expiration time
        """
        val = 'some cool data'

        m_dt.now.return_value = datetime.datetime(year=2015, month=1, day=1)

        self.assertTrue(ubercache.cache_set('baseball', val, None, category=None))

        # Check if it is in memcache
        self.assertEqual(memcache.get('baseball'), val)

        # Check if it is in datastore
        key = ndb.Key('MemcacheEntity', 'baseball') # Implicitly tests key
        entity = key.get()

        # Check various properties to ensure they were set
        self.assertEqual(entity.expiration_time, None) # Expiration value
        self.assertEqual(entity.expires, None)
        self.assertEqual(entity.category, []) # Categories
        self.assertEqual(entity.value, val) # Categories

    def test_no_cached_value(self, m_dt):
        """
        Test Behavior when there is a memcache miss. Specifically test that memcache.set called
        """

        val = 'some cool data'
        self.assertTrue(ubercache.cache_set('baseball', val, None, category=None))

        # Next Flush the cache but leave the datastore entity intact
        memcache.delete('baseball')

        with patch('utils.ubercache.cache_set') as m_set:
            self.assertEqual(ubercache.cache_get('baseball'), val)
            m_set.assert_called_once_with('baseball', val, None, write_entity=False)

    def test_delete(self, m_dt):
        val = 'some cool data'
        self.assertTrue(ubercache.cache_set('baseball', val, None, category=None))

        self.assertEqual(ubercache.cache_get('baseball'), val)
        ubercache.cache_delete('baseball')
        self.assertEqual(ubercache.cache_get('baseball'), None)

    def test_invalidate(self, m_dt):
        val = 'some cool data'

        m_dt.now.return_value = datetime.datetime(year=2015, month=1, day=1)
        self.assertTrue(ubercache.cache_set('baseball', val, 60, category=['venues', 'events']))

        self.assertEqual(ubercache.cache_get('baseball'), val)
        self.assertEqual(["baseball"], ubercache.cache_invalidate('events'))

        # Ensure entity is gone
        self.assertEqual(memcache.get('baseball'), None)

        # Ensure memcache key is gone
        key = ndb.Key('MemcacheEntity', 'baseball') # Implicitly tests key
        entity = key.get()
        self.assertEqual(entity, None)

'''