from qa.utils.data_generator import generate_email, generate_password
from qa.api.models.auth_models import RegisterRequest

setup = {
    "register_user": RegisterRequest(
        firstName="Test",
        lastName="User",
        email=generate_email(),
        password=generate_password(),
    )
}

register = {
    "Register with unique email": {
        "request": RegisterRequest(
            firstName="Test",
            lastName="User",
            email=generate_email(),
            password=generate_password(),
        )
    },
    "Register with whitespaces": {
        "request": RegisterRequest(
            firstName=" Test ",
            lastName=" User ",
            email=generate_email(),
            password=f"{ generate_password() }",
        )
    },
}

register_exceptions = {
    "Payload is null": {
        "request": None,
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "Request body is missing or malformed",
        },
    },
    "Missing firstName": {
        "request": {
            "lastName": "User",
            "email": generate_email(),
            "password": generate_password(),
        },
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "firstName: required field",
        },
    },
    "firstName is null": {
        "request": {
            "firstName": None,
            "lastName": "User",
            "email": generate_email(),
            "password": generate_password(),
        },
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "firstName: must not be blank",
        },
    },
    "firstName is not a string": {
        "request": {
            "firstName": 1,
            "lastName": "User",
            "email": generate_email(),
            "password": generate_password(),
        },
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "firstName: must be a string",
        },
    },
    "Missing lastName": {
        "request": {
            "firstName": "Test",
            "email": generate_email(),
            "password": generate_password(),
        },
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "lastName: required field",
        },
    },
    "lastName is null": {
        "request": {
            "firstName": "Test",
            "lastName": None,
            "email": generate_email(),
            "password": generate_password(),
        },
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "lastName: must not be blank",
        },
    },
    "lastName is not a string": {
        "request": {
            "firstName": "Test",
            "lastName": 1,
            "email": generate_email(),
            "password": generate_password(),
        },
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "lastName: must be a string",
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
        "request": RegisterRequest(
            firstName="Test",
            lastName="User",
            email="invalidemail",
            password=generate_password(),
        ),
        "response": {
            "status": 422,
            "error": "VALIDATION_ERROR",
            "message": "email: value is not a valid email address",
        },
    },
    "Missing password": {
        "request": {"email": generate_email()},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "password: required field",
        },
    },
    "Password is null": {
        "request": {"email": generate_email(), "password": None},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "password: must not be blank",
        },
    },
    "Password is not a string": {
        "request": {"email": generate_email(), "password": None},
        "response": {
            "status": 400,
            "error": "INVALID_REQUEST",
            "message": "password: must be a string",
        },
    },
    "Password is less than minimum length": {
        "request": RegisterRequest(
            firstName="Test",
            lastName="User",
            email=generate_email(),
            password="Short1!",
        ),
        "response": {
            "status": 422,
            "error": "VALIDATION_ERROR",
            "message": "password: Password should be at least 8 characters",
        },
    },
    "Password is not a strong password": {
        "request": RegisterRequest(
            firstName="Test",
            lastName="User",
            email=generate_email(),
            password="notastrongpassword",
        ),
        "response": {
            "status": 422,
            "error": "VALIDATION_ERROR",
            "message": "password: Password must contain upper, lower, digit, and special character",
        },
    },
    "Register with an email already registered": {
        "request": RegisterRequest(
            firstName="Test",
            lastName="User",
            email=setup["register_user"].email,
            password=generate_password(),
        ),
        "response": {
            "status": 409,
            "error": "EMAIL_ALREADY_EXISTS",
            "message": "Email is already in use",
        },
    },
    "Incorrect request method": {
        "method": "GET",
        "request": RegisterRequest(
            firstName="Test",
            lastName="User",
            email=generate_email(),
            password=generate_password(),
        ),
        "response": {
            "status": 405,
            "error": "METHOD_NOT_ALLOWED",
            "message": "Request method 'GET' not supported",
        },
    },
}
