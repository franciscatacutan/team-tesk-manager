import requests


class BaseClient:

    def __init__(self, base_api_url):
        self.base_url = base_api_url
        self.token = None

    def set_token(self, token):
        self.token = token

    def _headers(self):
        headers = {
            "Content-Type": "application/json"
        }

        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        return headers

    def get(self, endpoint):
        return requests.get(
            f"{self.base_url}{endpoint}",
            headers=self._headers()
        )

    def post(self, endpoint, json=None):
        return requests.post(
            f"{self.base_url}{endpoint}",
            json=json,
            headers=self._headers()
        )

    def put(self, endpoint, json=None):
        return requests.put(
            f"{self.base_url}{endpoint}",
            json=json,
            headers=self._headers()
        )

    def delete(self, endpoint):
        return requests.delete(
            f"{self.base_url}{endpoint}",
            headers=self._headers()
        )

    def send_request(self, method, endpoint, json=None):
        return requests.request(
            method=method,
            url=f"{self.base_url}{endpoint}",
            json=json,
            headers=self._headers()
        )
