# Rest Controller Base

import webapp2
import json
import traceback
import sys, os
import logging

from urlparse import urlparse
from google.appengine.api import users

from rest import errors
from rest.resource import Resource
from rest.params import ResourceParams
from auth.helpers import get_auth_token_from_request


class RestHandlerBase(webapp2.RequestHandler):
    """
    Base Class for All Rest Endpoints
    """

    def is_same_origin(self):
        """
        Helper Method to determine if referrer is the same as the host
        This is to support 'dumb' REST permissions to prevent attacking REST Services
        """

        # If local sdk, allow
        if os.environ['SERVER_SOFTWARE'].startswith('Development'):
            return True

        if not self.request.referer:
            return False

        return urlparse(self.request.referer)[1] == self.request.host

    def get_param_schema(self):
        """
        If you want query params, you must implement this
        """

        return {}

    def validate_params(self):
        """
        Run Validation on query params
        """

        param_schema = self.get_param_schema()
        self.cleaned_params = ResourceParams(param_schema).from_dict(self.params)

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

        try:
            self.data = {}
            self.cleaned_data = {}
            self.params = {}
            self.cleaned_params = {}

            # Do basic access checks
            cur_user = users.get_current_user() # Eventually put this on the request
            if not (self.is_same_origin() or cur_user):
                raise errors.RestError('Invalid referrer: %s' % self.request.referer)

            # Process Request Payload

            # Convert: body into native format
            if len(self.request.body) > 0:
                if 'application/json' in self.request.headers['Content-Type']:
                    self.data = json.loads(self.request.body)
                elif 'multipart/form-data' in self.request.headers['Content-Type']:
                    self.data = self.request.POST.mixed()
                    logging.error(self.data)

            # Query parameters
            self.params = self.request.GET.mixed()
            self.validate_params()

            # Attempt to run handler
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

    def serve_success(self, result, extra_fields={}):
        self.serve_response(200, result, extra_fields=extra_fields)

    def serve_404(self, msg='Page Not Found'):
        self.serve_response(404, [], messages=msg)

    def serve_error(self, exception, status=500):
        # TODO: Pass in exception stack

        exc_type, exc_value, exc_traceback = sys.exc_info()
        formatted_lines = traceback.format_exc().splitlines()

        self.serve_response(status, formatted_lines, messages=[str(exception)])
        logging.exception(exception)

    def serve_response(self, status, result, messages=None, extra_fields={}):
        """
        Serve the response
        """

        if (not isinstance(messages, list)):
            messages = [messages]

        # TODO: Validate that extra_fields doesn't contain bad props
        payload = extra_fields
        payload.update(
            {'status': status, 'results': result, 'messages': messages}
        )

        # Add a fresh new auth token to the response
        # token = get_auth_token_from_request(request)
        # raise Exception(self.request.user)
        token = 'Not Implemented Yet'

        # Generate a new take
        payload.update({'auth_token': token})

        self.response.set_status(status)
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(payload))
