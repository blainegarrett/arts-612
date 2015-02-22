"""
Base Merkabah Controller
"""

import json
import webapp2
from utils import is_appspot, get_domain


class MerkabahBaseController(webapp2.RequestHandler):
    """
    """

    def render_template(self, template_path, template_context):
        """
        Render a Template to output
        """

        # TODO: This needs to abstract the jinja env out further...
        from main import JINJA_ENVIRONMENT

        template_context['settings'] = {}
        template_context['settings']['is_appspot'] = is_appspot()
        template_context['settings']['domain'] = get_domain()

        template_context['settings'] = json.dumps(template_context['settings'])

        template = JINJA_ENVIRONMENT.get_template(template_path)
        self.response.write(template.render(template_context))
