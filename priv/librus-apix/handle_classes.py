import os

from erlport.erlterms import Atom
from librus_apix.attendance import Tuple
from librus_apix.client import Token, new_client
from librus_apix.notifications import NotificationData
from librus_apix.schedule import Union


def create_token(u, p) -> Tuple[Atom, Union[Token, str]]:
    proxy = {}
    elixirus_proxy = os.getenv("ELIXIRUS_PROXY")
    if elixirus_proxy is not None and os.getenv("USE_PROXY") == "yes":
        proxy = {"https": elixirus_proxy, "http": elixirus_proxy}
    try:
        client = new_client(proxy=proxy)
        token: Token = client.get_token(u, p)
        return Atom("ok".encode("utf-8")), token
    except Exception as ex:
        return Atom("error".encode("utf-8")), str(ex)


def handle_semester_grades(avgs):
    return {
        subject: list(map(lambda grade: grade.gpa, averages))
        for subject, averages in avgs.items()
    }


def handle_homework(homework):
    return [h.__dict__ for h in homework]


def handle_completed_lessons(completed_lessons):
    return [lesson.__dict__ for lesson in completed_lessons]


def handle_schedule(schedule):
    return {day: [event.__dict__ for event in schedule[day]] for day in schedule}


def handle_recent_schedule(recent_schedule):
    return [event.__dict__ for event in recent_schedule]


def handle_timetable(timetable):
    return [[period.__dict__ for period in weekday] for weekday in timetable]


def handle_announcements(announcements):
    return [ann.__dict__ for ann in announcements]


def handle_messages(messages):
    return [msg.__dict__ for msg in messages]


def handle_attendance(attendance):
    return [att.__dict__ for att in attendance]


def handle_grades(subjects):
    return {
        subject: [
            dict(grade.__dict__, value=grade.value) for grade in subjects[str(subject)]
        ]
        for subject in subjects
    }


def handle_notification_data(notification: NotificationData):
    notification_dict = {}
    notification_dict["grades"] = handle_grades(notification.grades)
    notification_dict["attendance"] = handle_attendance(notification.attendance)
    notification_dict["messages"] = handle_messages(notification.messages)
    notification_dict["announcements"] = handle_announcements(
        notification.announcements
    )
    notification_dict["schedule"] = handle_recent_schedule(notification.schedule)
    notification_dict["homework"] = handle_homework(notification.homework)
    return notification_dict
