import webapp2

class BaseController(webapp2.RequestHandler):
    """
    Base Helper Class that renders the chrome and inputs page meta for non-JS renderers (FB, etc)
    """

    def render_template(self, template_path, template_context):
        """
        Render a Template to output
        """

        # Debug - Show what non-js search engines see
        template_context['no_client'] = bool(self.request.get('no_client', False))        

        # TODO: This needs to abstract the jinja env out further...
        from main import JINJA_ENVIRONMENT as default_jinja_env

        template = default_jinja_env.get_template(template_path)
        self.response.write(template.render(template_context))