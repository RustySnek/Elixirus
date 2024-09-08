from dataclasses import Field, dataclass, field
from typing import Any, Dict, List, Tuple

from erlport.erlang import set_decoder, set_encoder
from erlport.erlterms import Atom, Map
from librus_apix.announcements import Announcement
from librus_apix.attendance import Attendance
from librus_apix.client import Client, Token, new_client
from librus_apix.completed_lessons import Lesson
from librus_apix.exceptions import AuthorizationError
from librus_apix.grades import Gpa, Grade
from librus_apix.homework import Homework
from librus_apix.messages import Message, MessageData
from librus_apix.schedule import Event, schedule_detail
from librus_apix.student_information import StudentInformation
from librus_apix.timetable import Period
from venomous import (
    VenomousTrait,
    decode_basic_types_strings,
    encode_basic_type_strings,
)


@dataclass
class AttendanceStruct(VenomousTrait, Attendance):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Attendance")


@dataclass
class EventStruct(VenomousTrait, Event):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Event")


@dataclass
class HomeworkStruct(VenomousTrait, Homework):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Homework")


@dataclass
class LessonStruct(VenomousTrait, Lesson):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Lesson")


@dataclass
class MessageStruct(VenomousTrait, Message):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Message")


@dataclass
class MessageDataStruct(VenomousTrait, MessageData):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.MessageData")


@dataclass
class PeriodStruct(VenomousTrait, Period):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Period")


@dataclass
class StudentInformationStruct(VenomousTrait, StudentInformation):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.StudentInformation")


@dataclass
class AnnouncementStruct(VenomousTrait, Announcement):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Announcement")

    def __post_init__(self) -> None:
        Announcement.__init__(self)


@dataclass
class TokenStruct(VenomousTrait, Token):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Token")

    def __post_init__(self) -> None:
        Token.__init__(self)


@dataclass
class ClientStruct(VenomousTrait, Client):
    token: Any = field(default_factory=Token)
    proxy: Dict[str, str] = field(default_factory=dict)
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Client")

    @staticmethod
    def from_dict(dic, structs={}):
        self = VenomousTrait.from_dict.__func__(ClientStruct, dic, structs)
        Client.__init__(self, self.token)
        return self

    def into_erl(self) -> Dict:
        return {
            Atom(b"__struct__"): self.__struct__,
            Atom(b"token"): self.token,
            Atom(b"proxy"): self.proxy,
        }

    def __post_init__(self) -> None:
        Client.__init__(self, self.token)


@dataclass
class GradeStruct(VenomousTrait, Grade):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Grade")


@dataclass
class GpaStruct(VenomousTrait, Gpa):
    __struct__: Atom = Atom(b"Elixir.Elixirus.Types.Gpa")


venomous_structs = {
    Atom(b"Elixir.Elixirus.Types.Token"): TokenStruct,
    Atom(b"Elixir.Elixirus.Types.Client"): ClientStruct,
    Atom(b"Elixir.Elixirus.Types.Announcement"): AnnouncementStruct,
    Atom(b"Elixir.Elixirus.Types.Grade"): GradeStruct,
    Atom(b"Elixir.Elixirus.Types.Gpa"): GpaStruct,
    Atom(b"Elixir.Elixirus.Types.Attendance"): AttendanceStruct,
    Atom(b"Elixir.Elixirus.Types.Event"): EventStruct,
    Atom(b"Elixir.Elixirus.Types.Homework"): HomeworkStruct,
    Atom(b"Elixir.Elixirus.Types.Lesson"): LessonStruct,
    Atom(b"Elixir.Elixirus.Types.Message"): MessageStruct,
    Atom(b"Elixir.Elixirus.Types.MessageData"): MessageDataStruct,
    Atom(b"Elixir.Elixirus.Types.Period"): PeriodStruct,
    Atom(b"Elixir.Elixirus.Types.StudentInformation"): StudentInformationStruct,
}


def get_client_from_credentials(
    username: str, password: str, proxy: Dict[str, str]
) -> Tuple[Atom, Client | str]:
    c = new_client(proxy=proxy)
    try:
        c.get_token(username, password)
        return Atom(b"ok"), c
    except AuthorizationError as e:
        return Atom(b"error"), str(e)


def get_client(token: str, proxy: Dict[str, str]) -> Client:
    return new_client(token=Token(API_Key=token), proxy=proxy)


def encoder(value: Any) -> Any:
    if isinstance(value, dict):
        return {encoder(key): encoder(value) for key, value in value.items()}
    if isinstance(value, (list, tuple, set)):
        return type(value)(encoder(item) for item in value)

    if isinstance(value, Announcement):
        return AnnouncementStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Token):
        return TokenStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Client):
        return ClientStruct.from_dict(
            {"token": encoder(value.token), "proxy": value.proxy}
        ).into_erl()
    if isinstance(value, Grade):
        return GradeStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Gpa):
        return GpaStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Attendance):
        return AttendanceStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Event):
        return EventStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Homework):
        return HomeworkStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Lesson):
        return LessonStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Message):
        return MessageStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, MessageData):
        return MessageDataStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, Period):
        return PeriodStruct.from_dict(value.__dict__).into_erl()
    if isinstance(value, StudentInformation):
        return StudentInformationStruct.from_dict(value.__dict__).into_erl()

    return encode_basic_type_strings(value)


def test():
    return Atom(b"error"), "test"


def decoder(value: Any) -> Any:
    if isinstance(value, (Map, dict)):
        if struct := value.get(Atom(b"__struct__")):
            if struct in venomous_structs:
                return venomous_structs[struct].from_dict(value, venomous_structs)
        return {decoder(key): decoder(val) for key, val in value.items()}
    elif isinstance(value, (set, list, tuple)):
        return type(value)(decoder(_val) for _val in value)

    return decode_basic_types_strings(value)


def setup_data_types():
    set_encoder(encoder)
    set_decoder(decoder)
    return Atom("ok".encode("utf-8"))
