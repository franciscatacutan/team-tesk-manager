from qa.utils.data_generator import generate_email, generate_password
from qa.config.settings import SUPER_USER_EMAIL, SUPER_USER_PASSWORD
from qa.api.models.auth_models import LoginRequest


login = {
    "Login as a user": {},  # login data will be generated dynamically in the test
    "Login as a super user": {
        "request": LoginRequest(email=SUPER_USER_EMAIL, password=SUPER_USER_PASSWORD)
    },
}

login_exceptions = {
    "Payload is null": {
        "request": None,
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "Request body is missing or malformed",
        },
    },
    "Missing email": {
        "request": {"password": generate_password()},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "email: required field",
        },
    },
    "Email is null": {
        "request": {"email": None, "password": generate_password()},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "email: must not be blank",
        },
    },
    "Email is not a string": {
        "request": {"email": None, "password": generate_password()},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "email: must be a string",
        },
    },
    "Email is not a valid email": {
        "request": LoginRequest(email="invalidemail", password=generate_password()),
        "response": {
            "status": 422,
            "error": "VALIDATION_ERROR",
            "message": "email: value is not a valid email address",
        },
    },
    "Missing password": {
        "request": {"email": "test_auth_user@email.com"},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "password: required field",
        },
    },
    "Password is null": {
        "request": {"email": "test_auth_user@email.com", "password": None},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "password: must not be blank",
        },
    },
    "Password is not a string": {
        "request": {"email": "test_auth_user@email.com", "password": None},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "password: must be a string",
        },
    },
    "Password is less than minimum length": {
        "request": LoginRequest(email="test_auth_user@email.com", password="Short1!"),
        "response": {
            "status": 422,
            "error": "VALIDATION_ERROR",
            "message": "password: Password should be at least 8 characters",
        },
    },
    "Password is not a strong password": {
        "request": LoginRequest(
            email="test_auth_user@email.com", password="notastrongpassword"
        ),
        "response": {
            "status": 422,
            "error": "VALIDATION_ERROR",
            "message": "password: Password must contain upper, lower, digit, and special character",
        },
    },
    "User does not exist": {
        "request": LoginRequest(
            email="test_auth_user@email.com", password=generate_password()
        ),
        "response": {
            "status": 401,
            "error": "INVALID_CREDENTIALS",
            "message": "Invalid Credentials",
        },
    },
    "Incorrect request method": {
        "method": "GET",
        "response": {
            "status": 405,
            "error": "METHOD_NOT_ALLOWED",
            "message": "Request method 'GET' not supported",
        },
    },
}
