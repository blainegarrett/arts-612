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
    (r'/api/auth/status', 'auth.controllers.StatusHandler'),
    (r'/api/auth/authenticate', 'auth.controllers.AuthenticateHandler'),
    (r'/api/auth/deauthenticate', 'auth.controllers.DeauthenticateHandler'),
    (r'/api/auth/secure', 'auth.controllers.SomeSecureHandler'),

    # Gallery Routes
    (r'/derp', 'venues.controllers.AuthHandler'),
    (r'/api/galleries/([a-zA-Z0-9-_]+)', 'venues.controllers.GalleryDetailApiHandler'),
    (r'/api/galleries', 'venues.controllers.GalleriesApiHandler'),

    # Event Routes
    (r'/api/events', 'cal.controllers.EventsApiHandler'),
    (r'/api/events/upcoming', 'cal.controllers.EventsUpcomingHandler'),
    (r'/api/events/nowshowing', 'cal.controllers.EventsNowShowingHandler'),
    (r'/api/events/([a-zA-Z0-9-_]+)', 'cal.controllers.EventDetailApiHandler'),

    # Posts Routes
    (r'/api/posts', 'controllers.written.PostsApiHandler'),
    (r'/api/posts/([a-zA-Z0-9-_]+)', 'controllers.written.PostDetailApiHandler'),

    # Blog Categories
    (r'/api/post_categories', 'controllers.written.PostCategoriesApiHandler'),
    (r'/api/post_categories/([a-zA-Z0-9-_]+)', 'controllers.written.PostCategoryDetailApiHandler'),

    # Homepage Waterfall
    (r'/api/featured', 'controllers.feed.FeaturedApiHandler'),
    (r'/api/feed', 'controllers.feed.HomeApiHandler'),

    # File Service Routes
    (r'/api/files', 'files.controllers.ListResourceHandler'),
    (r'/api/files/upload_url', 'files.controllers.UploadUrlHandler'),
    (r'/api/files/upload_callback', 'files.controllers.UploadCallbackHandler'),
    (r'/api/files/([a-zA-Z0-9-_]+)', 'files.controllers.FileDetailHandler'),

    # Private
    (r'/api/users', 'auth.controllers.UsersApiHandler'),
    (r'/api/users/([a-zA-Z0-9-_]+)', 'auth.controllers.UserDetailApiHandler'),

])


app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404
