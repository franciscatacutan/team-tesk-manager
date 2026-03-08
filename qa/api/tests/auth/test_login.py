import pytest
import allure
from qa.api.test_data.auth_test_data import login, login_exceptions
from qa.api.models.auth_models import LoginErrorResponse, LoginRequest
from qa.utils.test_helpers import load_test_cases, assert_error_response
from qa.config.settings import ERROR_TAG, SUCCESS_TAG


@allure.feature("Authentication")
@allure.tag("api")
class TestLogin:

    @pytest.mark.parametrize("test_data", load_test_cases(login))
    @allure.title("{param_id}")
    @allure.tag(SUCCESS_TAG)
    def test_login_successful(
        self, auth_client, registered_user, test_data
    ):
        if "request" not in test_data:
            # Generate login data dynamically for the "Login as a user" case
            test_data["request"] = LoginRequest(
                email=registered_user["email"], password=registered_user["password"]
            )

        with allure.step("Send login request"):
            response = auth_client.login(test_data["request"])

        assert response.status_code == 200
        assert "token" in response.json()

    @pytest.mark.parametrize("test_data", load_test_cases(login_exceptions))
    @allure.title("{param_id}")
    @allure.tag(ERROR_TAG)
    def test_login_exceptions(
        self, auth_client, registered_user, test_data
    ):
        if "request" not in test_data:
            # Generate login data dynamically for the "Login as a user" case
            test_data["request"] = LoginRequest(
                email=registered_user["email"], password=registered_user["password"]
            )

        with allure.step("Send login request"):
            response = auth_client.login(test_data["request"])

        assert response.status_code == test_data["response"]["status"]
        assert_error_response(
            actual=LoginErrorResponse(**response.json()), expected=test_data["response"]
        )
