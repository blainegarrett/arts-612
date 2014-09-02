"""
Base Merkabah Controller
"""

import webapp2


class MerkabahBaseController(webapp2.RequestHandler):
    """
    """

    def render_template(self, template_path, template_context):
        """
        Render a Template to output
        """

        # TODO: This needs to abstract the jinja env out further...
        from main import JINJA_ENVIRONMENT

        template = JINJA_ENVIRONMENT.get_template(template_path)
        self.response.write(template.render(template_context))
