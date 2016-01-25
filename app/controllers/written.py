"""
Controllers for the Written section
"""
import voluptuous
import json
from utils import ubercache

from auth.decorators import rest_login_required
from rest.params import coerce_to_cursor
from controllers import BaseHandler
from utils import get_domain

from rest.utils import get_resource_id_from_key
from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField
from rest.resource import ResourceUrlField, DatetimeField, BooleanField
from rest.resource import ResourceField
from rest.params import coerce_to_datetime

from files.rest_helpers import REST_RESOURCE_RULES as FILE_REST_RULES
from auth.controllers import REST_RULES as USER_REST_RULES
from modules.blog.internal import api as posts_api
from modules.blog.internal.models import BlogPost, BlogCategory
from modules.blog.constants import AUTHOR_PROP, PRIMARY_IMAGE_PROP, CATEGORY_PROP

DEFAULT_POST_IMAGE = 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'


class WrittenMainHandler(BaseHandler):
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

        # TEMP: Get List of posts for serverside rendering
        entities, cursor, more = posts_api.get_posts(limit=25, cursor=None)
        posts_api.bulk_dereference_posts(entities)

        # Create A set of results based upon this result set - iterator??
        results = []
        for e in entities:
            results.append(Resource(e, REST_RULES).to_dict())


        template_values = {'pagemeta': pagemeta, 'entities': results}
        self.render_template('./templates/v0/bloglist.html', template_values)


class WrittenArticleBaseHandler(BaseHandler):
    """
    """

    def get_dereferenced_post(self, slug):
        """
        Helper method to get a
        """
        post = posts_api.get_post_by_slug(slug)
        if not post:
            return None

        posts_api.bulk_dereference_posts([post])
        return post

    def serve_up_article(self, post):
        """
        """

        # e is a 'resource' at this point, which is a dict
        e = create_resource_from_entity(post)

        # Page Meta
        image_url = None
        primary_image_resource = e.get('primary_image_resource')
        if primary_image_resource:
            image_url = primary_image_resource['versions']['CARD_SMALL']['url']

        pagemeta = {
            'title': e['title'],
            'description': e['summary'],
            'image': image_url
        }

        '''
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
        '''

        template_values = {'pagemeta': pagemeta, 'entity': e}
        self.render_template('./templates/v0/blogpost.html', template_values)


class WrittenCategoryArticleHandler(WrittenArticleBaseHandler):
    """
    Written Article Web Handler
    """

    def get(self, category_slug, slug):
        post = self.get_dereferenced_post(slug)
        if not post:
            return self.serve_404('Post Not Found')

        posts_api.bulk_dereference_posts([post])

        # Step 2: Redirection Logic if category slug doesn't match

        # Step 3: Serve Up Article
        self.serve_up_article(post)


class WrittenArticleHandler(WrittenArticleBaseHandler):
    """
    Written Article Web Handler
    """

    def get(self, year, month, slug):
        """
        Web handler for direct requests, search, facebook, etc
        """

        # Step 1: See if we have the post
        post = self.get_dereferenced_post(slug)
        if not post:
            return self.serve_404('Post Not Found')

        # Step 2: See if we have the correct context date bits
        # TODO: Redirection Logic ...

        # Step 3: Serve Up Article
        self.serve_up_article(post)


class WrittenMainRssFeedHandler(BaseHandler):
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
category_resource_url = 'http://' + get_domain() + '/api/post_categories/%s'


CATEGORY_REST_RULES = [
    ResourceIdField(output_only=True),
    ResourceUrlField(category_resource_url, output_only=True),
    SlugField(BlogCategory.slug, required=True),
    RestField(BlogCategory.title, required=True),
]


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
    RestField(BlogPost.category_resource_id, required=False),

    ResourceField(AUTHOR_PROP, required=False, output_only=True,
        resource_id_prop='author_resource_id', resource_rules=USER_REST_RULES),
    ResourceField(PRIMARY_IMAGE_PROP, required=False, output_only=True,
        resource_id_prop='primary_image_resource_id', resource_rules=FILE_REST_RULES),
    ResourceField(CATEGORY_PROP, required=False, output_only=True,
        resource_id_prop='category_resource_id', resource_rules=CATEGORY_REST_RULES),

]


