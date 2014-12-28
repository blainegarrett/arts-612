"""
Controllers for the Written section
"""

from controllers import BaseController


class HomeMainHandler(BaseController):
    """
    Homepage Handler
    """

    def get(self):
        pagemeta = {
            'title': 'mplsart.com | Returning Spring 2015',
            'description': 'The Very Best Events and Gallery Listings for Minneapolis and St. Paul',
            'image': 'http://mplsart.com/static/themes/v0/mplsart_fbimg.jpg'}

        template_values = {'pagemeta': pagemeta}
        self.render_template('./templates/index.html', template_values)
