import webapp2
from webapp2_extras.routes import RedirectRoute

import auth.controllers as auth_c

import logging

import os, sys
import jinja2

from framework.controllers import MerkabahBaseController

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

routes = [
    RedirectRoute('/beta/', handler=auth_c.ProfileHandler, strict_slash=True, name="beta_index"),
    RedirectRoute('/beta/email/', handler=auth_c.SignupHandler, strict_slash=True, name="beta_signup"),
    RedirectRoute('/beta/activate/', handler=auth_c.ActivateHandler, strict_slash=True, name="beta_activate"),
    RedirectRoute('/beta/confirm/', handler=auth_c.ConfirmHandler, strict_slash=True, name="beta_confirm")
]

app = webapp2.WSGIApplication(routes, debug=True)
app.error_handlers[404] = handle_404



class MainHandler(MerkabahBaseController):
    """
    Main Handler For Gallery Listings
    """
    def get(self):
        pagemeta = {'title': 'MainHandler Title', 'description': 'A Directory of Galleries and Places that Show Art in Minneapolis', 'image': 'http://www.soapfactory.org/img/space/gallery-one-2.jpg'}
        template_values = {'pagemeta': pagemeta}
        self.render_template('templates/index.html', template_values)



# Web Routes
# TODO: WE need to somehow inject these into the angular app

# WebGalleries
web_routes = []
rest_routes = []

web_routes += [
    (r'/galleries/([a-z0-9-]+)', 'venues.controllers.GalleryDetailHandler'),
    (r'/galleries', 'venues.controllers.GalleryMainHandler'),

    (r'/calendar/([a-z0-9-]+)', 'cal.controllers.CalendarDetailHandler'),
    (r'/calendar', 'cal.controllers.CalendarMainHandler'),

    #(r'/import/galleries', 'loaddata.GalleryData'), # These are handled in app.yaml
    #(r'/import/events', 'loaddata.EventData'), # These are handled in app.yaml
    (r'/', 'main.MainHandler')
]

# Rest Routes
routes = web_routes + rest_routes
app = webapp2.WSGIApplication(routes, debug=True)
