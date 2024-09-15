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
from librus_apix.homework import get_homework, homework_detail
from librus_apix.messages import (
    get_received,
    get_recipients,
    get_sent,
    message_content,
    recipient_groups,
    send_message,
)
from librus_apix.notifications import (
    NotificationIds,
    get_initial_notification_data,
    get_new_notification_data,
)
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
    return {status.value, freq}


def student_info(client: Client):
    status, info = sanitize_fetch(get_student_information, client)
    return status.value, info


def msg_content(client: Client, msg_id: str):
    status, content = sanitize_fetch(message_content, client, msg_id)
    return status.value, content


def received(client: Client, page: int = 0):
    status, msgs = sanitize_fetch(get_received, client, page)
    return status.value, msgs


def sent(client: Client, page: int = 0):
    status, msgs = sanitize_fetch(get_sent, client, page)
    return status.value, msgs


def send(client: Client, title: str, content: str, recipients: list):
    status, msg = sanitize_fetch(send_message, client, title, content, recipients)
    if status.value == RETURN_ATOM.ok:
        was_sent, msg = msg
        if was_sent == False:
            return Atom(b"send_error"), msg
    return status.value, msg


def message_groups(client: Client):
    status, groups = sanitize_fetch(recipient_groups, client)
    return status.value, groups


def group_recipients(client: Client, group: str):
    status, recipients = sanitize_fetch(get_recipients, client, group)
    return status.value, recipients


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


def notifications(client: Client, ids: NotificationIds):
    status, notifications = sanitize_fetch(get_new_notification_data, client, ids)
    return status.value, notifications


def initial_notifications(client: Client):
    status, notifications = sanitize_fetch(get_initial_notification_data, client)
    return status.value, notifications


def homework(client: Client, start: str, end: str):
    status, homework = sanitize_fetch(get_homework, client, start, end)
    return status.value, homework


def homework_details(client: Client, hw_id: str):
    status, homework = sanitize_fetch(homework_detail, client, hw_id)
    return status.value, homework
