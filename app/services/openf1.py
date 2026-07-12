import requests

BASE_URL = "https://api.openf1.org/v1"

def get_race_sessions(year: int):
    url = f"{BASE_URL}/sessions"
    params = {
        "year": year,
        "session_name": "Race"
    }
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()



def get_laps(session_key: int):
    url = f"{BASE_URL}/laps"
    params = {
        "session_key": session_key
    }
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()

def get_session_result(session_key: int):
    url = f"{BASE_URL}/session_result"
    params = {
        "session_key": session_key
    }
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()

def get_drivers(session_key: int):
    url = f"{BASE_URL}/drivers"
    params = {
        "session_key": session_key
    }
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()