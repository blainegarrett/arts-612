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
from utils import is_appspot, get_domain

#from auth.decorators import rest_login_required

from rest.controllers import RestHandlerBase
from rest.resource import Resource
from rest.resource import RestField
from rest.resource import ResourceIdField, ResourceUrlField, DatetimeField
from rest.utils import get_key_from_resource_id, get_resource_id_from_key

from framework.controllers import MerkabahBaseController
from files.models import FileContainer
from google.appengine.ext import ndb

from modules.venues.internal.models import Venue
from modules.events.internal.models import Event
from modules.blog.internal.models import BlogPost

from files.rest_helpers import REST_RESOURCE_RULES

BUCKET_NAME = 'cdn.mplsart.com'

KEY = 'key'
HEIGHT = 'height'
WIDTH = 'width'
MIME_JPEG = 'image/jpeg'
MIME_PNG = 'image/png'


class VERSIONS(object):
    FULL = {'key': 'FULL', 'height': 1200, 'width': 1200}
    SIZED = {'key': 'SIZED', 'height': 700, 'width': 700}
    CARD_LARGE = {'key': 'CARD_LARGE', 'height': 524, 'width': 1000}
    CARD_SMALL = {'key': 'CARD_SMALL', 'height': 367, 'width': 700}
    THUMB = {'key': 'THUMB', 'height': 160, 'width': 160}


