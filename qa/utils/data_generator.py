import secrets
import string


def generate_password(length=12):
    allowed_symbols = "!@#$%^&*()_+-[]{};':\"\\|,.<>/?"
    chars = string.ascii_letters + string.digits + allowed_symbols

    password = (
        secrets.choice(string.ascii_lowercase) +
        secrets.choice(string.ascii_uppercase) +
        secrets.choice(string.digits) +
        secrets.choice(allowed_symbols) +
        ''.join(secrets.choice(chars) for _ in range(length - 4))
    )
    return ''.join(secrets.SystemRandom().sample(password, len(password)))


def generate_email():
    return f"user_{secrets.token_hex(4)}@test.com"
