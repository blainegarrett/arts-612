"""
Auth System Helpers
"""
import jwt

JWT_SECRET = 'fartssmell'
JWT_ALGORITHM = 'HS256'

def read_token(token):
    payload = jwt.decode(token, JWT_SECRET, algorithm=JWT_ALGORITHM);



def make_token(payload):


    profile = {
        'user_id': 1234,
        'username': 'blainegarrett'
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    raise Exception(token)