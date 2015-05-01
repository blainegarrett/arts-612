"""
Base Merkabah Controller
"""

import json
import webapp2
from utils import is_appspot, get_domain

from google.appengine.api import users


#MerkabahBaseController

class BaseHandler(webapp2.RequestHandler):
    """
    Base Handler for Non-api calls
    """

    def render_template(self, template_path, template_context):
        """
        Render a Template to output
        """

        # Debug - Show what non-js search engines see
        template_context['no_client'] = bool(self.request.get('no_client', False))

        # TODO: This needs to abstract the jinja env out further...
        from main import JINJA_ENVIRONMENT

        template_context['settings'] = {}
        template_context['settings']['is_appspot'] = is_appspot()
        template_context['settings']['domain'] = get_domain()

        # TODO: This should come from some sort of middleware likely
        template_context['settings']['is_authenticated'] = bool(users.get_current_user())

        template_context['settings'] = json.dumps(template_context['settings'])

        template = JINJA_ENVIRONMENT.get_template(template_path)
        self.response.write(template.render(template_context))

    def serve_404(self, message):
        pagemeta = {
            'title': 'Page Not Found',
            'description': 'Unable to find page, please check your url',
            'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.response.set_status(404)
        self.render_template('./templates/index.html', template_values)
