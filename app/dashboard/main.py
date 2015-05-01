"""
Site Administrator Applicatation
"""

import os
import sys
import webapp2
from framework.controllers import MerkabahBaseController

# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../external'))


class MainAdminHandler(MerkabahBaseController):
    """
    Serve up the Chrome for the Admin React Application
    """

    def get(self):
        """
        Main Dashboard Handler
        """

        template_values = {}

        self.render_template('dashboard/app.html', template_values)


# Setup Routes for React Application
routes = [(r'.*', 'dashboard.main.MainAdminHandler')]

# Setup webapp2 application
app = webapp2.WSGIApplication(routes, debug=True)
