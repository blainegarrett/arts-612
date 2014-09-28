"""
Rest
"""

import webapp2
import json


def serve_response(response, status, result, messages=None):
    """
    Serve a response
    """

    payload = {'status': status, 'results': result, 'messages': messages}
    response.set_status(status)
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
    (r'/api/galleries/([a-z0-9-]+)', 'venues.controllers.GalleryDetailApiHandler'),
    (r'/api/galleries', 'venues.controllers.GalleriesApiHandler'),
])

app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404
