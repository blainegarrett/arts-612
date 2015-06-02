"""
Temporary Importer Routes
"""

import webapp2
import logging

import os, sys
# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../external'))

def handle_404(request, response, exception):
    logging.exception(exception)
    response.write('Oops! I could swear this page was here!')
    response.set_status(404)

routes = []
routes.extend([
    # Gallery Routes

    (r'/import/galleries', 'venues.import.GalleryData'),
    (r'/import/events', 'cal.import.EventData'),
    (r'/import/blog', 'controllers.written.ImportWPHandler'),
])

app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404

