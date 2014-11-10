import unittest

from google.appengine.ext import testbed
from modules.events.internal.api import Event
import rest

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