"""
Controllers for the Written section
"""
import voluptuous

from controllers import BaseController

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField, DatetimeField

from rest.resource import ResourceField
from rest.utils import get_key_from_resource_id

from files.rest_helpers import FileField
from auth.controllers import REST_RULES as USER_REST_RULES
from modules.blog.internal import api as blog_api
from modules.blog.internal.models import BlogPost
from utils import get_domain

from datetime import datetime

from modules.events.internal.api import generic_search
from cal.controllers import create_resource_from_entity as create_event_resource

def sortfunc(event):
    target_ed = getattr(event, 'target_ed', None)

    sort_attr = 'end'
    if target_ed == 'timed':
        sort_attr = 'start'

    for ed in event.event_dates:
        if ed.type == target_ed and ed.end < datetime.now():
            return getattr(ed, sort_attr, None)
    return None


class HomeApiHandler(RestHandlerBase):
    """
    Rest resources for homepage
    """

    def _get(self):
        upcoming = generic_search(sort='start', category=[u'performance', u'reception', u'sale'])
        for e in upcoming:
            setattr(e, 'target_ed', 'timed')
        
        ongoing = generic_search(sort='end', category=[u'ongoing'])
        for e in ongoing:
            setattr(e, 'target_ed', 'reoccurring')

        #sorted_results = 
        if not upcoming:
            upcoming = []
        if not ongoing:
            ongoing = []

        upcoming.extend(ongoing)

        results = sorted(upcoming, key=sortfunc)

        return_results = []
        for r in results:
            return_results.append(create_event_resource(r))

        self.serve_success(return_results)

        #{u'sort': 'start', u'category': [u'performance', u'reception', u'sale'], u'end': datetime.datetime(2015, 3, 8, 14, 0, tzinfo=<UTC>)}
        #{u'sort': 'end', u'category': [u'ongoing'], u'end': datetime.datetime(2015, 3, 8, 6, 0, tzinfo=<UTC>), u'start': datetime.datetime(2015, 3, 8, 6, 0, tzinfo=<UTC>)}
        
        
        
        