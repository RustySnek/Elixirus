from librus_apix.get_token import get_token, Token
from librus_apix.grades import get_grades
from librus_apix.exceptions import TokenError
from erlport.erlterms import Atom

def handle_token(u, p):
    try:
        token = get_token(u,p)
        return Atom("ok".encode("utf-8")), token.API_Key
    except Exception as ex:
        return Atom("error".encode("utf-8")), str(ex)

def handle_semester_grades(avgs):
    return {subject: list(map(lambda grade: grade.gpa, averages)) for subject, averages in avgs.items()}

def handle_homework(homework):
    return [h.__dict__ for h in homework]

def handle_completed_lessons(completed_lessons):
    return [lesson.__dict__ for lesson in completed_lessons]

def handle_schedule(schedule):
    return {day: [event.__dict__ for event in schedule[day]] for day in schedule}

def handle_timetable(timetable):
    return [[period.__dict__ for period in weekday] for weekday in timetable]

def handle_announcements(announcements):
    return [ann.__dict__ for ann in announcements]

def handle_messages(messages):
    return [msg.__dict__ for msg in messages]

def handle_attendance(attendance):
    return [att.__dict__ for att in attendance]

def handle_grades(subjects):
    return {subject: [dict(grade.__dict__, value=grade.value) for grade in subjects[str(subject)]] for subject in subjects}
