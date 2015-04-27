"""
Controllers for the Written section
"""
import voluptuous
import json
from utils import ubercache

from rest.params import coerce_to_cursor
from controllers import BaseController
from utils import get_domain

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField
from rest.resource import ResourceUrlField, DatetimeField, BooleanField
from rest.resource import ResourceField

from files.rest_helpers import REST_RESOURCE_RULES as FILE_REST_RULES
from auth.controllers import REST_RULES as USER_REST_RULES
from modules.blog.internal import api as posts_api
from modules.blog.internal.models import BlogPost
from modules.blog.constants import AUTHOR_PROP, PRIMARY_IMAGE_PROP

DEFAULT_POST_IMAGE = 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'


class WrittenMainHandler(BaseController):
    """
    Serverside Controller logic for written section main page
    """

    def get(self):
        """
        Written Main Page Web Handler
        """

        pagemeta = {
            'title': 'Written',
            'description': 'Writing and Critique',
            'image': DEFAULT_POST_IMAGE
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)


class WrittenArticleHandler(BaseController):
    """
    Written Article Web Handler
    """

    def get(self, year, month, slug):
        """
        Web handler for direct requests, search, facebook, etc
        """

        # Step 1: See if we have the post
        post = posts_api.get_post_by_slug(slug)
        if not post:
            return self.serve_404('Post Not Found')

        # Step 2: See if we have the correct context date bits
        # TODO: Redirection Logic ...


        # Step 3: Setup Meta
        posts_api.bulk_dereference_posts([post])

        # TODO: Author meta tag

        # Resolve Post for Image
        image_url = DEFAULT_POST_IMAGE
        post_image = getattr(post, PRIMARY_IMAGE_PROP, None)
        if post_image:
            if post_image.versions.get('CARD_SMALL', None):
                image_url = post_image.versions['CARD_SMALL']['url']

        pagemeta = {
            'title': post.title,
            'description': post.summary,
            'image': image_url
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)


class WrittenMainRssFeedHandler(BaseController):
    """
    Temporary Feed Handler
    TODO: Atom feeds
    TODO: Better feed image
    """

    def get(self):
        """
        Generate an RSS feed with the lastest blog posts
        TODO: Caching
        """

        # Check if cached
        cache_key = 'written_rss_main'
        rss_content = ubercache.cache_get(cache_key)
        if rss_content:
            self.response.headers['Content-Type'] = 'application/xml'
            self.response.write(rss_content)
            return

        # Not cached, so render and store it

        ctx = {'posts': []}

        entities, cursor, more = posts_api.get_posts(limit=25, is_published=True)
        posts_api.bulk_dereference_posts(entities)

        # Create A set of results based upon this result set - iterator??
        ctx['posts'] = entities

        rss_content = self.render_template('./templates/newsfeeds/rss.html', ctx, to_string=True)

        # Set Cache
        ubercache.cache_set(cache_key, rss_content, category='written')

        self.response.headers['Content-Type'] = 'application/xml'
        self.response.write(rss_content)
        return


# Rest Controllers
resource_url = 'http://' + get_domain() + '/api/posts/%s'

REST_RULES = [
    ResourceIdField(output_only=True),
    ResourceUrlField(resource_url, output_only=True),
    SlugField(BlogPost.slug, required=True),
    RestField(BlogPost.title, required=True),
    RestField(BlogPost.permalink, output_only=True),

    RestField(BlogPost.content),
    RestField(BlogPost.summary),

    DatetimeField(BlogPost.created_date, output_only=True),
    DatetimeField(BlogPost.modified_date, output_only=True),
    DatetimeField(BlogPost.published_date, required=False),
    BooleanField(BlogPost.is_published),

    RestField(BlogPost.primary_image_resource_id, required=False),
    RestField(BlogPost.author_resource_id, required=False),

    ResourceField(AUTHOR_PROP, required=False, output_only=True,
        resource_id_prop='author_resource_id', resource_rules=USER_REST_RULES),
    ResourceField(PRIMARY_IMAGE_PROP, required=False, output_only=True,
        resource_id_prop='primary_image_resource_id', resource_rules=FILE_REST_RULES),
]


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    return Resource(e, REST_RULES).to_dict()


class PostsApiHandler(RestHandlerBase):
    """
    Blog Posts Collection REST Endpoint
    """

    def get_param_schema(self):
        
        #raise Exception(voluptuous.Coerce(voluptuous.Boolean())('true'))
        
        return {
            'limit': voluptuous.Coerce(int),
            'cursor': coerce_to_cursor,
            #'sort': voluptuous.Coerce(str),
            'get_by_slug': voluptuous.Coerce(str),
            'is_published': voluptuous.Coerce(voluptuous.Boolean()),
            #'q': voluptuous.Coerce(str)
        }

    def get_rules(self):
        return REST_RULES

    def _get_by_slug_or_404(self, slug):
        """
        Given a slug, attempt to return slug resource or issue a 404
        """

        post = posts_api.get_post_by_slug(slug)

        if not post:
            self.serve_404('Resource given by slug %s Not Found' % slug)
            return

        # Found Post: Serve it up
        self.serve_success(Resource(post, REST_RULES).to_dict())
        return

    def _get(self):
        """
        Get a collection of Written Posts
        """

        # Check if we want to get a post by its slug
        get_by_slug = self.cleaned_params.get('get_by_slug', None)

        if get_by_slug:
            return self._get_by_slug_or_404(get_by_slug)

        # Get a list of all posts

        limit = self.cleaned_params.get('limit', None)
        cursor = self.cleaned_params.get('cursor', None)
        
        optional_params = {}

        if 'is_published' in self.params:
            optional_params['is_published'] = self.cleaned_params['is_published']

        # TODO: If you are not admin, default is_published to True...

        key_stamp = str(hash(json.dumps(self.params)))
        cache_key = 'written_resources_%s' % key_stamp

        cached_result = ubercache.cache_get(cache_key)
        if False and cached_result:
            results, cursor, more = cached_result
        else:
            # Posts were not not Cached for this set of properties

            entities, cursor, more = posts_api.get_posts(limit=limit, cursor=cursor, **optional_params)
            posts_api.bulk_dereference_posts(entities)

            # Create A set of results based upon this result set - iterator??
            results = []
            for e in entities:
                results.append(Resource(e, REST_RULES).to_dict())

            if cursor:
                cursor = cursor.urlsafe()

            # Store In Cache
            ubercache.cache_set(cache_key, (results, cursor, more), category='written')

        self.serve_success(results, {'cursor': cursor, 'more': more})

    def _post(self):
        """
        Create a Post
        """

        post = posts_api.create_post(self.cleaned_data)
        self.serve_success(Resource(post, REST_RULES).to_dict())


class PostDetailApiHandler(RestHandlerBase):
    """
    Blog Post Resource Endpoint
    """

    def get_rules(self):
        return REST_RULES

    def _get(self, resource_id):
        """
        Get a post by resource id
        Note: To get a post by slug id, hit collection endpoint (/?get_by_slug=slug)
        """

        post = posts_api.get_post_by_resource_id(resource_id)
        self.serve_success(Resource(post, REST_RULES).to_dict())

    def _put(self, resource_id):
        """
        Edit a Post given by resource_id
        """

        # First retrieve the post to edit
        post = posts_api.get_post_by_resource_id(resource_id)
        if not post:
            return self.serve_404('Resource given by resource id %s Not Found' % resource_id)

        post = posts_api.edit_post(post, self.cleaned_data)

        self.serve_success(Resource(post, REST_RULES).to_dict())
