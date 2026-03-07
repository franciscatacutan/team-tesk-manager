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

# IMPROVEMENTS

- Pagination
- Sorting
- Task Total for Project
- Search Function
- Additional Task Status

# Environment Variables

Sensitive backend configuration (such as database credentials and JWT secrets) is provided via OS-level environment variables and injected into the application using application.yml placeholders.

This approach prevents secrets from being hardcoded or committed to source control and follows common industry best practices for configuration management.

# Setting Environment Variables (Windows – PowerShell)

**Important**
PostgreSQL database name must be: taskmanager

Use setx to define persistent environment variables for your user account:

Open PowerShell or Command Prompt as a normal user
Run the following commands:

For Database
setx DB_USERNAME "<your-username>"
setx DB_PASSWORD "<your-secure-password>"
setx JWT_SECRET "<your-long-random-secret>"

For Super Admin
setx BOOTSTRAP_ADMIN_EMAIL "<your-super-admin-email>"
setx BOOTSTRAP_ADMIN_PASSWORD "<your-super-admin-password>"

Restart your terminal or application after running setx
Values are stored in plaintext at the OS level
Avoid weak or short secrets
Do not commit real values to documentation or version control

#SETUP

Frontend
cd frontend
npm install
npm run dev

cd backend
mvn clean install
mvn spring-boot:run

## Author

Francis Catacutan
