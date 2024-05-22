from erlport.erlterms import Atom
from datetime import datetime
from librus_apix.exceptions import TokenError
from librus_apix.grades import get_grades, ParseError
from librus_apix.announcements import get_announcements
from datetime import timedelta
from librus_apix.attendance import get_attendance
from librus_apix.homework import get_homework
from librus_apix.messages import get_received
from librus_apix.schedule import get_schedule
from librus_apix.student_information import get_student_information
from librus_apix.timetable import get_timetable
from handle_classes import *
from helpers import create_client, extract_grades


def handle_overview_grades(token, semester):
    client = create_client(token)
    try:
        subjects, average_grades, descriptive = get_grades(client, "week")
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), extract_grades(
        handle_grades(subjects[int(semester)])
    )


def handle_homework_overview(token, monday):
    token = create_client(token)
    try:
        this_week = (
            datetime.strptime(monday, "%Y-%m-%d") + timedelta(days=7)
        ).strftime("%Y-%m-%d")
        homework = get_homework(token, monday, this_week)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_homework(homework)


def handle_overview_student_info(token):
    client = create_client(token)
    try:
        info = get_student_information(client).__dict__
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), info


def handle_overview_messages(token):
    client = create_client(token)
    try:
        messages = get_received(client, 0)
        messages = filter(lambda x: x.unread == True, messages)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_messages(messages)


def handle_overview_announcements(token, amount):
    client = create_client(token)
    try:
        announcements = get_announcements(client)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_announcements(
        announcements[: int(amount)]
    )


def handle_overview_timetable(token, monday):
    client = create_client(token)
    try:
        monday = datetime.strptime(monday, "%Y-%m-%d")
        timetable = get_timetable(client, monday)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_timetable(timetable)


def handle_overview_schedule(token, year, month):
    client = create_client(token)
    try:
        schedule = get_schedule(client, month, year)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_schedule(schedule)


def handle_overview_attendance(token, semester):
    client = create_client(token)
    try:
        attendance = get_attendance(client, "week")
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_attendance(attendance[int(semester)])
