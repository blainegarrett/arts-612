"""
Controllers for the Written section
"""
import voluptuous

from controllers import BaseController

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField, DatetimeField
from rest.utils import get_key_from_resource_id

from files.rest_helpers import FileField

from modules.blog.internal import api as blog_api
from modules.blog.internal.models import BlogPost

from utils import get_domain


class WrittenMainHandler(BaseController):
    """
    Serverside Controller logic for written section
    """

    def get(self):
        pagemeta = {
            'title': 'Written',
            'description': 'Crtique, Reviews, and Observations of the Minneapolis / St. Paul Arts Scene',
            'image': 'http://phase-0.arts-612.appspot.com/static/themes/v0/mplsart_fbimg.jpg'}

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)


class WrittenArticleHandler(BaseController):
    """
    """

    def get(self, year, month, slug):
        pagemeta = {
            'title': 'A message from mplsart.com founder, Emma Berg',
            'description': 'It is with great pleasure that we introduce you to the new owners of mplsart.com',
            'image': 'http://cdn.mplsart.com/written/temp/mplsart_fbimg_foursome.jpg'}

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)



class WrittenMainRssFeedHandler(BaseController):
    """
    Temporary Feed Handler
    TODO: Atom feeds
    TODO: Dynamically Generate this data
    TODO: Add images for posts?
    TODO: Better feed image
    """

    def get(self):
        output = """<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        	<channel>
        		<title>Written Articles on mplsart.com</title>
        		<description>Articles from mplsart.com</description>
        		<link>http://mplsart.com</link>
        		<lastBuildDate>Sun, 11 Dec 2015 15:00:00 CST</lastBuildDate>
        		<pubDate>Sun, 11 Dec 2015 15:00:00 CST</pubDate>
                <language>en</language>
        		<ttl>1800</ttl>
                <image>
                    <url>http://mplsart.com/favicon.ico</url>
                    <title>mplsart.com</title>
                    <link>mplsart.com</link>
                  </image>

        		<item>
        			<title>A message from mplsart.com founder, Emma Berg</title>
        			<link>http://mplsart.com/written/2015/01/new_beginnings_for_mplsart/</link>
        			<guid isPermaLink="false">http://mplsart.com/written/2015/01/new_beginnings_for_mplsart/</guid>
        			<pubDate>Mon, 05 Dec 2015 15:00:00 CST</pubDate>
        			<description><![CDATA[ It is with great pleasure that we introduce you to the new owners of mplsart.com ]]></description>
        			<summary>It is with great pleasure that we introduce you to the new owners of mplsart.com</summary>
        			<updated>Mon, 05 Dec 2015 15:00:00 CST</updated>
        			<published>Mon, 05 Dec 2015 15:00:00 CST</published>
        			<author>
        				<name>Emma Berg</name>
        				<email>calendar@mplsart.com</email>
        				<uri>http://www.emmaberg.com/</uri>
        			</author>
                    <enclosure url="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" length="1010" type="image/png"/>
                    <link rel="enclosure" href="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" length="1010" type="image/png"/>
                    <!-- <media:content url="http://cdn.mplsart.com/written/temp/hmpg_emmakris.png" length="1010" type="image/jpeg" height="150" width="150"/> -->
        		</item>
        	</channel>
        </rss>"""
        
        self.response.headers['Content-Type'] = 'application/xml'
        self.response.write(output)







# Rest Controllers

resource_url = 'http://' + get_domain()  + '/api/posts/%s'

REST_RULES = [
    ResourceIdField(output_only=True),
    ResourceUrlField(resource_url, output_only=True),
    SlugField(BlogPost.slug, required=True),
    RestField(BlogPost.title, required=True),

    RestField(BlogPost.content),
    RestField(BlogPost.summary),

    DatetimeField(BlogPost.created_date, output_only=True),
    DatetimeField(BlogPost.modified_date, output_only=True),
    DatetimeField(BlogPost.published_date, output_only=True),

    RestField(BlogPost.primary_image_resource_id, required=False),
    FileField('primary_image_resource', required=False, output_only=True, resource_id_prop='primary_image_resource_id'),
]





class PostsApiHandler(RestHandlerBase):
    """
    Blog Posts Collection REST Endpoint
    """

    def get_param_schema(self):
        return {
            #'limit' : voluptuous.Coerce(int),
            #'cursor': coerce_to_cursor,
            #'sort': voluptuous.Coerce(str),
            'get_by_slug': voluptuous.Coerce(str),
            #'q': voluptuous.Coerce(str)
        }

    def get_rules(self):
        return REST_RULES

    def _get(self):
        """
        Get a list of Blog Posts
        """

        # Check if there is a query filter, etc
        get_by_slug = self.cleaned_params.get('get_by_slug', None)

        if get_by_slug:
            post = blog_api.get_post_by_slug(get_by_slug)
            if not post:
                self.serve_404('Post Not Found')
                return False

            self.serve_success(Resource(post, REST_RULES).to_dict())
            return




        entities = blog_api.get_posts()

        # Create A set of results based upon this result set - iterator??
        results = []
        for e in entities:
            results.append(Resource(e, REST_RULES).to_dict())

        self.serve_success(results)
    
    def _post(self):
        """
        Create a Post
        """

        e = blog_api.create_post(self.cleaned_data)
        self.serve_success(Resource(e, REST_RULES).to_dict())
        
    
class PostDetailApiHandler(RestHandlerBase):
    """
    Blog Post Resource Endpoint
    """
    
    def get_rules(self):
        return REST_RULES


    def _get(self, resource_id):
        key = get_key_from_resource_id(resource_id)
        e = key.get()
        self.serve_success(Resource(e, REST_RULES).to_dict())

    
    def _put(self, resource_id):
        """
        Edit a Post
        """

        key = get_key_from_resource_id(resource_id)
        e = key.get()

        e = blog_api.edit_post(e, self.cleaned_data)

        self.serve_success(Resource(e, REST_RULES).to_dict())

