import webapp2
from webapp2_extras.routes import RedirectRoute

import auth.controllers as auth_c

import logging

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


