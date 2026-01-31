# team-tesk-manager
""
# Environment Variables

Sensitive backend configuration (such as database credentials and JWT secrets) is provided via OS-level environment variables and injected into the application using application.yml placeholders.

This approach prevents secrets from being hardcoded or committed to source control and follows common industry best practices for configuration management.

The frontend uses a .env file for non-sensitive configuration only (e.g., API base URL). Secrets must never be stored in frontend environment files.

Setting Environment Variables (Windows – PowerShell)

Use setx to define persistent environment variables for your user account:
setx DB_USERNAME "postgres"
setx DB_PASSWORD "<your-secure-password>"
setx JWT_SECRET "<your-long-random-secret>"


Important

Restart your terminal or application after running setx
Values are stored in plaintext at the OS level
Avoid weak or short secrets
Do not commit real values to documentation or version control
