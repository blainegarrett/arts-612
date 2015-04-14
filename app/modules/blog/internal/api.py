from google.appengine.ext import ndb

from rest.utils import get_key_from_resource_id, get_resource_id_from_key
from modules.blog.internal.models import BlogPost



def bulk_dereference_posts(posts):
    """
    Bulk dereference author and image
    """

    author_map = {}

    for post in posts:
        setattr(post, 'author', None)
        setattr(post, 'primary_image', None)

        if post.author_resource_id:
           author_map[get_key_from_resource_id(post.author_resource_id)] = None

        if post.primary_image_resource_id:
            author_map[get_key_from_resource_id(post.primary_image_resource_id)] = None

    entities = ndb.get_multi(author_map.keys())

    for entity in entities:
        author_map[get_resource_id_from_key(entity.key)] = entity

    # Step 3: Iterate over posts
    for post in posts:
        if post.author_resource_id:
           e = author_map.get(post.author_resource_id, None)
           setattr(post, 'author', e)

        if post.primary_image_resource_id:
            e = author_map.get(post.primary_image_resource_id, None)
            setattr(post, 'primary_image', e)

    return posts


def get_posts():
    """
    Primary wrapper for fetching events
    """
    return BlogPost.query().order(-BlogPost.created_date).fetch(1000)


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