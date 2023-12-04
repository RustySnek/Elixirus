from erlport.erlterms import Atom
from datetime import datetime
from librus_apix.get_token import Token
from librus_apix.grades import TokenError, get_grades
from librus_apix.announcements import get_announcements, timedelta
from librus_apix.attendance import get_attendance
from librus_apix.homework import get_homework
from librus_apix.messages import get_recieved
from librus_apix.schedule import get_schedule
from librus_apix.timetable import get_timetable
from handle_classes import *
from helpers import create_token, extract_grades

def handle_overview_grades(token):
    token = create_token(token)
    try:
        subjects, average_grades, descriptive = get_grades(token, "all")
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), extract_grades(handle_grades(subjects[1]))

def handle_homework_overview(token, monday):
    token = create_token(token)
    try:
        this_week = (datetime.strptime(monday, "%Y-%m-%d") + timedelta(days=7)).strftime("%Y-%m-%d")
        homework = get_homework(token, monday, this_week)
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_homework(homework)
    

def handle_overview_messages(token, amount):
    token = create_token(token)
    try:
        messages = get_recieved(token, 0)
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_messages(messages[:int(amount)])

def handle_overview_announcements(token, amount):
    token = create_token(token)
    try:
        announcements = get_announcements(token)
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_announcements(announcements[:int(amount)])

def handle_overview_timetable(token, monday):
    token = create_token(token)
    try:
        monday = datetime.strptime(monday, "%Y-%m-%d") 
        timetable = get_timetable(token, monday)
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_timetable(timetable)

def handle_overview_schedule(token, year, month):
    token = create_token(token)
    try:
        schedule = get_schedule(token, month, year)
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode('utf-8')), handle_schedule(schedule)

def handle_overview_attendance(token, semester):
    token = create_token(token)
    try:
        attendance = get_attendance(token)#, {"zmiany_logowanie": ""})
    except TokenError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode("utf-8")), handle_attendance(attendance[int(semester)])

def handle_overview(token, semester):
    token = "".join([chr(n) for n in token])
    token = Token(token)
    
    attendance = get_attendance(token, {"zmiany_logowanie": ""})
    announcements = get_announcements(token)
    # homework = get_homework()
    messages = get_recieved(token, 0)
    #timetable = get_timetable(token)
    #schedule = get_schedule(token)
