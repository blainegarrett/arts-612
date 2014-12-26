"""
Controllers for the Written section
"""

from controllers import BaseController


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
