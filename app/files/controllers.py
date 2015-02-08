"""
Rest API for Venues/Galleries
"""
#from __future__ import absolute_import

import cgi
import json
import logging
import cloudstorage as gcs
from google.appengine.ext import blobstore
from google.appengine.api import images

#from auth.decorators import rest_login_required

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField

from framework.controllers import MerkabahBaseController
from files.models import FileContainer

resource_url = 'http://localhost:8080/api/galleries/%s' #TODO: HRM?

BUCKET_NAME = 'cdn.mplsart.com'

"""
TODO:
[ ] Add rest_login_required to endpoints
[ ]
"""



def rescale(img_data, width, height, halign='middle', valign='middle'):
  """Resize then optionally crop a given image.

  Attributes:
    img_data: The image data
    width: The desired width
    height: The desired height
    halign: Acts like photoshop's 'Canvas Size' function, horizontally
            aligning the crop to left, middle or right
    valign: Verticallly aligns the crop to top, middle or bottom

  """

  image = images.Image(img_data)      

  desired_wh_ratio = float(width) / float(height)
  wh_ratio = float(image.width) / float(image.height)

  if desired_wh_ratio > wh_ratio:
    # resize to width, then crop to height
    image.resize(width=width)
    image.execute_transforms()
    trim_y = (float(image.height - height) / 2) / image.height
    if valign == 'top':
      image.crop(0.0, 0.0, 1.0, 1 - (2 * trim_y))
    elif valign == 'bottom':
      image.crop(0.0, (2 * trim_y), 1.0, 1.0)
    else:
      image.crop(0.0, trim_y, 1.0, 1 - trim_y)
  else:
    # resize to height, then crop to width
    image.resize(height=height)
    image.execute_transforms()
    trim_x = (float(image.width - width) / 2) / image.width
    if halign == 'left':
      image.crop(0.0, 0.0, 1 - (2 * trim_x), 1.0)
    elif halign == 'right':
      image.crop((2 * trim_x), 0.0, 1.0, 1.0)
    else:
      image.crop(trim_x, 0.0, 1 - trim_x, 1.0)

  return image.execute_transforms()


class UploadUrlField(RestField):
    """
    Resource Field to handle retrieving a file upload url
    """

    def to_resource(self, data):
        """
        Until we get subfields figured out - manually validate the props
        """

        val = super(UploadUrlField, self).to_resource(data)
        return val

    def from_resource(self, obj, field):
        """
        Outout a field to dict value
        """
        success_path = obj['callback_url']
        upload_path = '%s%s' % (BUCKET_NAME, '/testing')
        val = blobstore.create_upload_url(success_path, gs_bucket_name=upload_path)

        return val


class UploadUrlHandler(RestHandlerBase):
    """
    """

    def get_rules(self):
        return [UploadUrlField('upload_url', output_only=True),
                RestField('callback_url', required=True)]

    def _post(self):
        # TODO: Abstract this a bit more out into a rest-like service...

        resource = Resource(self.cleaned_data, self.get_rules()).to_dict()
        self.serve_success(resource)

"""
Filestystem Interfaces for Merkabah

"""


class Filesystem(object):
    """
    Base Filesystem Class. To add a Filesystem, extend this class and implement its methods
    """

    def __init__(self, bucket):
         #self.DEFAULT_UPLOAD_FOLDER = '/tmp'
         self.bucket = bucket

    def read(self, filename):
        """
        """
        gcs_file = gcs.open(filename)
        return gcs_file.read()

    def write(self, filename, content, content_type):
        """
        TODO: Check if filename has leading slash.
        """

        # Prep the filename
        filename = "/%s/%s" % (self.bucket, filename)
        write_retry_params = gcs.RetryParams(backoff_factor=1.1)
        gcs_file = gcs.open(filename,
                            'w',
                            content_type=content_type,
                            options={'x-goog-acl': 'public-read', 'x-goog-meta-bar': 'bar'},
                            retry_params=write_retry_params)
        gcs_file.write(content)
        gcs_file.close()
        return filename

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

        if hasattr(request, '__uploads') == False:
            #request.META['wsgi.input'].seek(0)
            #fields = cgi.FieldStorage(request.META['wsgi.input'], environ=request.META)

            fields = request.POST.mixed()

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
                        file_info = blobstore.parse_file_info(field)
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


    def create_image(self, fs, data, dest_filename, content_type, size):
        """
        Helper to put an image on the Cloud
        """

        # Original Image
        new_gcs_filename = fs.write(dest_filename, data, content_type)
        logging.warning(new_gcs_filename)


        # Thumbnail
        file_content = rescale(data, 365, 235, halign='middle', valign='middle')
        thumbnail_filename = dest_filename + '.thumb'
        #'artwork/thumbnail/%s.%s' % (slug, extension)

        logging.debug(thumbnail_filename)
        fs.write(thumbnail_filename, file_content, content_type)

        # Sized Images
        img = images.Image(data)
        img.resize(width=1000, height=1000)
        img.im_feeling_lucky()
        file_content = img.execute_transforms(output_encoding=images.JPEG)

        #sized_filename = 'artwork/sized/%s.%s' % (slug, extension)
        sized_filename = dest_filename + '.sized'

        logging.debug(sized_filename)
        fs.write(sized_filename, file_content, content_type)

        file_obj = FileContainer(
            content_type=content_type,
            size=size,
            filename=dest_filename,
            gcs_filename = dest_filename)

        file_obj.put()

        return file_obj

    def post(self):

        fs = Filesystem(BUCKET_NAME)

        has_files = fs.get_uploads(self.request, 'the_file', populate_post=True)

        if has_files:
            file_info = has_files[0]

            original_filename = file_info.filename
            content_type = file_info.content_type
            size = file_info.size
            gs_object_name = file_info.gs_object_name # We could urlfetch this, but file not public
            blob_key = blobstore.create_gs_key(gs_object_name)
            
            logging.warning(blob_key)

            data = fs.read(gs_object_name.replace('/gs', ''))

            #logging.warning(data)
            # What we want to do now is create a copy of the file with our own info
            dest_filename = 'juniper/%s' % original_filename

            # Prep the file object
            file_obj = self.create_image(fs, data, dest_filename, content_type, size)

            # Finally delete the tmp file
            #data = fs.delete(gs_object_name.replace('/gs', ''))

            # This isn't really a rest resource...
            payload = {
                'file_key': file_obj.key.urlsafe(), # This should be a resource id
                'gcs_filename': dest_filename
            }
            self.response.set_status(200)
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(payload))
            return




            #blob_key = blobstore.create_gs_key(gs_object_name)
            #logging.warning(blob_key)

        #raise Exception([dest_filename, content_type, size, gs_object_name ])
