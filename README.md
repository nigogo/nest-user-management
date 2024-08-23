# User Management

## Description
This project is a simple user management system that allows users to register, login, view and update their profile. The project is built to the specifications of the [WHATEVER.WORKS User Management](https://github.com/whatever-works-dev/user-management) project.

## Setup
1. `npm install` (Install dependencies)
2. `cp .env.example .env` (Create a .env file)
3. `docker compose up -d` (Start api and db container)

### Troubleshooting
* Windows handles docker volumes differently than Linux and MacOS. If you are using Windows, you may need to change the volume paths in the `docker-compose.yml` file.
* If you are having trouble with the database, you may need to run `docker compose down -v` to remove the volumes.
* If all else fails, you can start the database with `docker compose up -d db` and run `npx prisma migrate dev` to create the database. Then you can start the api with `npm run start`.

## Initial Thoughts
* Since the project is a simple user management system, I will focus on the process of building it, rather than speccing out the project.
* FR and NFR haven't been discussed, so I will build to spec and make decisions based on my experience.
* I will use feature branches and pull requests for development.
* I will use GitHub Projects to manage the project but will try to add important decisions to the README.
* I will document the project mainly in the README and will add comments to the code as needed.
* I will use Toggle for time tracking in order to provide accuracy for estimations.
* I will write tests before/while implementing features.

### Stack
* The main stack will be TypeScript, Node.js, Express, Prisma and PostgreSQL.
* passport.js will be used for authentication, bcrypt for password hashing, and Jest for testing.
* Swagger will be used for API documentation.
* helmet and cors will be used for security.

### Design
I'm starting off with a simple design that will allow me to build the project quickly:
* A User model with the following fields:
  ```
  model User {
    id        Int      @id @default(autoincrement())
    username  String   @unique
    password  String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```
* A User controller with the following routes:
  * `POST /auth/register`
  * `POST /auth/login`
  * `GET /users/me`
  * `PATCH /users/me`
* A User service that will handle the business logic for the User controller.

If time allows, I will add these features in order of importance:
* Email verification
* Password reset
* Lockout after failed login attempts
* Rate limiting and security measures
* Roles and permissions

### Planning and Estimation
* Initial thoughts and design: 1 hour
* Project setup: 1 hour
* Containerizing and configuration: 2 hour
* Prisma setup and User model: 1 hour
* Testing setup: 1 hour
* User registration (validation, passport setup): 3 hours
* User login: 2 hours
* User profile: 1 hour
* Update user profile: 2 hour
* **Total: 14 hours**


* Email verification: 3 hours
* Password reset: 1 hours
* Lockout after failed login attempts: 2 hours
* Rate limiting and security measures: 1 hours
* Roles and permissions: 3 hours
* **Total: 10 hours**
