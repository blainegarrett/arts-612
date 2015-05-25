"""
Site Administrator Applicatation
"""

import os
import sys
import webapp2
from framework.controllers import BaseHandler

# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../external'))


class MainAdminHandler(BaseHandler):
    """
    Serve up the Chrome for the Admin React Application
    """

    def get(self):
        """
        Main Dashboard Handler
        """

        template_values = {}

        self.render_template('dash/app.html', template_values)


# Setup Routes for React Application
routes = [(r'.*', 'dash.main.MainAdminHandler')]

# Setup webapp2 application
app = webapp2.WSGIApplication(routes, debug=True)
