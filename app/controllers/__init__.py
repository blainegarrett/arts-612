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
    
    def serve_404(self, message):
        pagemeta = {
            'title': 'Page Not Found',
            'description': 'Unable to find page, please check your url',
            'image': 'http://phase-0.arts-612.appspot.com/static/themes/v0/mplsart_fbimg.jpg'}

        template_values = {'pagemeta': pagemeta}
        self.response.set_status(404)
        self.render_template('./templates/index.html', template_values)


class Error404Handler(BaseController):
    """
    """
    
    def get(self, *args, **kwargs):
        self.serve_404('Page Not Found')
        return


class AboutMainHandler(BaseController):
    """
    About Web Handler
    """
    
    def get(self, *args, **kwargs):
        pagemeta = {
            'title': 'About MPLSART.COM',
            'description': 'MPLSART.COM\'s mission is to promote visual art events in the Twin Cities.',
            'image': 'http://phase-0.arts-612.appspot.com/static/themes/v0/mplsart_fbimg.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)
