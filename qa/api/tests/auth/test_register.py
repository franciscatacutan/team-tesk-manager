import pytest
import allure
from qa.api.test_data.register_params import setup, register, register_exceptions
from qa.api.models.auth_models import RegisterErrorResponse
from qa.utils.test_helpers import assert_error_response, set_report_parameters
from qa.config.settings import ERROR_TAG, SUCCESS_TAG
from qa.config.settings import BASE_API_URL
from qa.api.clients.auth_client import AuthClient

@allure.parent_suite("API Tests")
@allure.suite("Auth API Tests")
@allure.sub_suite("Register API Tests")
@allure.tag("api")
class TestRegister:
    client = AuthClient(BASE_API_URL)

    @pytest.fixture(scope="class", autouse=True)
    def user_setup(self):
        with allure.step("Setup registered user"):
            response = self.client.register(setup["register_user"])
        assert response.status_code == 200

    @pytest.mark.parametrize("test_name", register.keys())
    @allure.title("{test_name}")
    @allure.tag(SUCCESS_TAG)
    def test_register_successful(
        self, test_name
    ):
        test_data = register[test_name]

        set_report_parameters(test_data["request"])
        with allure.step("Send register request"):
            response = self.client.register(test_data["request"])

        assert response.status_code == 200
        assert "token" in response.json()

        with allure.step("Get user details"):
            # TODO to add after get user api is created
            pass

    @pytest.mark.parametrize("test_name", register_exceptions.keys())
    @allure.title("{test_name}")
    @allure.tag(ERROR_TAG)
    def test_register_exceptions(
        self, test_name
    ):
        test_data = register_exceptions[test_name]

        set_report_parameters(test_data["request"])
        with allure.step("Send register request"):
            response = self.client.register(test_data["request"])

        assert response.status_code == test_data["response"]["status"]
        assert_error_response(
            actual=RegisterErrorResponse(**response.json()), expected=test_data["response"]
        )
