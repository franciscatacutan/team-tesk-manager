from qa.api.clients.base_client import BaseClient
from qa.api.models.auth_models import LoginRequest
from qa.utils.test_helpers import attach_api_data


class AuthClient(BaseClient):

    def register(self, request: dict, method=None, attach=True):
        if hasattr(request, "model_dump"):
            request = request.model_dump()

        if method:
            response = self.send_request(
                method=method, endpoint="/api/auth/register", json=request
            )
        else:
            response = self.post("/api/auth/register", json=request)

        if attach:
            attach_api_data(request, response)

        return response

    def login(self, request: LoginRequest | dict, method=None, attach=True):
        if hasattr(request, "model_dump"):
            request = request.model_dump()

        if method:
            response = self.send_request(
                method=method, endpoint="/api/auth/login", json=request
            )
        else:
            response = self.post("/api/auth/login", json=request)

        if attach:
            attach_api_data(request, response)
        return response
