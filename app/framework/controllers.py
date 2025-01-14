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

    def render_template(self, template_path, template_context, to_string=False):
        """
        Render a Template to output
        """
        from modules.events.internal import api as events_api

        # Debug - Show what non-js search engines see
        template_context['no_client'] = bool(self.request.get('no_client', False))

        # TODO: This needs to abstract the jinja env out further...
        from main import JINJA_ENVIRONMENT

        template_context['settings_dict'] = {}
        template_context['settings_dict']['is_appspot'] = is_appspot()
        template_context['settings_dict']['domain'] = get_domain()

        # Tack on the google analytics profiles
        if is_appspot():  # TODO: Remove this before being prod ready
            template_context['settings_dict']['ga_profile_id'] = 'UA-54271335-1'
        else:
            template_context['settings_dict']['ga_profile_id'] = 'UA-54271335-2'

        # Temporary Serverside rendering handler - this should be done via jina extensions likely
        template_context['upcoming_event_resources'] = events_api.get_upcoming_event_resources()
        template_context['ongoing_event_resources'] = events_api.get_ongoing_event_resources()

        # TODO: This should come from some sort of middleware likely
        template_context['settings_dict']['is_authenticated'] = bool(users.get_current_user())

        template_context['settings'] = json.dumps(template_context['settings_dict'])

        template = JINJA_ENVIRONMENT.get_template(template_path)

        rendered_content = template.render(template_context)

        if to_string:
            return rendered_content

        self.response.write(rendered_content)

    def serve_404(self, message):
        pagemeta = {
            'title': 'Page Not Found',
            'description': 'Unable to find page, please check your url',
            'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.response.set_status(404)
        self.render_template('./templates/index.html', template_values)
