import re

def is_valid_email(email: str) -> bool:
    return bool(re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email or ''))

def is_object_id(value: str) -> bool:
    return bool(re.match(r'^[a-f\d]{24}$', str(value or ''), re.IGNORECASE))
