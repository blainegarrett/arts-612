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
from rest.params import coerce_from_datetime

from files.rest_helpers import FileField
from auth.controllers import REST_RULES as USER_REST_RULES
from modules.blog.internal import api as blog_api
from modules.events.internal import api as events_api
from modules.blog.internal.models import BlogPost
from utils import get_domain

from datetime import datetime
from pytz import timezone

import logging

from modules.events.internal.api import generic_search
from cal.controllers import create_resource_from_entity as create_event_resource

from utils import ubercache


def unix_time(dt):
    """
    Create a Unix Timestamp of a date
    TODO: This is duplicated from modules.events.internal.search
    """

    if isinstance(dt, basestring):
        try:
            fmt = '%Y-%m-%d %H:%M:%S'
            dt = datetime.datetime.strptime(dt, fmt)
        except ValueError:
            # Attempt full day method
            fmt = '%Y-%m-%d'
            dt = datetime.datetime.strptime(dt, fmt)

    # Make it the epoch in central time..
    epoch = datetime.utcfromtimestamp(0) # .replace(tzinfo=timezone('UTC'))

    delta = dt - epoch
    return delta.total_seconds()


def sortfunc(event):
    target_ed = getattr(event, 'target_ed', None)

    sort_attr = 'end'
    if target_ed == 'timed':
        sort_attr = 'start'

    for ed in event.event_dates:
        if ed.end and ed.type == target_ed and ed.end < datetime.now():
            logging.error(unix_time(getattr(ed, sort_attr, None)))
            return unix_time(getattr(ed, sort_attr, None))
    return 14252616000000


class HomeApiHandler(RestHandlerBase):
    """
    Rest resources for homepage
    """

    def _get(self):

        limit = 30

        # Upcoming
        today = datetime.now(timezone('US/Central'))
        today = today.replace(hour=3, minute=0, second=0)
        upcoming_end = today

        upcoming = generic_search(end=upcoming_end, sort='start', limit=limit,
                                  category=[u'performance', u'reception', u'sale'])
        for e in upcoming:
            setattr(e, 'target_ed', 'timed')

        # Ongoing - sorted by ending date
        today = datetime.now().replace(hour=0, minute=0, second=0, tzinfo=timezone('US/Central'))
        end = start = today

        ongoing = generic_search(end=end, start=start, sort='end', category=[u'ongoing'],
                                 limit=limit)
        for e in ongoing:
            setattr(e, 'target_ed', 'reoccurring')

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


class FeaturedApiHandler(RestHandlerBase):
    """
    Temporary API Handler for featured content
    """

    def get(self):

        # Serialize the params for cache key
        key = 'super_featured'

        cached_events = ubercache.cache_get(key)
        if cached_events:
            results = cached_events
        else:

            slugs = [
                'walker-after-hours-preview-party-international-pop',
                'grand-opening-3-exhibitions-by-betsy-hunt-and-zach-moser-samual-weinberg-and-lindsay-smith',
                'underlined-action',
                'boys-or-women-mary-simpson',
                'mplsart-com-launch-party',
            ]

            results = []

            for slug in slugs:
                event = events_api.get_event_by_slug(slug)
                if event:
                    results.append(create_event_resource(event))

            ubercache.cache_set(key, results, category='events')

        # Finally...
        self.serve_success(results)


class InstagramPhotos(RestHandlerBase):
    """
    Temp feed to serve up instagram photos
    """
    
    def get(self):
        from instagram.client import InstagramAPI

        results = []

        # Fetch the latest images
        api = InstagramAPI(client_id='f8bd629294624b48a939ef9401f0a037', client_secret='3805b39a7041441392f1949ec059e954')
        popular_media, more_url = api.tag_recent_media(count=45, tag_name='mplsart')


        for media in popular_media:
            # TODO: Convert this to a resource with rules
            resource_dict = {}
            resource_dict['id'] =  media.id
            resource_dict['type'] =  media.type
            #resource_dict['caption'] = media.caption

            resource_dict['created_time'] = coerce_from_datetime(media.created_time)
            resource_dict['comment_count'] = media.comment_count
            resource_dict['like_count'] = media.like_count
            resource_dict['link'] = media.link
            resource_dict['filter'] = media.filter

            # These need to be 'unfolded'
            #resource_dict['likes'] = media.likes
            #resource_dict['user'] = media.user
            #resource_dict['tags'] = media.tags
            #resource_dict['location'] = media.location

            resource_dict['resource_type'] = 'Instagram'
            resource_dict['standard_resolution'] = media.images['standard_resolution'].url

            results.append(resource_dict)

        self.serve_success(results)
