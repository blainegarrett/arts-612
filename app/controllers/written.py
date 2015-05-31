"""
Controllers for the Written section
"""
import voluptuous
import json
from utils import ubercache

from rest.params import coerce_to_cursor
from controllers import BaseHandler
from utils import get_domain

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField
from rest.resource import ResourceUrlField, DatetimeField, BooleanField
from rest.resource import ResourceField

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

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)


class WrittenArticleHandler(BaseHandler):
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
        
        # Refactor this...
        results = []
        entities = BlogCategory.query().fetch(1000)
        for e in entities:
            results.append(Resource(e, CATEGORY_REST_RULES).to_dict())

        cursor = None
        more = None
        self.serve_success(results, {'cursor': cursor, 'more': more})

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


class ImportWPHandler(BaseHandler):
    total = 0
    author_map = {}
    category_map = {}
    author_totals = {}
    img_urls = []

    def process_post_content(self, content):
        import re
        content = content.replace(u'\xc2\xa0', ' ')
        
        image_urls = re.findall("(http://www.mplsart.com/written/wp-content/uploads/[^\"]*)\"", content, re.MULTILINE)
        if image_urls:
            self.img_urls.extend(image_urls)
            #self.img_urls.extend(image_urls.groups())
            #raise Exception(image_urls.groups())
            #self.response.write(image_urls)

        content = content.replace('http://www.mplsart.com/written/wp-content/uploads/', 'http://cdn.mplsart.com/written/wp-content/uploads/')
        content = content.replace('http://www.mplsart.com/blog/blog_pics/', 'http://cdn.mplsart.com/written/wp-content/uploads/blog_pics/')
        content = content.replace('http://mplsart.com/blog/blog_pics/', 'http://cdn.mplsart.com/written/wp-content/uploads/blog_pics/')
        content = content.replace('http://mplsart.com/images/', 'http://cdn.mplsart.com/written/wp-content/uploads/images/')
        content = content.replace('http://www.mplsart.com/images/', 'http://cdn.mplsart.com/written/wp-content/uploads/images/')

        content = content.replace('\n', '<br />')
        return u"<p>%s</p>" % content
        
    def migrate_post(self, post_data):
        import datetime
        
        # Filter out stuff we don't want to migrate...

        if post_data.get('post_type') not in ('post', 'page'):
            return
        
        if post_data.get('post_status') == 'draft':
            return
        
        # Skip posts by slug
        if post_data.get('post_name') in ('blaine-test-post', 'critics', '66', '43'):
            return

        post_password = post_data.get('post_password')
        comment_status = post_data.get('comment_status')
        post_excerpt = post_data.get('post_excerpt')
        post_content = post_data.get('post_content')
        post_modified_gmt = post_data.get('post_modified_gmt')
        post_date_gmt = post_data.get('post_date_gmt')
        post_category = post_data.get('post_category')
        post_parent = post_data.get('post_parent')
        post_author = post_data.get('post_author')
        post_date = post_data.get('post_date')
        to_ping = post_data.get('to_ping')
        post_status = post_data.get('post_status')
        post_title = post_data.get('post_title')
        post_modified = post_data.get('post_modified')
        guid = post_data.get('guid')
        post_name = post_data.get('post_name')
        ping_status = post_data.get('ping_status')
        post_mime_type = post_data.get('post_mime_type')
        ID = post_data.get('ID')
        menu_order = post_data.get('menu_order')
        pinged = post_data.get('pinged')
        post_type = post_data.get('post_type')
        post_content_filtered = post_data.get('post_content_filtered')
        comment_count = post_data.get('comment_count')

        
        self.response.write( post_type + ') - <a href="/written/2009/02/' +  post_name + '" target="_new">' + post_name + '</a> ... (cat: ' + post_category + ', parent: ' + post_parent + ') ' + post_author + '<br />')

        self.author_totals[str(post_author)] = int(self.author_totals.get(str(post_author), 0)) + 1
        self.total += 1

        # REST PAYLOAD

        category_resource_id = None

        if post_parent and not post_parent == u'0':
            if int(post_parent) == 175:
                category_resource_id = self.author_map['exhibition-reviews']
            else:
                category_resource_id = self.author_map['art-on-the-wall']
        else:
            category_resource_id = 'QmxvZ0NhdGVnb3J5Hh81NzYxNjczOTMxNTIyMDQ4' # Blog


        post_content = self.process_post_content(post_content)

        payload = {
            'slug': post_name,
            'title': post_title,
            'content': post_content,
            'summary': '',
            'published_date': datetime.datetime.strptime(post_date_gmt, '%Y-%m-%d %H:%M:%S'),
            'is_published': True,
            'author_resource_id': self.author_map.get(str(post_author)),
            'category_resource_id': category_resource_id
        }

        post = posts_api.create_post(payload)

    
    def get(self):
        
        # Step 1: Create Author records (this is for local use only - these exist on prod)
        from auth.api import create_user
        from rest.utils import get_key_from_resource_id

        author_data = [
            {'old_id': None, 'key': 'VXNlch4fNTE4NDU4MTg1ODc1NDU2MA', 'firstname': 'Katie',  'lastname': 'Garrett', 'website': 'http://mplsart.com'},
            {'old_id': None, 'key': 'VXNlch4fNTY3MDQwNTg3NjQ4MjA0OA', 'firstname': 'Blaine',  'lastname': 'Garrett', 'website': 'http://mplsart.com'},
            {'old_id': 2, 'key': 'VXNlch4fNTc2NzQwOTU5MTkxMDQwMA', 'firstname': 'Emma',  'lastname': 'Berg', 'website': 'http://mplsart.com'},
            {'old_id': 4, 'key': 'VXNlch4fNTY5NjQ1OTE0ODA5OTU4NA', 'firstname': 'Kristoffer',  'lastname': 'Knutson', 'website': 'http://mplsart.com'},
            {'old_id': 37, 'key': 'VXNlch4fNTc1OTgyNjI5MDI3ODQwMA', 'firstname': 'John',  'lastname': 'Megas', 'website': 'http://mplsart.com'},
            {'old_id': 38, 'key': 'VXNlch4fNTY5NjYwNTcxMzg1ODU2MA', 'firstname': 'Tristan',  'lastname': 'Pollock', 'website': 'http://mplsart.com'},
            {'old_id': 14, 'key': 'VXNlch4fNTc1MTM5OTgzMjg3OTEwNA', 'firstname': 'tiny',  'lastname': 'shoes', 'website': 'http://mplsart.com'},
            {'old_id': None, 'key': 'VXNlch4fNTcwMDg2NjA1Mjk4MDczNg', 'firstname': 'Melissa',  'lastname': 'Stang', 'website': 'http://mplsart.com'},
            {'old_id': None, 'key': 'VXNlch4fNTczMDQ1MDA1NjE1MTA0MA', 'firstname': 'Maddy',  'lastname': 'Huges', 'website': 'http://mplsart.com'},
        ]

        category_data = [
            {'old_ids': [12,10], 'key': 'QmxvZ0NhdGVnb3J5Hh81NjU4MDkxNjY4MzczNTA0', 'title': 'MPLSART', 'slug': 'mplsart'},
            {'old_ids': [], 'key': 'QmxvZ0NhdGVnb3J5Hh81NjczMzA5NTQyODA5NjAw', 'title': 'Art On The Wall', 'slug': 'art-on-the-wall'},
            {'old_ids': [3], 'key': 'QmxvZ0NhdGVnb3J5Hh81NzI4MTE2Mjc4Mjk2NTc2', 'title': 'Exhibition Reviews', 'slug': 'exhibition-reviews'},
            {'old_ids': [9, 11], 'key': 'QmxvZ0NhdGVnb3J5Hh81NzYxNjczOTMxNTIyMDQ4', 'title': 'Blog', 'slug': 'blog'},
            {'old_ids': [7,4, 10, 6, 8], 'key': 'QmxvZ0NhdGVnb3J5Hh81NzYzMjYzNjA2MjkyNDgw', 'title': 'The Scene', 'slug': 'scene'}
        ]

        # Populate Map and Construct Entities
        self.author_map['art-on-the-wall'] = 'QmxvZ0NhdGVnb3J5Hh81NjczMzA5NTQyODA5NjAw'
        self.author_map['exhibition-reviews'] = 'QmxvZ0NhdGVnb3J5Hh81NzI4MTE2Mjc4Mjk2NTc2'

        for user_data in author_data:
            old_id = user_data.pop('old_id')
            user_resource_id = user_data['key']
            user_data['key'] = get_key_from_resource_id(user_resource_id)
            create_user(user_data)
            
            if old_id:
                self.author_map[str(old_id)] = user_resource_id

        # Populate Map and Construct Entities
        for category_data in category_data:
            old_ids = category_data.pop('old_ids')
            category_resource_id = category_data['key']
            category_data['key'] = get_key_from_resource_id(category_resource_id)

            try:
                posts_api.create_post_category(category_data)
            except:
                pass

            if old_ids:
                for old_id in old_ids:
                    self.category_map[str(old_id)] = category_resource_id


        # Step 2: Dump existing migrated data

        posts = BlogPost.query().fetch(1000)
        for p in posts:
            p.key.delete()
        

        # Step 3: Read in new data
        import json
        data = open('./controllers/wp_posts.json', 'r').read()
        j_data = json.loads(data)
        
        for post_data in j_data:
            self.migrate_post(post_data)
        
        self.response.write(self.total)
        self.response.write(self.author_totals)
        self.response.write(self.img_urls)

