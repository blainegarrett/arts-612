# Rest Controller Base

import webapp2
import json
import traceback
import sys
import logging

from rest import errors


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
            self.data = json.loads(self.request.body)

        try:
            super(RestHandlerBase, self).dispatch()
        except errors.MethodNotAllowed, e:
            self.serve_error(e, status=405)
        except Exception, e:
            self.serve_error(e)

    def put(self, *args, **kwargs):
        """
        """

        if not hasattr(self, '_put'):
            raise errors.MethodNotAllowed('Method Not Allowed.')
        self._put(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        """

        if not hasattr(self, '_delete'):
            raise errors.MethodNotAllowed('Method Not Allowed.')
        self._delete(*args, **kwargs)

    def post(self, *args, **kwargs):
        """
        """

        if not hasattr(self, '_post'):
            raise errors.MethodNotAllowed('Method Not Allowed.')
        self._post(*args, **kwargs)

    def get(self, *args, **kwargs):
        """
        """

        if not hasattr(self, '_get'):
            raise errors.MethodNotAllowed('Method Not Allowed.')
        self._get(*args, **kwargs)

    def serve_success(self, result):
        self.serve_response(200, result)

    def serve_404(self, msg='Page Not Found'):
        self.serve_response(404, [], msg)

    def serve_error(self, exception, status=500):
        # TODO: Pass in exception stack

        exc_type, exc_value, exc_traceback = sys.exc_info()
        formatted_lines = traceback.format_exc().splitlines()

        self.serve_response(status, formatted_lines, str(exception))
        logging.exception(exception)

    def serve_response(self, status, result, messages=None):
        """
        Serve the response
        """

        payload = {'status': status, 'results': result, 'messages': messages}

        self.response.set_status(status)
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(payload))
