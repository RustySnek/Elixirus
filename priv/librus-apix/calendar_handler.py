from collections import defaultdict
from urllib.parse import quote
import requests
from datetime import datetime, timedelta

HEAD = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
}

BASE = "https://clients6.google.com/calendar/v3/calendars/"
time_zone = "timeZone=Europe%2FWarsaw"
cest = "T01:00:00+01:00"
public_key = "AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs"


def get_google_calendar_events(calendar_id, date_min: bytes, date_max: bytes):
    events = defaultdict(list)
    date_min = quote(date_min.decode("utf-8") + cest)
    date_max = quote(date_max.decode("utf-8") + cest)
    default_suffix = "@group.calendar.google.com"
    calendar_id = str(calendar_id.decode("utf-8"))
    if "@" not in calendar_id:
        calendar_id = quote(calendar_id + default_suffix)
    r = requests.get(
        f"{BASE}{calendar_id}/events?key={public_key}&timeZone={time_zone}&timeMin={date_min}&timeMax={date_max}",
        headers=HEAD,
    )
    # someday do error handling lol
    items = r.json().get("items", [])
    for i in items:
        summary = i.get("summary", "")
        description = i.get("description", "")
        start_date = i.get("start", {}).get("date", None)
        end_date = i.get("end", {}).get("date", None)
        start_time = ""
        end_time = ""
        if start_date is None:
            date_time = i.get("start", {}).get("dateTime", None)
            if date_time is not None:
                start_date, start_time = date_time.split("T")
                start_time = start_time.split("+")[0]
            else:
                start_date, end_time = ["", ""]
        if end_date is None:
            date_time = i.get("end", {}).get("dateTime", None)
            if date_time is not None:
                end_date, end_time = date_time.split("T")
                end_time = end_time.split("+")[0]
            else:
                end_date, end_time = ["", ""]
        if end_time == "":
            end_date = datetime.strptime(end_date, "%Y-%m-%d") - timedelta(days=1)
            end_date = end_date.strftime("%Y-%m-%d")
        events[f"{start_date}|{end_date}"].append(
            {
                "summary": summary,
                "description": description,
                "start_date": start_date,
                "end_date": end_date,
                "start_time": start_time,
                "end_time": end_time,
            }
        )
    return dict(events)
