# Rest Controller Base

import webapp2
import json
import traceback
import sys
import logging

from rest import errors
from rest.resource import Resource


class RestHandlerBase(webapp2.RequestHandler):
    """
    Base Class for All Rest Endpoints
    """

    data = {} # Payload data

    def validate_payload(self): # aka Form.clean
        """
        Validate the request payload against the rest rules
        This only works for a single payload entity, not a list...
        """

        rules = self.get_rules()
        self.cleaned_data = Resource(None, rules).from_dict(self.data)

    def dispatch(self):
        """
        Dispatcher for checking various things
        """

        # Process Request Payload

        # Convert: body into native format
        if len(self.request.body) > 0:
            if 'application/json' in self.request.headers['Content-Type']:
                self.data = json.loads(self.request.body)
            elif 'multipart/form-data' in self.request.headers['Content-Type']:
                self.data = self.request.POST.mixed()
                logging.error(self.data)

        try:
            super(RestHandlerBase, self).dispatch()
        except errors.MethodNotAllowed, e:
            self.serve_error(e, status=405)
        except Exception, e:
            self.serve_error(e)

    def put(self, *args, **kwargs):
        """
        """

        # Validate incoming payload
        self.validate_payload()

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
        Typically used to create a new resource
        """

        # Validate incoming payload
        self.validate_payload()

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

        self.serve_response(status, formatted_lines, [str(exception)])
        logging.exception(exception)

    def serve_response(self, status, result, messages=None):
        """
        Serve the response
        """

        if (not isinstance(messages, list)):
            messages = [messages]


        payload = {'status': status, 'results': result, 'messages': messages}

        self.response.set_status(status)
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(payload))
