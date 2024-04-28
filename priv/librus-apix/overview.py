from erlport.erlterms import Atom
from datetime import datetime
from librus_apix.get_token import Token
from librus_apix.grades import TokenError, get_grades, ParseError
from librus_apix.announcements import get_announcements
from datetime import timedelta
from librus_apix.attendance import get_attendance
from librus_apix.homework import get_homework
from librus_apix.messages import get_recieved
from librus_apix.schedule import get_schedule
from librus_apix.student_information import get_student_information
from librus_apix.timetable import get_timetable
from handle_classes import *
from helpers import create_token, extract_grades

def handle_overview_grades(token, semester):
    token = create_token(token)
    try:
        subjects, average_grades, descriptive = get_grades(token, "week")
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), extract_grades(handle_grades(subjects[int(semester)]))

def handle_homework_overview(token, monday):
    token = create_token(token)
    try:
        this_week = (datetime.strptime(monday, "%Y-%m-%d") + timedelta(days=7)).strftime("%Y-%m-%d")
        homework = get_homework(token, monday, this_week)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), handle_homework(homework)

def handle_overview_student_info(token):
    token = create_token(token)
    try:
        info = get_student_information(token).__dict__
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), info 



def handle_overview_messages(token):
    token = create_token(token)
    try:
        messages = get_recieved(token, 0)
        messages = filter(lambda x: x.unread == True, messages)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), handle_messages(messages)

def handle_overview_announcements(token, amount):
    token = create_token(token)
    try:
        announcements = get_announcements(token)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), handle_announcements(announcements[:int(amount)])

def handle_overview_timetable(token, monday):
    token = create_token(token)
    try:
        monday = "".join([chr(n) for n in monday])
        monday = datetime.strptime(monday, "%Y-%m-%d") 
        timetable = get_timetable(token, monday)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), handle_timetable(timetable)

def handle_overview_schedule(token, year, month):
    token = create_token(token)
    try:
        schedule = get_schedule(token, month, year)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode('utf-8')), handle_schedule(schedule)

def handle_overview_attendance(token, semester):
    token = create_token(token)
    try:
        attendance = get_attendance(token, "week")
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_attendance(attendance[int(semester)])

