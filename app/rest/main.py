"""
Rest
"""

import os
import sys
# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../external'))

import webapp2
import json


def serve_response(response, status, result, messages=None):
    """
    Serve a response
    """

    payload = {'status': status, 'results': result, 'messages': messages}
    response.set_status(status)
    response.headers['content-type'] = 'application/json'
    response.write(json.dumps(payload))


def handle_404(request, response, exception):
    """
    Top Level Route handler for 404
    """

    err = 'Rest endpoint not found or unavailable'

    serve_response(response, 404, None, messages=[err])

routes = []
routes.extend([

    # Gallery Routes
    (r'/api/galleries/([a-zA-Z0-9-_]+)', 'venues.controllers.GalleryDetailApiHandler'),
    (r'/api/galleries', 'venues.controllers.GalleriesApiHandler'),

    # Event Routes
    (r'/api/events', 'cal.controllers.EventsApiHandler'),
    (r'/api/events/upcoming', 'cal.controllers.EventsUpcomingHandler'),
    (r'/api/events/nowshowing', 'cal.controllers.EventsNowShowingHandler'),
    (r'/api/events/([a-zA-Z0-9-_]+)', 'cal.controllers.EventDetailApiHandler'),

    # File Service Routes
    (r'/api/files/upload_url', 'files.controllers.UploadUrlHandler'),
    (r'/api/files/upload_callback', 'files.controllers.UploadCallbackHandler'),
])


app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404
