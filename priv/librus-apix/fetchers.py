from collections import Counter
from datetime import datetime

from erlport.erlterms import Atom
from handle_classes import *
from handle_classes import handle_completed_lessons
from helpers import brew_elixir_dict, brew_elixir_list, create_client

from librus_apix.announcements import get_announcements
from librus_apix.attendance import ParseError, get_attendance, get_attendance_frequency
from librus_apix.client import Client
from librus_apix.completed_lessons import get_completed
from librus_apix.exceptions import (
    AuthorizationError,
    ParseError,
    TokenError,
    TokenKeyError,
)
from librus_apix.grades import get_grades
from librus_apix.homework import get_homework, homework_detail
from librus_apix.messages import get_max_page_number as get_max_page_messages
from librus_apix.messages import (
    get_received,
    get_recipients,
    get_sent,
    message_content,
    recipient_groups,
)
from librus_apix.messages import send_message as send_msg
from librus_apix.schedule import get_schedule
from librus_apix.student_information import get_student_information


def sanitize_fetch(func, *args):
    try:
        return "ok", func(*args)
    except (TokenError, TokenKeyError) as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    except AuthorizationError as err:
        return Atom("error".encode("utf-8")), str(err)


def fetch_student_data(token):
    client: Client = create_client(token)
    status, student_data = sanitize_fetch(get_student_information, client)
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_dict(
            student_data.__dict__, safe=False
        )
    else:
        return status, student_data


def fetch_completed_lessons(token, date_from, date_to, page=0):
    client: Client = create_client(token)
    status, completed_lessons = sanitize_fetch(
        get_completed, client, date_from, date_to, page
    )

    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_list(
            handle_completed_lessons(completed_lessons), safe=False
        )
    else:
        return status, completed_lessons


def fetch_todays_completed_lessons(token):
    today_date = datetime.now().strftime("%Y-%m-%d")
    return fetch_completed_lessons(token, today_date, today_date)


def fetch_announcements(token):
    client: Client = create_client(token)
    status, announcements = sanitize_fetch(get_announcements, client)
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_list(
            handle_announcements(announcements), safe=False
        )
    else:
        return status, announcements


def get_recipient_groups(token):
    client: Client = create_client(token)
    status, groups = sanitize_fetch(recipient_groups, client)
    if status == "ok":
        assert isinstance(groups, list)
        return Atom(status.encode("utf-8")), brew_elixir_list(groups)
    else:
        return status, groups


def get_group_recipients(token, group):
    client: Client = create_client(token)
    status, recipients = sanitize_fetch(get_recipients, client, group)
    if status == "ok":
        assert isinstance(recipients, dict)
        return Atom(status.encode("utf-8")), brew_elixir_dict(recipients)
    else:
        return status, recipients


def send_message(token, title, content, recipients):
    client: Client = create_client(token)
    recipients = list(map(lambda id: id.decode("utf-8"), recipients))
    status, msg = sanitize_fetch(send_msg, client, title, content, recipients)
    if status == "ok":
        was_sent, msg = msg
        if was_sent == False:
            return Atom("send_error".encode("utf-8")), str(msg)
        return Atom(status.encode("utf-8")), str(msg)
    else:
        return status, msg


def fetch_sent_messages(token, page):
    client: Client = create_client(token)
    status, messages = sanitize_fetch(get_sent, client, int(page))
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_list(
            handle_messages(messages), safe=False
        )
    else:
        return status, messages


def fetch_messages(token, page):
    client: Client = create_client(token)
    status, messages = sanitize_fetch(get_received, client, int(page))
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_list(
            handle_messages(messages), safe=False
        )
    else:
        return status, messages


def fetch_all_messages(token):
    client: Client = create_client(token)
    try:
        pages = get_max_page_messages(client)
        messages = []
        for page in range(0, pages + 1):
            messages.extend(get_received(client, page))
    except (TokenError, TokenKeyError) as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), brew_elixir_list(
        handle_messages(messages), safe=False
    )


def fetch_message_content(token, id):
    client: Client = create_client(token)
    status, content = sanitize_fetch(message_content, client, id)
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_dict(
            content.__dict__, safe=False
        )
    else:
        return status, content


def fetch_schedule(token, year, month):
    client: Client = create_client(token)
    status, schedule = sanitize_fetch(get_schedule, client, month, year, True)
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_dict(
            handle_schedule(schedule), safe=False, exclude=["data"]
        )
    else:
        return status, schedule


def fetch_grades(token, semester, opt):
    client: Client = create_client(token)
    status, data = sanitize_fetch(get_grades, client, opt)
    if status == "ok":
        subjects, semester_grades, descriptive = data
        return Atom(status.encode("utf-8")), [
            brew_elixir_dict(handle_grades(subjects[int(semester)]), safe=False),
            brew_elixir_dict(handle_semester_grades(semester_grades)),
        ]
    else:
        return status, data


def fetch_all_grades(token, semester):
    return fetch_grades(token, semester, "all")


def fetch_new_grades(token, semester):
    return fetch_grades(token, semester, "last_login")


def fetch_week_grades(token, semester):
    return fetch_grades(token, semester, "week")


def fetch_homework(token, start, end):
    client: Client = create_client(token)
    status, homework = sanitize_fetch(get_homework, client, start, end)
    if status == "ok":
        return Atom(status.encode("utf-8")), brew_elixir_list(
            handle_homework(homework), safe=False
        )
    else:
        return status, homework


def fetch_homework_details(token, id):
    client: Client = create_client(token)
    status, details = sanitize_fetch(homework_detail, client, id)
    if status == "ok":
        assert isinstance(details, dict)
        return Atom(status.encode("utf-8")), brew_elixir_dict(details)
    else:
        return status, details


def get_attendance_stats(attendance):
    first, second = attendance
    base_counter = Counter({"nb": 0, "sp": 0, "u": 0})
    first = base_counter + Counter(a.symbol for a in first)
    second = base_counter + Counter(a.symbol for a in second)
    total = first + second
    return brew_elixir_list([dict(first), dict(second), dict(total)])


def fetch_attendance(token, semester, opt="all", get_stats=False):
    client: Client = create_client(token)
    status, attendance = sanitize_fetch(get_attendance, client, opt)
    if status == "ok":
        if get_stats:
            return (
                Atom(status.encode("utf-8")),
                brew_elixir_list(
                    handle_attendance(attendance[int(semester)]), safe=False
                ),
                get_attendance_stats(attendance),
            )
        else:
            return Atom(status.encode("utf-8")), brew_elixir_list(
                handle_attendance(attendance[int(semester)]), safe=False
            )
    else:
        return status, attendance


def fetch_all_attendance(token, semester, get_stats=False):
    return fetch_attendance(token, semester, "all", get_stats)


def fetch_week_attendance(token, semester, get_stats=False):
    return fetch_attendance(token, semester, "week", get_stats)


def fetch_new_attendance(token, semester, get_stats=False):
    return fetch_attendance(token, semester, "last_login", get_stats)


def fetch_attendance_frequency(token):
    client: Client = create_client(token)
    status, frequency = sanitize_fetch(get_attendance_frequency, client)
    if status == "ok":
        return Atom(status.encode("utf-8")), frequency
    else:
        return status, frequency
