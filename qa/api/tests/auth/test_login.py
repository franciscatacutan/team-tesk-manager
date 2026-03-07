class TestLogin:

    def test_login_with_valid_credentials(self, auth_client, registered_user):
        # Given
        valid_email = registered_user["email"]
        valid_password = registered_user["password"]

        # When
        response = auth_client.login(valid_email, valid_password)
        print(response.json())

        # Then
        assert response.status_code == 200
        assert "token" in response.json()

    def test_login_with_incorrect_password(self, auth_client, registered_user):
        # Given
        email = registered_user["email"]
        incorrect_password = "wrongpassword"

        # When
        response = auth_client.login(email, incorrect_password)
        print(response.json())

        # Then
        assert response.status_code == 401
