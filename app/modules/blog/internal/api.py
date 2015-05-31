"""
Internal API for Written Feed Blog Posts
"""

import datetime
from google.appengine.ext import ndb

from utils import ubercache
from rest.utils import get_key_from_resource_id, get_resource_id_from_key

from modules.blog.internal.models import BlogPost, BlogCategory
from modules.blog.constants import AUTHOR_PROP, PRIMARY_IMAGE_PROP, CATEGORY_PROP


def bulk_dereference_posts(posts):
    """
    Bulk dereference author and image. This is to increase performance for rss and rest collections
    """

    # Step 1: Collect all the resources we need and prep the map
    entity_map = {}
    for post in posts:

        # Default the dereferenced prop placeholders
        setattr(post, AUTHOR_PROP, None)
        setattr(post, PRIMARY_IMAGE_PROP, None)
        setattr(post, CATEGORY_PROP, None)

        # Collect properties we want to bulk dereference
        if post.author_resource_id:
            entity_map[get_key_from_resource_id(post.author_resource_id)] = None

        if post.primary_image_resource_id:
            entity_map[get_key_from_resource_id(post.primary_image_resource_id)] = None

        if post.category_resource_id:
            entity_map[get_key_from_resource_id(post.category_resource_id)] = None

    # Fetch all of the entities we want to deref
    entities = ndb.get_multi(entity_map.keys())

    # Repopulate the map NOTE: This adds keys to map using resource_id rather than key
    for entity in entities:
        entity_map[get_resource_id_from_key(entity.key)] = entity

    # Step 3: Iterate over posts and link up the dereferenced props
    for post in posts:
        if post.author_resource_id:
            e = entity_map.get(post.author_resource_id, None)
            setattr(post, AUTHOR_PROP, e)

        if post.primary_image_resource_id:
            e = entity_map.get(post.primary_image_resource_id, None)
            setattr(post, PRIMARY_IMAGE_PROP, e)

        if post.category_resource_id:
            e = entity_map.get(post.category_resource_id, None)
            setattr(post, CATEGORY_PROP, e)

    return posts


def get_post_by_resource_id(resource_id):
    """
    Given a resource id, fetch the post entity
    #TODO: Error handling?
    TODO: Ensure that it is of kind BlogCategory
    """

    key = get_key_from_resource_id(resource_id)
    return key.get()


def get_post_category_by_resource_id(resource_id):
    """
    Given a resource id, fetch the category entity
    TODO: Ensure that it is of kind BlogCategory
    """
    key = get_key_from_resource_id(resource_id)
    return key.get()


def get_posts(limit=25, cursor=None, **kwargs):
    """
    Primary wrapper for fetching events
    """

    if not limit:
        limit = 25

    q = BlogPost.query()
    
    
    if 'is_published' in kwargs:
        q = q.filter(BlogPost.is_published==kwargs['is_published'])

    q = q.order(-BlogPost.published_date)

    entites, cursor, more = q.fetch_page(limit, start_cursor=cursor)
    return entites, cursor, more


def get_post_by_slug(slug):
    """
    Simple Helper to fetch a post via slug.
    TODO: Cache this to prevent
    """

    entity = BlogPost.query(BlogPost.slug == slug).get()
    return entity


def create_post_category(data):
    """
    Create a Category
    # TODO: Make this transactional
    """

    # Step 1: Ensure there is not another category with this slug
    cat = BlogCategory.query(BlogCategory.slug == data['slug']).get()
    if cat:
        raise Exception('There is already a Post Category with the slug "%s". Please select another.' % data['slug'])
    
    entity = BlogCategory()

    entity.slug = data['slug']
    entity.title = data['title']
    
    entity.put()
    return entity

    
def create_post(data):
    """
    Create an event
    # TODO: Make this transactional
    """

    # check if there are any other posts with this slug

    # Step 1: Validate data
    v = BlogPost.query(BlogPost.slug == data['slug']).get()
    if v:
        raise Exception('There is already an Post with the slug "%s". Please select another.' % data['slug'])


    #Step 2:  Create the base Post Model

    entity = BlogPost()

    maybe_publish = bool(data['is_published'])
    #should_unpublish = (not bool(data['is_published'])) and bool(entity.published_date)

    if maybe_publish:
        entity.is_published = True # Regardless of it it was already true

        if data['published_date']:
            entity.published_date = data['published_date'].replace(tzinfo=None)
        elif entity.published_date is None:
            entity.published_date = datetime.datetime.now() # TODO: Convert to CST
        # else: was previously published so leave the previously published date

    entity.slug = data['slug']
    entity.title = data['title']
    entity.summary = data['summary']
    entity.content = data['content']
    entity.author_resource_id = data.get('author_resource_id')
    entity.category_resource_id = data.get('category_resource_id')

    entity.put()

    # Step 3: Delete any cache keys related
    ubercache.cache_invalidate('written')

    return entity


def edit_post(entity, data):
    """
    Edit an post
    """

    # Create the base Event Model
    maybe_publish = bool(data['is_published'])
    should_unpublish = (not bool(data['is_published'])) and bool(entity.published_date)
    
    if maybe_publish:
        entity.is_published = True # Regardless of it it was already true

        if data['published_date']:
            entity.published_date = data['published_date'].replace(tzinfo=None)
        elif entity.published_date is None:
            entity.published_date = datetime.datetime.now() # TODO: Convert to CST
        # else: was previously published so leave the previously published date

    if should_unpublish:
        # Let's mark as not published - but preserve original published date for archives
        entity.is_published = False


    entity.slug = data['slug']
    entity.title = data['title']
    entity.slug = data['slug']
    entity.title = data['title']
    entity.summary = data['summary']
    entity.content = data['content']
    entity.author_resource_id = data.get('author_resource_id')
    entity.category_resource_id = data.get('category_resource_id')

    entity.put()

    # Step 2: Next update the search indexes incase anything affecting them has changed
    #event_search.maybe_up_update_search_index(entity)

    # Step 3: Kill All caches
    ubercache.cache_invalidate('written')

    return entity


def edit_category(entity, data):
    """
    Edit an category
    # TODO: Make this transactional
    """

    entity.slug = data['slug']
    entity.title = data['title']
    entity.put()

    return entity
