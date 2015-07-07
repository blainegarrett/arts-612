import webapp2
from framework.controllers import BaseHandler


class Error404Handler(BaseHandler):
    """
    """

    def get(self, *args, **kwargs):
        self.serve_404('Page Not Found')
        return


class MainHandler(BaseHandler):
    """
    Main Page Handler
    """

    def get(self):
        
        pagemeta = {
            'title': 'MPLSART.COM | Make a Scene',
            'description': 'Find the best art events in Minneapolis and St. Paul',
            'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)

class AboutMainHandler(BaseHandler):
    """
    About Web Handler
    """

    def get(self, *args, **kwargs):
        pagemeta = {
            'title': 'About MPLSART.COM',
            'description': 'MPLSART.COM\'s mission is to promote visual art events in the Twin Cities.',
            'image': 'http://cdn.mplsart.com/assets/social/mplsart_fbimg3.jpg'
        }

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)
