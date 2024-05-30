from typing import Dict

from erlport.erlterms import Atom
from fetchers import sanitize_fetch
from handle_classes import handle_notification_data
from helpers import brew_elixir_dict, brew_elixir_list, create_client
from librus_apix.client import Client
from librus_apix.notifications import (
    NotificationData,
    NotificationIds,
    get_initial_notification_data,
    get_new_notification_data,
)


def fetch_initial_notifications(token):
    client: Client = create_client(token)
    status, initial_notifications = sanitize_fetch(
        get_initial_notification_data, client
    )
    if status == "ok":
        notifications, ids = initial_notifications
        return Atom(status.encode("utf-8")), [
            brew_elixir_dict(
                handle_notification_data(notifications), safe=False, exclude=["data"]
            ),
            brew_elixir_dict(ids.__dict__, safe=False),
        ]
    else:
        return status, initial_notifications


def fetch_new_notifications(token, payload: Dict):
    seen_ids = NotificationIds(
        grades=payload["grades"],
        attendance=payload["attendance"],
        messages=payload["messages"],
        announcements=payload["announcements"],
        schedule=payload["schedule"],
        homework=payload["homework"],
    )
    client: Client = create_client(token)

    status, notifications = sanitize_fetch(get_new_notification_data, client, seen_ids)

    if status == "ok":
        notifications, ids = notifications
        return Atom(status.encode("utf-8")), [
            brew_elixir_dict(
                handle_notification_data(notifications), safe=False, exclude=["data"]
            ),
            brew_elixir_dict(ids.__dict__, safe=False),
        ]
    else:
        return status, notifications
