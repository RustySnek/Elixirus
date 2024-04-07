from erlport.erlterms import Atom
from librus_apix.attendance import get_attendance, get_attendance_frequency
from librus_apix.messages import get_recieved, message_content
from librus_apix.homework import get_homework, homework_detail
from librus_apix.schedule import get_schedule
from librus_apix.get_token import AuthorizationError, Token
from librus_apix.grades import TokenError
from librus_apix.student_information import get_student_information
from handle_classes import *
from librus_apix.exceptions import TokenError, ParseError
import os

def extract_grades(grades):
    return [grade for subject in list(grades.values()) for grade in subject]

def create_token(token_charlist):
    proxy = {}
    elixirus_proxy = os.getenv("ELIXIRUS_PROXY")
    if elixirus_proxy is not None and os.getenv("USE_PROXY") == "yes":
        proxy = {"https": elixirus_proxy, "http": elixirus_proxy}
    token_key = "".join([chr(n) for n in token_charlist])
    if len(token_key.split(":")) != 2:
        return Token("mal:formed", proxy=proxy)
    return Token(token_key, proxy=proxy)

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

def fetch_schedule(token, year, month):
    token = create_token(token)
    try:
        schedule = get_schedule(token, month, year, True)
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_schedule(schedule)

def fetch_grades(token, semester, opt):
    try:
        subjects, semester_grades, descriptive = get_grades(token, opt)
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), [handle_grades(subjects[int(semester)]), handle_semester_grades(semester_grades)]

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

def fetch_attendance(token, semester):
    token = create_token(token)
    try:
        attendance = get_attendance(token)
    except (TokenError, ParseError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_attendance(attendance[int(semester)])

def fetch_attendance_frequency(token):
    token = create_token(token)
    try:
        frequency = get_attendance_frequency(token)
    except (TokenError, ParseError, AuthorizationError) as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), frequency



