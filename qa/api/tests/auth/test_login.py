import pytest
import allure
from qa.api.test_data.login_params import login, login_exceptions
from qa.api.models.auth_models import LoginErrorResponse, LoginRequest
from qa.utils.test_helpers import assert_error_response
from qa.config.settings import ERROR_TAG, SUCCESS_TAG
from qa.config.settings import BASE_API_URL
from qa.api.clients.auth_client import AuthClient

@allure.parent_suite("API Tests")
@allure.suite("Auth API Tests")
@allure.sub_suite("Login API Tests")
@allure.tag("api")
class TestLogin:
    client = AuthClient(BASE_API_URL)

    @pytest.mark.parametrize("test_name", login.keys())
    @allure.title("{test_name}")
    @allure.tag(SUCCESS_TAG)
    def test_login_successful(
        self, registered_user, test_name
    ):
        test_data = login[test_name]
        if "request" not in test_data:
            # Generate login data dynamically for the "Login as a user" case
            test_data["request"] = LoginRequest(
                email=registered_user["email"], password=registered_user["password"]
            )

        # set_report_parameters(test_data)
        with allure.step("Send login request"):
            response = self.client.login(test_data["request"])

        assert response.status_code == 200
        assert "token" in response.json()

    @pytest.mark.parametrize("test_name", login_exceptions.keys())
    @allure.title("{test_name}")
    @allure.tag(ERROR_TAG)
    def test_login_exceptions(
        self, registered_user, test_name
    ):
        test_data = login_exceptions[test_name]
        if "request" not in test_data:
            # Generate login data dynamically for the "Login as a user" case
            test_data["request"] = LoginRequest(
                email=registered_user["email"], password=registered_user["password"]
            )

        # set_report_parameters(test_data)
        with allure.step("Send login request"):
            response = self.client.login(
                request=test_data["request"], method=test_data.get("method", None)
            )

        assert response.status_code == test_data["response"]["status"]
        assert_error_response(
            actual=LoginErrorResponse(**response.json()), expected=test_data["response"]
        )
