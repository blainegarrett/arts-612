import webapp2
from webapp2_extras.routes import RedirectRoute

import auth.controllers as auth_c

import logging
import jinja2
import os
import sys

# Add the external libs
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'external'))

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    variable_start_string='{[{',
    variable_end_string='}]}',
    autoescape=True)


def handle_404(request, response, exception):
    logging.exception(exception)
    response.write('Oops! I could swear this page was here!')
    response.set_status(404)


# Beta Routes
routes = [
    RedirectRoute('/logout/', handler=auth_c.LogoutHandler, strict_slash=True, name="auth_logout"),
    RedirectRoute('/beta/', handler=auth_c.ProfileHandler, strict_slash=True, name="beta_index"),
    RedirectRoute('/beta/email/', handler=auth_c.SignupHandler,
        strict_slash=True, name="beta_signup"),
    RedirectRoute('/beta/activate/', handler=auth_c.ActivateHandler, strict_slash=True,
        name="beta_activate"),
    RedirectRoute('/beta/confirm/', handler=auth_c.ConfirmHandler, strict_slash=True,
        name="beta_confirm")]


# Web Routes
# TODO: WE need to somehow inject these into the angular app

# WebGalleries
web_routes = routes
rest_routes = []


'''
TODO: Design for web routes - put in jsonfile that is mounted in client too...
name = {url, server_view, react_view }
'''

web_routes += [

    RedirectRoute('/about/', 'controllers.AboutMainHandler', strict_slash=True, name="about"),

    (r'/galleries/([a-z0-9-]+)', 'venues.controllers.GalleryDetailHandler'),
    (r'/galleries', 'venues.controllers.GalleryMainHandler'),

    (r'/calendar/([a-z0-9-]+)', 'cal.controllers.CalendarDetailHandler'),
    (r'/calendar', 'cal.controllers.CalendarMainHandler'),

    RedirectRoute('/written/', 'controllers.written.WrittenMainHandler', strict_slash=True, name="written"),
    RedirectRoute('/written/feed/', 'controllers.written.WrittenMainRssFeedHandler', strict_slash=True, name="written_rss_main"),
    RedirectRoute(r'/written/<year:[\d]+>/<month:[\d]+>/<slug:[a-z0-9-_]+>/', 'controllers.written.WrittenArticleHandler', strict_slash=True, name="written_article"),

    RedirectRoute('/home/', 'controllers.HomePageHandler', strict_slash=True, name="homepage"),
    (r'/', 'auth.controllers.MainHandler'),
    (r'.*', 'controllers.Error404Handler'),
    ]

# Rest Routes
routes = web_routes + rest_routes
app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404
