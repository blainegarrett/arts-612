# Tests for the basic handlers


import datetime

from mock import patch, Mock
from google.appengine.api import memcache
from google.appengine.ext import ndb

from utils import ubercache
from tests import BaseCase
import webapp2
import main


class FartCase(BaseCase):
    def test_base(self):
        # This is a simple test to enumerate all known urls
        raise Exception('boom')
