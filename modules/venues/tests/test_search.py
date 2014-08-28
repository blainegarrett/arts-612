"""
Tests Cases for Venues search api tools
"""

import unittest
from mock import Mock, patch

from modules.venues.internal import search as venue_search
from modules.venues.constants import VENUE_SEARCH_INDEX


class VenueSearchApiTestBase(unittest.TestCase):
    """
    Base Test Case for Venue Api helpers
    """

    def setUp(self):
        self.fake_venue = Mock()


@patch('modules.venues.internal.search.search.Index')
class GetPrimarySearchIndex(VenueSearchApiTestBase):
    """
    Simple tests around getting the search index
    """

    def test_base(self, m_index):
        # Run Code under test
        result = venue_search.get_search_index()

        # Check mocks
        self.assertEqual(result, m_index.return_value)
        m_index.assert_called_once_with(VENUE_SEARCH_INDEX)


@patch('google.appengine.api.search.TextField')
@patch('google.appengine.api.search.Document')
class BuildIndexTests(VenueSearchApiTestBase):
    """
    Tests surrounding building the search document for a venue
    """

    def test_base(self, m_document, m_text):
        # Run Code Under Test
        result = venue_search.build_index(self.fake_venue)

        # Check Mocks
        # TODO: Check the actual fields calls
        self.assertEqual(m_text.call_count, 3)

        #expected_fields = []
        #m_document.assert_called_once_with(fields=expected_fields, doc_id=self.fake_venue.slug)
        self.assertEqual(result, m_document.return_value)
