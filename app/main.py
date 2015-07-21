import webapp2
from webapp2_extras.routes import RedirectRoute

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

# Web Routes
# TODO: WE need to somehow inject these into the react app

# WebGalleries
web_routes = []
rest_routes = []


"""
TODO: Design for web routes - put in jsonfile that is mounted in client too...
name = {url, server_view, react_view }
"""

web_routes += [

    RedirectRoute('/about/',
                  'controllers.AboutMainHandler',
                  strict_slash=True,
                  name="about"),


    RedirectRoute(r'/galleries/<slug:[a-z0-9-_]+>/',
                  'venues.controllers.GalleryDetailHandler',
                  strict_slash=True,
                  name="view_permalink"),

    RedirectRoute(r'/galleries/',
                  'venues.controllers.GalleryMainHandler',
                  strict_slash=True,
                  name="venues_main"),

    # (r'/events/([a-z0-9-]+)', 'cal.controllers.CalendarDetailHandler'),
    RedirectRoute(r'/events/<slug:[a-z0-9-_]+>/',
                  'cal.controllers.CalendarDetailHandler',
                  strict_slash=True,
                  name="event_permalink"),

    # (r'/calendar', 'cal.controllers.CalendarMainHandler'),

    RedirectRoute('/written/',
                  'controllers.written.WrittenMainHandler',
                  strict_slash=True,
                  name="written"),
    RedirectRoute('/written/feed/',
                  'controllers.written.WrittenMainRssFeedHandler',
                  strict_slash=True,
                  name="written_rss_main"),

    RedirectRoute(r'/written/<category_slug:[a-z0-9-_]+>/<slug:[a-z0-9-_]+>/',
                  'controllers.written.WrittenCategoryArticleHandler',
                  strict_slash=True,
                  name="written_article_category"),

    RedirectRoute(r'/written/<year:[\d]+>/<month:[\d]+>/<slug:[a-z0-9-_]+>/',
                  'controllers.written.WrittenArticleHandler',
                  strict_slash=True,
                  name="written_article"),

    (r'/', 'controllers.MainHandler'),
    (r'.*', 'controllers.Error404Handler'),
    ]

# Rest Routes
routes = web_routes + rest_routes
app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404
