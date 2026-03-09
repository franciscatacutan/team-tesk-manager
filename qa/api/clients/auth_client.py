from qa.api.clients.base_client import BaseClient
from qa.api.models.auth_models import LoginRequest
from qa.utils.test_helpers import attach_api_data
from qa.config.settings import ENDPOINTS


class AuthClient(BaseClient):

    def register(self, request: dict, method=None, attach=True):
        if hasattr(request, "model_dump"):
            request = request.model_dump()

        if method:
            response = self.send_request(
                method=method, endpoint=ENDPOINTS["register"], json=request
            )
        else:
            response = self.post(ENDPOINTS["register"], json=request)

        if attach:
            attach_api_data(request, response)

        return response

    def login(self, request: LoginRequest | dict, method=None, attach=True):
        if hasattr(request, "model_dump"):
            request = request.model_dump()

        if method:
            response = self.send_request(
                method=method, endpoint=ENDPOINTS["login"], json=request
            )
        else:
            response = self.post(ENDPOINTS["login"], json=request)

        if attach:
            attach_api_data(request, response)
        return response
