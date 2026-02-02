# Test Task Manager

A project-based task management system that helps teams organize projects and manage tasks with role-based permissions and JWT authentication.

## Features

- User authentication (Register / Login)
- Project CRUD
- Task CRUD under projects
- Assign users to tasks
- Task status updates
- Role-based access control
- Modal-based UI

## Tech Stack

**Backend**

- Java, Spring Boot, Spring Security
- JPA / Hibernate
- JWT
- PostgreSQL

**Frontend**

- React, TypeScript
- Vite
- Tailwind CSS
- React Query
- Axios

# Environment Variables

Sensitive backend configuration (such as database credentials and JWT secrets) is provided via OS-level environment variables and injected into the application using application.yml placeholders.

This approach prevents secrets from being hardcoded or committed to source control and follows common industry best practices for configuration management.

# Setting Environment Variables (Windows – PowerShell)

Use setx to define persistent environment variables for your user account:
setx DB_USERNAME "postgres"
setx DB_PASSWORD "<your-secure-password>"
setx JWT_SECRET "<your-long-random-secret>"

Important

Restart your terminal or application after running setx
Values are stored in plaintext at the OS level
Avoid weak or short secrets
Do not commit real values to documentation or version control

## Author

Francis Catacutan
