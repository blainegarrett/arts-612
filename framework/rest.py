"""
Rest Pieces
"""
import json
import traceback
import webapp2

class RestHandlerBase(webapp2.RequestHandler):
    """
    Base Class for All Rest Endpoints
    """
    
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
        self.response.write(json.dumps(payload))
