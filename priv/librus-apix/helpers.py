from erlport.erlterms import Atom
from librus_apix.attendance import get_attendance, get_attendance_frequency
from librus_apix.messages import (
    get_recieved,
    message_content,
    get_max_page_number as get_max_page_messages,
    recipient_groups,
    get_recipients,
    get_sent,
    send_message as send_msg,
)
from librus_apix.homework import get_homework, homework_detail
from librus_apix.schedule import get_schedule
from librus_apix.announcements import get_announcements
from librus_apix.completed_lessons import get_completed, get_max_page_number
from librus_apix.get_token import AuthorizationError, Token
from librus_apix.grades import TokenError
from librus_apix.student_information import get_student_information
from handle_classes import *
from datetime import datetime
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


def fetch_student_data(token):
    token = create_token(token)
    try:
        student_data = get_student_information(token)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), student_data.__dict__


def fetch_completed_lessons(token, date_from, date_to, page=0):
    token = create_token(token)
    try:
        completed_lessons = get_completed(token, date_from, date_to, page)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_completed_lessons(completed_lessons)


def fetch_todays_completed_lessons(token):
    today_date = datetime.now().strftime("%Y-%m-%d")
    return fetch_completed_lessons(token, today_date, today_date)


def fetch_announcements(token):
    token = create_token(token)
    try:
        announcements = get_announcements(token)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_announcements(announcements)


def get_recipient_groups(token):
    token = create_token(token)
    try:
        groups = recipient_groups(token)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), groups


def get_group_recipients(token, group):
    token = create_token(token)
    try:
        recipients = get_recipients(token, group.decode("utf-8"))
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except (ParseError, ValueError) as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), recipients


def send_message(token: Token, title, content, recipients):
    token = create_token(token)
    title = title.decode("utf-8")
    content = content.decode("utf-8")
    recipients = list(map(lambda id: id.decode("utf-8"), recipients))
    try:
        was_sent, msg = send_msg(token, title, content, recipients)
        if was_sent == False:
            return Atom("send_error".encode("utf-8")), str(msg)
        return Atom("ok".encode("utf-8")), str(msg)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)


def fetch_sent_messages(token, page):
    token = create_token(token)
    try:
        messages = get_sent(token, int(page))
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_messages(messages)


def fetch_messages(token, page):
    token = create_token(token)
    try:
        messages = get_recieved(token, int(page))
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_messages(messages)


def fetch_all_messages(token):
    token = create_token(token)
    try:
        pages = get_max_page_messages(token)
        messages = []
        for page in range(0, pages + 1):
            messages += get_recieved(token, page)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_messages(messages)


def fetch_message_content(token, id):
    token = create_token(token)
    try:
        content = message_content(token, id.decode("utf-8"))
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), content


def fetch_schedule(token, year, month):
    token = create_token(token)
    try:
        schedule = get_schedule(token, month, year, True)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_schedule(schedule)


def fetch_grades(token, semester, opt):
    try:
        subjects, semester_grades, descriptive = get_grades(token, opt)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), [
        handle_grades(subjects[int(semester)]),
        handle_semester_grades(semester_grades),
    ]


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
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_homework(homework)


def fetch_homework_details(token, id):
    token = create_token(token)
    try:
        details = homework_detail(token, id.decode("utf-8"))
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), details


def fetch_attendance(token, semester, opt="all"):
    try:
        attendance = get_attendance(token, opt)
    except TokenError as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as parse_err:
        return Atom("error".encode("utf-8")), str(parse_err)
    return Atom("ok".encode("utf-8")), handle_attendance(attendance[int(semester)])


def fetch_all_attendance(token, semester):
    token = create_token(token)
    return fetch_attendance(token, semester, "all")


def fetch_week_attendance(token, semester):
    token = create_token(token)
    return fetch_attendance(token, semester, "week")


def fetch_new_attendance(token, semester):
    token = create_token(token)
    return fetch_attendance(token, semester, "last_login")


def fetch_attendance_frequency(token):
    token = create_token(token)
    try:
        frequency = get_attendance_frequency(token)
    except (TokenError, AuthorizationError) as token_err:
        return Atom("token_error".encode("utf-8")), str(token_err)
    except ParseError as err:
        return Atom("error".encode("utf-8")), str(err)
    return Atom("ok".encode("utf-8")), frequency


def keep_token_alive(token):
    token = create_token(token)
    try:
        if token.get(token.ANNOUNCEMENTS_URL).status_code == 200:
            token.refresh_oauth()
        else:
            return Atom("error".encode("utf-8")), str(err)
        return Atom("ok".encode("utf-8"))
    except AuthorizationError:
        return Atom("error".encode("utf-8")), str(err)


def refresh_oauth(token):
    token = create_token(token)
    try:
        token.refresh_oauth()
        return Atom("ok".encode("utf-8"))
    except AuthorizationError:
        return Atom("error".encode("utf-8")), str(err)
