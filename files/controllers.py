"""
Rest API for Venues/Galleries
"""
#from __future__ import absolute_import

import logging
from auth.decorators import rest_login_required

from google.appengine.ext import ndb

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField, SlugField, ResourceIdField, ResourceUrlField, GeoField, UploadField
from google.appengine.ext.webapp import blobstore_handlers

from modules.venues.internal import api as venues_api
from modules.venues.internal import search as vsearch
from modules.venues.internal.models import Venue

from framework.controllers import MerkabahBaseController

resource_url = 'http://localhost:8080/api/galleries/%s' #TODO: HRM?


class UploadUrlField(RestField):
    def to_resource(self, data):
        """
        Until we get subfields figured out - manually validate the props
        """

        val = super(UploadUrlField, self).to_resource(data)        
        return val

    def from_resource(self, obj, field):
        """
        Outout a field to dic value
        """
        import cloudstorage
        from google.appengine.ext import blobstore

        success_path = obj['callback_url']
        bucket = 'cdn.mplsart.com'
        upload_path = '%s%s' % (bucket, '/testing')
        val = blobstore.create_upload_url(success_path, gs_bucket_name=upload_path)

        return val


REST_RULES = [
    UploadUrlField('upload_url', output_only=True),
    RestField('callback_url', required=True)
]


class GalleryApiHandlerBase(RestHandlerBase):
    """
    Base Handler for all Gallery API endpoints
    """

    def get_rules(self):
        return REST_RULES
        
class UploadUrlHandler(RestHandlerBase):
    """
    """

    def get_rules(self):
        return REST_RULES

    def _post(self):
        # TODO: Abstract this a bit more out into a rest-like service...

        resource = Resource(self.cleaned_data, REST_RULES).to_dict()
        self.serve_success(resource)



"""
Filestystem Interfaces for Merkabah

"""

import logging
from google.appengine.ext.blobstore import parse_file_info, parse_blob_info
import cgi

class Filesystem(object):
    """
    Base Filesystem Class. To add a Filesystem, extend this class and implement its methods
    """

    def get_uploads(self, request, field_name=None, populate_post=False):
        """Get uploads sent to this handler.
        Modified to support GCS from: https://gist.github.com/harperreed/305322

        Args:
          field_name: Only select uploads that were sent as a specific field.
          populate_post: Add the non blob fields to request.POST

        Returns:
          A list of BlobInfo or FileInfo records corresponding to each upload.
          Empty list if there are no blob-info records for field_name.
        """

        if hasattr(request,'__uploads') == False:
            #request.META['wsgi.input'].seek(0) 
            #fields = cgi.FieldStorage(request.META['wsgi.input'], environ=request.META)
            
            fields = request.POST.mixed();

            request.__uploads = {}
            #if populate_post:
            #    request.POST = {}

            for key in fields.keys():
                field = fields[key]
                if isinstance(field, cgi.FieldStorage) and 'blob-key' in field.type_options:
                    logging.warning(field)
                    logging.warning(field.type_options)
                    logging.warning(field.type_options['blob-key'])
                    logging.warning(type(field.type_options['blob-key']))
                    #if field.type_options['blob-key'].find('encoded_gs_file:') == 0:
                    if True:
                        # This is a Cloud Store Upload
                        file_info = parse_file_info(field)
                        logging.warning(file_info)
                        request.__uploads.setdefault(key, []).append(file_info)
                    #else:
                    #    # This is the normal blobstore upload
                    #    blob_info = parse_blob_info(field)
                    #    request.__uploads.setdefault(key, []).append(blob_info)

                if populate_post:
                    request.POST[key] = field.value

        if field_name:
            try:
                return list(request.__uploads[field_name])
            except KeyError:
                return []
        else:
            results = []
            for uploads in request.__uploads.itervalues():
                results += uploads
            return results




class UploadCallbackHandler(MerkabahBaseController):
    """
    """

    """
    rules = REST_RULES = [
        UploadField('the_file', required=True)
    ]
    """

    def post(self):
        
        fs = Filesystem()

        has_files = fs.get_uploads(self.request, 'the_file', populate_post=True)

        if has_files:
            file_info = has_files[0]

            original_filename = file_info.filename
            content_type = file_info.content_type
            size = file_info.size
            gs_object_name = file_info.gs_object_name # Using this we could urlfetch, but the file isn't public...
            #blob_key = blobstore.create_gs_key(gs_object_name)
            #logging.warning(blob_key)

        raise Exception([original_filename, content_type, size, gs_object_name, ])
    
    
