from librus_apix.get_token import get_token
from erlport.erlterms import Atom
def handle_token(u, p):
    try:
        token = get_token(u,p)
        return Atom("ok".encode("utf-8")), token.API_Key
    except Exception as ex:
        return Atom("error".encode("utf-8")), str(ex)

