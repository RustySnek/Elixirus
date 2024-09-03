from collections import Counter
from datetime import datetime
from enum import Enum

from erlport.erlterms import Atom
from librus_apix.announcements import get_announcements
from librus_apix.attendance import get_attendance, get_attendance_frequency
from librus_apix.client import Client
from librus_apix.exceptions import (
    AuthorizationError,
    ParseError,
    TokenError,
    TokenKeyError,
)
from librus_apix.grades import get_grades
from librus_apix.messages import get_received
from librus_apix.schedule import get_schedule
from librus_apix.student_information import get_student_information
from librus_apix.timetable import get_timetable


class RETURN_ATOM(Enum):
    ok = Atom(b"ok")
    error = Atom(b"error")
    token_error = Atom(b"token_error")


def sanitize_fetch(func, *args):
    try:
        return RETURN_ATOM.ok, func(*args)
    except (TokenError, TokenKeyError) as token_err:
        return RETURN_ATOM.token_error, str(token_err)
    except (ParseError, AuthorizationError) as parse_err:
        return RETURN_ATOM.error, str(parse_err)


def announcements(client: Client):
    status, ann = sanitize_fetch(get_announcements, client)
    return status.value, ann


def grades(client: Client, opt: str = "all"):
    status, all_grades = sanitize_fetch(get_grades, client, opt)
    return status.value, all_grades


def new_grades(client: Client, semester):
    status, new = grades(client, "last_login")
    if status == RETURN_ATOM.ok.value:
        (_grades, _, _) = new
        return status, _grades[int(semester)]
    return status, new


def average_grades(client: Client):
    status, avgs = grades(client)
    if status == RETURN_ATOM.ok.value:
        (_, avgs, _) = avgs
    return status, avgs


def frequency(client: Client):
    status, freq = sanitize_fetch(get_attendance_frequency, client)
    # Some absolute wizardry prevents from returning a tuple here.
    return [status.value, freq]


def student_info(client: Client):
    status, info = sanitize_fetch(get_student_information, client)
    return status.value, info


def received(client: Client, page: int = 0):
    status, msgs = sanitize_fetch(get_received, client, page)
    return status.value, msgs


def get_attendance_stats(attendance):
    first, second = attendance
    base_counter = Counter({"nb": 0, "sp": 0, "u": 0})
    first = base_counter + Counter(a.symbol for a in first)
    second = base_counter + Counter(a.symbol for a in second)
    total = first + second
    return first, second, total


def attendance(client: Client, stats: bool = False, opt: str = "all"):
    status, attendance = sanitize_fetch(get_attendance, client, opt)
    if not stats:
        return status.value, attendance
    return status.value, attendance, get_attendance_stats(attendance)


def schedule(client: Client, year: str, month: str, empty: bool = False):
    status, schedule = sanitize_fetch(get_schedule, client, month, year, empty)
    return status.value, schedule


def timetable(client: Client, monday: str):
    date = datetime.strptime(monday, "%Y-%m-%d")
    status, timetable = sanitize_fetch(get_timetable, client, date)
    return status.value, timetable
