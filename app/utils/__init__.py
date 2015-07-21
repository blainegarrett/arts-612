import os


def is_appspot():
    return not os.environ['SERVER_SOFTWARE'].startswith('Development')


def get_domain():
    return os.environ['HTTP_HOST']
