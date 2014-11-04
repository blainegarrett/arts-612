import webapp2
from webapp2_extras.routes import RedirectRoute

import auth.controllers as auth_c

import logging

import os
import jinja2

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

routes = [
    RedirectRoute('/beta/', handler=auth_c.ProfileHandler, strict_slash=True, name="beta_index"),
    RedirectRoute('/beta/email/', handler=auth_c.SignupHandler, strict_slash=True, name="beta_signup"),
    RedirectRoute('/beta/activate/', handler=auth_c.ActivateHandler, strict_slash=True, name="beta_activate"),
    RedirectRoute('/beta/confirm/', handler=auth_c.ConfirmHandler, strict_slash=True, name="beta_confirm")
]

app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404


class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')


# Web Routes
# TODO: WE need to somehow inject these into the angular app

# WebGalleries
web_routes = []
rest_routes = []

web_routes += [
    (r'/galleries/([a-z0-9-]+)', 'venues.controllers.GalleryDetailHandler'),
    (r'/galleries', 'venues.controllers.GalleryMainHandler'),
    (r'/import/galleries', 'loaddata.GalleryData'),
    (r'/import/events', 'loaddata.EventData'),
    (r'/', 'main.MainHandler')  
]

# Rest Routes
routes = web_routes + rest_routes
app = webapp2.WSGIApplication(routes, debug=True)
