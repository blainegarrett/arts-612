import base64
from google.appengine.ext import ndb

SEPARATOR = chr(30)
INTPREFIX = chr(31)


def get_resource_id_from_key(key):
    """
    Convert a ndb.Key() into a `str` resource id
    """

    pair_strings = []

    pairs = key.pairs()

    for pair in pairs:
        kind = unicode(pair[0])
        key_or_id = pair[1]
        
        if isinstance(key_or_id, (int, long)):
            key_or_id = unicode(INTPREFIX + unicode(key_or_id))

        pair_strings.append(kind + SEPARATOR + key_or_id)

    buff = SEPARATOR.join(pair_strings)
    encoded = base64.urlsafe_b64encode(buff)
    encoded = encoded.replace('=', '')
    return encoded


def get_key_from_resource_id(resource_id):
    """
    Convert a `str` resource id into a ndb.Key()
    """

    # Add padding back on as needed...
    modulo = len(resource_id) % 4
    if modulo != 0:
        resource_id += ('=' * (4 - modulo))

    # decode the url safe resource id
    decoded = base64.urlsafe_b64decode(str(resource_id))
    
    key_pairs = []
    bits = decoded.split(SEPARATOR)

    for bit in bits:
        if (bit[0] == INTPREFIX):
            bit = int(bit[1:])
        key_pairs.append(bit)

    return ndb.Key(*key_pairs)
