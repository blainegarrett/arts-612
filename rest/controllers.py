# Rest Controller Base

import webapp2
import json
import traceback

class RestHandlerBase(webapp2.RequestHandler):
    """
    Base Class for All Rest Endpoints
    """

    data = {} # Payload data

    def dispatch(self):
        """
        Dispatcher for checking various things
        """

        # Process Request data  
        if self.request.body:
            self.data  = json.loads(self.request.body)

        super(RestHandlerBase, self).dispatch()

    def put(self, *args, **kwargs):
        try:
            self._put(*args, **kwargs)
        except Exception, e:
            self.serve_error(e)

    def delete(self, *args, **kwargs):
        try:
            self._delete(*args, **kwargs)
        except Exception, e:
            self.serve_error(e)

    def post(self, *args, **kwargs):
        try:
            self._post(*args, **kwargs)
        except Exception, e:
            self.serve_error(e)

    def get(self, *args, **kwargs):
        try:
            self._get(*args, **kwargs)
        except Exception, e:
            self.serve_error(e)
        
    def serve_success(self, result):
        self.serve_response(200, result)

    def serve_404(self, msg='Page Not Found'):
        self.serve_response(404, [], msg)

    def serve_error(self, exception):
        # TODO: Pass in exception stack

        import sys
        exc_type, exc_value, exc_traceback = sys.exc_info()
        formatted_lines = traceback.format_exc().splitlines()

        self.serve_response(500, formatted_lines, str(exception))

    def serve_response(self, status, result, messages=None):
        """
        Serve the response
        """

        payload = {'status': status, 'results': result, 'messages': messages}
        
        #If in debug mode, include stack trace?
        self.response.set_status(status)
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(payload))