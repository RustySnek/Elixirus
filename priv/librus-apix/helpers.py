from erlport.erlterms import Atom
from librus_apix.messages import get_recieved, message_content
from librus_apix.homework import get_homework, homework_detail
from librus_apix.get_token import get_token, Token
from librus_apix.grades import TokenError
from librus_apix.student_information import get_student_information
from handle_classes import *
from librus_apix.exceptions import TokenError, ParseError

def extract_grades(grades):
    return [grade for subject in list(grades.values()) for grade in subject]

def create_token(token_charlist):
    token = "".join([chr(n) for n in token_charlist])
    return Token(token)

def fetch_messages(token, page):
    token = create_token(token)
    try:
        messages = get_recieved(token, int(page))
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_messages(messages)

def fetch_message_content(token, id):
    token = create_token(token)
    try:
        content = message_content(token, id.decode('utf-8'))
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), content 



def fetch_grades(token, semester, opt):
    try:
        subjects, average_grades, descriptive = get_grades(token, opt)
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_grades(subjects[int(semester)])

def fetch_all_grades(token, semester):
    token = create_token(token)
    return fetch_grades(token, semester, "all")

def fetch_new_grades(token, semester):
    token = create_token(token)
    return fetch_grades(token, semester, "last_login")

def fetch_week_grades(token, semester):
    token = create_token(token)
    return fetch_grades(token, semester, "week")

def fetch_homework(token, start, end):
    token = create_token(token)
    try:
        homework = get_homework(token, start.decode("utf-8"), end.decode("utf-8"))
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_homework(homework)

def fetch_homework_details(token, id):
    token = create_token(token)
    try:
        details = homework_detail(token, id.decode("utf-8"))
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), details


