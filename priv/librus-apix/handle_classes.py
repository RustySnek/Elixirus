from librus_apix.get_token import get_token

def handle_token(u, p):
    token = get_token(u,p)
    return token.__dict__
