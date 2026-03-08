import pytest
import json
import allure
from qa.api.models.common_models import ErrorResponse


def load_test_cases(data):
    return [
        pytest.param({"name": name, **case}, id=name) for name, case in data.items()
    ]


def attach_api_data(request_payload, response):
    method = response.request.method
    url = response.request.url

    request_headers = "\n".join(
        f"{k}: {v}" for k, v in response.request.headers.items()
    )

    try:
        request_body = json.dumps(request_payload, indent=2)
    except Exception:
        request_body = str(request_payload)

    request_text = f"{method} {url}\n\nHeaders:\n{request_headers}\n\nBody:\n{request_body}".strip()

    try:
        response_body = json.dumps(response.json(), indent=2)
    except Exception:
        response_body = response.text

    response_headers = "\n".join(f"{k}: {v}" for k, v in response.headers.items())

    response_text = f"Status: {response.status_code}\n\nHeaders:\n{response_headers}\n\nBody:\n{response_body}".strip()

    allure.attach(
        request_text, name="request", attachment_type=allure.attachment_type.TEXT
    )
    allure.attach(
        response_text, name="response", attachment_type=allure.attachment_type.TEXT
    )


def assert_error_response(actual: ErrorResponse, expected: dict):
    for key, value in expected.items():
        actual_value = getattr(actual, key)
        assert actual_value == value, f"{key}: expected {value}, got {actual_value}"
