from google.appengine.ext import ndb

from rest.utils import get_key_from_resource_id, get_resource_id_from_key
from modules.blog.internal.models import BlogPost
from modules.blog.constants import AUTHOR_PROP, PRIMARY_IMAGE_PROP


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

        # Collect properties we want to collect
        if post.author_resource_id:
            entity_map[get_key_from_resource_id(post.author_resource_id)] = None

        if post.primary_image_resource_id:
            entity_map[get_key_from_resource_id(post.primary_image_resource_id)] = None

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

    return posts


def get_posts(limit=25, cursor=None):
    """
    Primary wrapper for fetching events
    """
    q = BlogPost.query().order(-BlogPost.created_date)

    entites, cursor, more = q.fetch_page(limit, start_cursor=cursor)
    return entites, cursor, more



def get_post_by_slug(slug):
    return BlogPost.query(BlogPost.slug == slug).get()


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
    entity.slug = data['slug']
    entity.title = data['title']
    entity.summary = data['summary']
    entity.content = data['content']
    entity.published_date = data.get('published_date')
    entity.author_resource_id = data.get('author_resource_id')
    entity.put()

    # Step 3: Delete any cache keys related
    #ubercache.cache_invalidate('events')

    return entity


def edit_post(entity, data):
    """
    Edit an post
    """

    # Create the base Event Model

    entity.slug = data['slug']
    entity.title = data['title']
    entity.slug = data['slug']
    entity.title = data['title']
    entity.summary = data['summary']
    entity.content = data['content']
    entity.published_date = data.get('published_date')
    entity.author_resource_id = data.get('author_resource_id')
    entity.put()

    # Step 2: Next update the search indexes incase anything affecting them has changed
    #event_search.maybe_up_update_search_index(entity)

    # Step 3: Kill All caches
    #ubercache.cache_invalidate('events')

    return entity
