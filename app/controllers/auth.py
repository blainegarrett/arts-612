from rest.controllers import RestHandlerBase
from google.appengine.api import users

class AuthApiHandler(RestHandlerBase):
    """
    Serverside Controller logic for written auth checks
    """

    def get(self):
        """
        Written Main Page Web Handler
        """

        is_gae_authenticated = bool(users.get_current_user())
        resource = {'is_gae_authenticated': is_gae_authenticated}
        self.serve_success(resource)
