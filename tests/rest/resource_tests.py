from tests import BaseCase
import unittest

from rest import resource

class RestBaseCase(BaseCase):
    """
    """
    pass

class ResourceTestCase(RestBaseCase):
    """
    """

    def test_errors(self):
        r = resource.Resource('cheese', [])
        
    
