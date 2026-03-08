import pytest
from qa.config.settings import BASE_API_URL
from qa.api.clients.auth_client import AuthClient
from qa.utils.data_generator import generate_email, generate_password


@pytest.fixture
def auth_client():
    return AuthClient(BASE_API_URL)


@pytest.fixture
def registered_user(auth_client):
    test_user = {
        "firstName": "Test",
        "lastName": "User",
        "email": generate_email(),
        "password": generate_password()
    }
    response = auth_client.register(test_user, attach=False)

    assert response.status_code == 200, (
        f"Registration failed. "
        f"Status: {response.status_code}, "
        f"Body: {response.text}"
    )

    return test_user
