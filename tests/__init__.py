"""
Test Suite for mpls server code
"""

import unittest
import os
import sys

from google.appengine.ext import testbed

# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../app/'))


class BaseCase(unittest.TestCase):
    """
    Base Unit Test Case
    """

    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()

        self.testbed.init_datastore_v3_stub()
        self.testbed.init_taskqueue_stub()

    def tearDown(self):
        self.testbed.deactivate()
        pass
