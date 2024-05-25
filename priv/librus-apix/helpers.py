import os
from typing import Dict, List, Tuple

from erlport.erlang import set_decoder, set_encoder
from erlport.erlterms import Atom
from handle_classes import *
from librus_apix.client import Client, Token, new_client


def extract_grades(grades):
    return [grade for subject in list(grades.values()) for grade in subject]


def setup_data_types():
    set_encoder(token_encoder)
    set_decoder(token_decoder)
    return Atom("ok".encode("utf-8"))


def token_encoder(value: Tuple) -> Dict:
    if not isinstance(value, Tuple):
        return value
    if len(value) == 1 and isinstance(value[0], Token):
        token = value[0].API_Key.encode("utf-8")
        return {Atom("token".encode("utf-8")): token}
    elif isinstance(value[0], Token):
        token = value[0].API_Key.encode("utf-8")
        return {
            Atom("token".encode("utf-8")): token,
            Atom("data".encode("utf-8")): value[1:],
        }
    elif len(value) >= 2 and isinstance(value[0], Atom) and isinstance(value[1], Token):
        token = value[1].API_Key.encode("utf-8")
        return {value[0]: token, Atom("data".encode("utf-8")): value[2:]}

    elif isinstance(value[0], Atom) and isinstance(value[1], str) and len(value) > 1:
        return {
            value[0]: value[1].encode("utf-8"),
            Atom("data".encode("utf-8")): value[1:],
        }
    else:
        return value


def token_decoder(value):
    if isinstance(value, int) or isinstance(value, float):
        return value
    return value.decode("utf-8")


def create_client(token_key: str) -> Client:
    proxy = {}
    elixirus_proxy = os.getenv("ELIXIRUS_PROXY")
    if elixirus_proxy is not None and os.getenv("USE_PROXY") == "yes":
        proxy = {"https": elixirus_proxy, "http": elixirus_proxy}
    token = Token(API_Key=token_key)
    return new_client(token=token, proxy=proxy)


def brew_elixir_list(data: List, safe: bool = True, exclude: List[str] = []) -> List:
    potion = []
    for item in data:
        if isinstance(item, list):
            potion.append(brew_elixir_list(item, safe, exclude))
        elif isinstance(item, str):
            potion.append(item.encode("utf-8"))
        elif isinstance(item, dict):
            potion.append(brew_elixir_dict(item, safe, exclude))
        else:
            potion.append(item)
    return potion


def brew_elixir_dict(data: Dict, safe: bool = True, exclude: List[str] = []):
    potion = {}
    for key, val in data.items():
        if isinstance(val, list):
            if key in exclude:
                value = brew_elixir_list(val, safe=True, exclude=exclude)
            else:
                value = brew_elixir_list(val, safe, exclude=exclude)
        elif isinstance(val, str):
            value = val.encode("utf-8")
        elif isinstance(val, dict):
            if key in exclude:
                value = brew_elixir_dict(val, safe=True, exclude=exclude)
            else:
                value = brew_elixir_dict(val, safe, exclude)
        else:
            value = val
        if safe is True and isinstance(key, str):
            key = key.encode("utf-8")
            potion[key] = value
        elif (
            safe is False and isinstance(key, str) and not key[0].isupper()
        ) or key in exclude:
            potion[Atom(key.encode("utf-8"))] = value
        else:
            if isinstance(key, str):
                key = key.encode("utf-8")

            potion[key] = value
    return potion