def create_resource_from_entity(e, verbose=False):
    """
    Create a Rest Resource from a datastore entity
    TODO: We don't care about verbosity just yet
    """

    return Resource(e, REST_RULES).to_dict()

class PostCategoriesApiHandler(RestHandlerBase):
    """
    Post Categorie REST Handler
    """

    def get_rules(self):
        return CATEGORY_REST_RULES

    def get_param_schema(self):

        return {
            'limit': voluptuous.Coerce(int),
            'cursor': coerce_to_cursor,
            #'sort': voluptuous.Coerce(str),
            'get_by_slug': voluptuous.Coerce(str),
            #'is_published': voluptuous.Coerce(voluptuous.Boolean()),
            #'q': voluptuous.Coerce(str)
        }
    def _get(self):

        get_by_slug = self.cleaned_params.get('get_by_slug', None)

        if get_by_slug:
            category = posts_api.get_post_category_by_slug(get_by_slug)

            if not category:
                self.serve_404('Category given by slug %s Not Found' % get_by_slug)
                return
            else:
                self.serve_success(Resource(category, CATEGORY_REST_RULES).to_dict())
                return

        # Refactor this...
        results = []
        entities = BlogCategory.query().fetch(1000)
        for e in entities:
            results.append(Resource(e, CATEGORY_REST_RULES).to_dict())

        cursor = None
        more = None
        self.serve_success(results, {'cursor': cursor, 'more': more})

    @rest_login_required
    def _post(self):
        """
        Create a Post
        """

        category = posts_api.create_post_category(self.cleaned_data)
        self.serve_success(Resource(category, CATEGORY_REST_RULES).to_dict())


class PostCategoryDetailApiHandler(RestHandlerBase):

    def _get(self, resource_id):
        post = posts_api.get_post_category_by_resource_id(resource_id)
        self.serve_success(Resource(post, CATEGORY_REST_RULES).to_dict())

    @rest_login_required
    def _put(self, resource_id):
        e = posts_api.get_post_category_by_resource_id(resource_id)
        e = posts_api.edit_category(e, self.cleaned_data)

        self.serve_success(Resource(e, CATEGORY_REST_RULES).to_dict())

    def get_rules(self):
        return CATEGORY_REST_RULES


class PostsApiHandler(RestHandlerBase):
    """
    Blog Posts Collection REST Endpoint
    """

    def get_param_schema(self):

        return {
            u'limit': voluptuous.Coerce(int),
            u'cursor': coerce_to_cursor,
            # 'sort': voluptuous.Coerce(str),
            u'category_slug': voluptuous.Coerce(unicode),
            u'get_by_slug': voluptuous.Coerce(unicode),
            u'is_published': voluptuous.Coerce(voluptuous.Boolean()),
            u'start_date': coerce_to_datetime
            # 'q': voluptuous.Coerce(str)
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
        start_date = self.cleaned_params.get('start_date', None)
        category_slug = self.cleaned_params.get('category_slug', None)

        optional_params = {}

        if 'is_published' in self.params:
            optional_params['is_published'] = self.cleaned_params['is_published']

        if start_date:
            optional_params['start_date'] = start_date

        category_resource_id_filter = None
        if category_slug:
            category = posts_api.get_post_category_by_slug(category_slug)

            if not category:
                self.serve_404('Category with slug %s Not Found' % category_slug)
                return

            optional_params['category_resource_id'] = get_resource_id_from_key(category.key)

        # TODO: If you are not admin, default is_published to True...

        key_stamp = str(hash(json.dumps(self.params)))
        cache_key = 'written_resources_%s' % key_stamp

        cached_result = ubercache.cache_get(cache_key)
        if False and cached_result:
            results, cursor, more = cached_result
        else:
            # Posts were not Cached for this set of properties

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

    @rest_login_required
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

    @rest_login_required
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
