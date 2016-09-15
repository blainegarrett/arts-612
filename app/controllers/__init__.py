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

        from modules.events.internal import api as events_api
        results = events_api.get_upcoming_event_resources()

        template_values = {'pagemeta': pagemeta, 'entities': results}
        self.render_template('./templates/v0/homepage.html', template_values)
