from qa.api.clients.base_client import BaseClient


class AuthClient(BaseClient):

    def register(self, user_data):
        return self.post("/api/auth/register", json=user_data)

    def login(self, email, password):
        return self.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": password
            }
        )
