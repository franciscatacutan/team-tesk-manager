import secrets
import string


def generate_password(length=12):
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(chars) for _ in range(length))


def generate_email():
    return f"user_{secrets.token_hex(4)}@test.com"
