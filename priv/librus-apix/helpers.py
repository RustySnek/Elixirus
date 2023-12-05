from erlport.erlterms import Atom
from librus_apix.get_token import get_token, Token
from librus_apix.grades import TokenError
from librus_apix.student_information import get_student_information

def extract_grades(grades):
    return [grade for subject in list(grades.values()) for grade in subject]

def create_token(token_charlist):
    token = "".join([chr(n) for n in token_charlist])
    return Token(token)