def rescale(img_data, width, height, halign='middle', valign='middle'):
    """
    Resize then optionally crop a given image.

    Attributes:
    img_data: The image data
    width: The desired width
    height: The desired height
    halign: Acts like photoshop's 'Canvas Size' function, horizontally
        aligning the crop to left, middle or right
    valign: Verticallly aligns the crop to top, middle or bottom

    #TODO: Move to a lib...

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

    final_data = image.execute_transforms(output_encoding=images.PNG)
    return final_data, image.height, image.width


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

    def write(self, filepath, content, content_type):
        """
        TODO: Check if filename has leading slash.
        filepath is relative to bucket/
        """

        # Prep the filename
        
        destination_path = "/%s/%s" % (self.bucket, filepath)
        write_retry_params = gcs.RetryParams(backoff_factor=1.1)
        gcs_file = gcs.open(destination_path,
                            'w',
                            content_type=content_type,
                            options={'x-goog-acl': 'public-read', 'x-goog-meta-bar': 'bar'},
                            retry_params=write_retry_params)
        gcs_file.write(content)
        gcs_file.close()
        return filepath

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

    def create_image(self, fs, temp_file_data, dest_filename):
        """
        Helper to put an image on the Cloud
        # FULL and SIZED are JPGs at 85 quality (DEFAULT)
        # CARD_* and THUMB are PNGs
        """

        versions_data = {
            VERSIONS.FULL[KEY]: '',
            VERSIONS.SIZED[KEY]: '',
            VERSIONS.CARD_LARGE[KEY]: '',
            VERSIONS.CARD_SMALL[KEY]: '',
            VERSIONS.THUMB[KEY]: ''}

        '''
        FULL: no crop scaled to max 1500 width ("original")
        SIZED: no crop scaled to 700  width ("sized")
        CARD_LARGE: 1200 631
        CARD_SMALL: 600 x 312
        THUMB: 160 x 160
        '''

        ids = FileContainer.allocate_ids(size=1)
        file_obj_key = ndb.Key('FileContainer', ids[0])
        resource_id = get_resource_id_from_key(file_obj_key)
        dest_folder_name = 'file_container/%s/' % (resource_id)

        # Sized Images
        #img = images.Image(data)
        #img.resize(width=1500, height=1500)
        #file_content = img.execute_transforms(output_encoding=images.JPEG)

        #img = images.Image(temp_file_data) # TODO: Take in filename= or blob_key=

        # VERSION.FULL - scaled to max dimension 1200px
        '''
        img.resize(width=VERSIONS.FULL[WIDTH], height=VERSIONS.FULL[HEIGHT])
        full_data = img.execute_transforms(output_encoding=images.JPEG)
        full_height, full_width = img.height, img.width

        # Write FULL version file ASAP so as not to lose it

        full_filename = fs.write(dest_folder_name + 'full.jpg', full_data, MIME_JPEG)
        logging.warning(full_filename)

        #SIZED VERSION:
        img.resize(width=VERSIONS.SIZED[WIDTH], height=VERSIONS.SIZED[HEIGHT])
        sized_data = img.execute_transforms(output_encoding=images.JPEG)
        sized_filename = fs.write(dest_folder_name + 'sized.jpg', sized_data, MIME_JPEG) # TODO: filename
        sized_height, sized_width = img.height, img.width

        # CARD_LARGE
        card_large_data, card_large_height, card_large_width = rescale(full_data, VERSIONS.CARD_LARGE[WIDTH], VERSIONS.CARD_LARGE[HEIGHT], halign='middle', valign='middle')
        card_large_filename = fs.write(dest_folder_name + 'card_large.png', card_large_data, MIME_PNG) # TODO: filename
        '''

        # CARD_SMALL
        card_small_data, card_small_height, card_small_width = rescale(temp_file_data, VERSIONS.CARD_SMALL[WIDTH], VERSIONS.CARD_SMALL[HEIGHT], halign='middle', valign='middle')
        card_small_filename = fs.write(dest_folder_name + 'card_small.png', card_small_data, MIME_PNG) # TODO: filename

        # THUMB
        thumb_data, thumb_height, thumb_width = rescale(temp_file_data, VERSIONS.THUMB[WIDTH], VERSIONS.THUMB[HEIGHT], halign='middle', valign='middle')
        thumb_filename = fs.write(dest_folder_name + 'thumb.png', thumb_data, MIME_PNG) # TODO: filename

        # Prep the data to be stored
        url_prefx = ''
        if is_appspot():
            url_prefix = 'http://%s/' % BUCKET_NAME
        else:
            url_prefix = 'http://%s/_ah/gcs/%s/' % (get_domain(), BUCKET_NAME)

        #full_url = url_prefix + full_filename
        #sized_url = url_prefix + sized_filename
        #card_large_url = url_prefix + card_large_filename
        card_small_url = url_prefix + card_small_filename
        thumb_url = url_prefix + thumb_filename

        '''
        versions_data[VERSIONS.FULL[KEY]] = {'url': full_url,
                                             'height': full_height,
                                             'width': full_width}

        versions_data[VERSIONS.SIZED[KEY]] = {'url': sized_url,
                                              'height': sized_height,
                                              'width': sized_width}


        versions_data[VERSIONS.CARD_LARGE[KEY]] = {'url': card_large_url,
                                                   'height': card_large_height,
                                                   'width': card_large_width}
        '''

        versions_data[VERSIONS.CARD_SMALL[KEY]] = {'url': card_small_url,
                                                   'height': card_small_height,
                                                   'width': card_small_width}

        versions_data[VERSIONS.THUMB[KEY]] = {'url': thumb_url,
                                              'height': thumb_height,
                                              'width': thumb_width}        

        # Create Datastore entity
        file_obj = FileContainer(key=file_obj_key,
            filename=dest_filename,
            gcs_filename=dest_filename,
            versions=versions_data,
            file_type='image'
        )

        file_obj.put()

        return file_obj

    def post(self):
        """
        Callback for a successful upload... keep this lightweight
        """

        fs = Filesystem(BUCKET_NAME)

        has_files = fs.get_uploads(self.request, 'the_file', populate_post=True)

        if has_files:
            file_info = has_files[0]

            original_filename = file_info.filename
            content_type = file_info.content_type
            size = file_info.size
            gs_object_name = file_info.gs_object_name # We could urlfetch this, but file not public
            blob_key = blobstore.create_gs_key(gs_object_name)

            data = fs.read(gs_object_name.replace('/gs', ''))

            # What we want to do now is create a copy of the file with our own info
            dest_filename = 'juniper/%s' % original_filename

            # Prep the file object
            file_obj = self.create_image(fs, data, dest_filename)
            file_obj_key = file_obj.key
            resource_id = get_resource_id_from_key(file_obj_key)

            # Finally delete the tmp file
            #data = fs.delete(gs_object_name.replace('/gs', ''))

            # "Return" a rest resource of sorts
            payload = {
                'status': 200,
                'messages': [],
                'results': Resource(file_obj, REST_RESOURCE_RULES).to_dict()
            }

            self.response.set_status(200)
            self.response.headers['Content-Type'] = 'application/json'
            self.response.write(json.dumps(payload))


            # Handle Attachment to Resource

            # Do this in a deferred task?
            attach_to_resource_id = self.request.get('attach_to_resource', None)

            # TODO: This should be done in a txn - especially when there are multiple uploads
            if attach_to_resource_id:
                attachment_resource_key = get_key_from_resource_id(attach_to_resource_id)
                attachment_resource = attachment_resource_key.get()

                if not attachment_resource:
                    raise Exception('Resource with key %s not found. File was uploaded...' % attach_to_resource_id)

                if not attachment_resource.attachment_resources:
                    attachment_resource.attachment_resources = []

                # Update attachments
                attachment_resource.attachment_resources.append(resource_id)

                target_property = self.request.get('target_property', None)
                if target_property:
                    setattr(attachment_resource, target_property, resource_id)

                attachment_resource.put()

            return


class ListResourceHandler(RestHandlerBase):
    """
    """

    def get_rules(self):
        return REST_RESOURCE_RULES

    def _get(self):

        # TODO: Abstract this a bit more out into a rest-like service...

        files = FileContainer.query().fetch(1000)

        resource_list = []
        for f in files:
            resource_list.append(Resource(f, self.get_rules()).to_dict())

        self.serve_success(resource_list)


class FileDetailHandler(RestHandlerBase):
    """
    Handler for a specific file
    """

    def get_rules(self):
        return REST_RESOURCE_RULES

    def _get(self, resource_id):
        # TODO: Abstract this a bit more out into a rest-like service...
        f_key = ndb.Key(urlsafe=resource_id)
        f = f_key.get()
        if not f:
            raise Exception('File Not Found')

        self.serve_success(Resource(f, self.get_rules()).to_dict())

    def _post(self, resource_id):
        f_key = ndb.Key(urlsafe=resource_id)
        f = f_key.get()
        if not f:
            raise Exception('File Not Found')

        do_put = False # Only do put if something changed
        for prop, val in self.cleaned_data.items():
            if getattr(f, prop) == val:
                continue

            do_put = True
            setattr(f, prop, val)

        if do_put:
            f.put()

        self.serve_success(Resource(f, self.get_rules()).to_dict())
