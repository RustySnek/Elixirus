from librus_apix.get_token import get_token, Token

def extract_grades(grades):
    return [grade for subject in list(grades.values()) for grade in subject]

def create_token(token_charlist):
    token = "".join([chr(n) for n in token_charlist])
    return Token(token)
