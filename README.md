# JobTrack

JobTrack is a full-stack job application tracking web application that helps users manage and organize their job applications from a single dashboard.

Users can create an account, log in securely, manage job applications, update application statuses, view application details, change their password, and reset a forgotten password through email.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Job application management
- Add, edit, view, and delete applications
- Application status tracking
- Dashboard with application statistics
- User account management
- Change password
- Forgot password functionality
- Password reset through email
- Password hashing using BCrypt
- MongoDB database
- RESTful backend API
- React-based frontend
- Responsive UI

## Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT
- Spring Data MongoDB
- BCrypt
- JavaMail / SMTP

### Database

- MongoDB

## Project Structure

JobTrack/
│
├── jobtrack-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jobtrack/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── .env.example
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── jobtrack-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

## Prerequisites

Before running JobTrack, make sure the following are installed:

- Java 17 or later
- Maven (optional because the project includes Maven Wrapper)
- Node.js and npm
- MongoDB
- Git

You can verify the installations:

java -version
node -v
npm -v
git --version

## 1. Clone the Repository

Clone the repository:

git clone <YOUR_GITHUB_REPOSITORY_URL>

Navigate into the project:

cd JobTrack

## 2. Configure MongoDB

JobTrack uses MongoDB as its database.

Make sure MongoDB is running locally.

The default database configuration is:

mongodb://localhost:27017/jobtrack

The application will use the "jobtrack" database.

No manual database creation is required. MongoDB will create the database when data is first inserted.

## 3. Configure Backend

Navigate to the backend:

cd jobtrack-backend

The backend requires environment variables for sensitive configuration.

Create a .env file based on the provided example:

cp .env.example .env

On Windows, you can also create the .env file manually.

The .env file should contain:

JWT_SECRET=your-jwt-secret
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password

Important:

Do not commit your .env file to GitHub.

The .env file contains sensitive information and is already included in .gitignore.

## 4. Configure Spring Boot

Open:

jobtrack-backend/src/main/resources/application.properties

The configuration should use environment variables for sensitive values:

spring.application.name=jobtrack-backend

spring.data.mongodb.uri=mongodb://localhost:27017/jobtrack

server.port=8080

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

jwt.secret=${JWT_SECRET}
jwt.expiration=3600000
jwt.reset-expiration=900000

## 5. Gmail Configuration

JobTrack uses Gmail SMTP for password-reset emails.

If you are using Gmail, use a Google App Password instead of your normal Gmail password.

Set:

MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

Make sure the credentials are valid before testing the forgot-password functionality.

## 6. Run the Backend

From the jobtrack-backend directory:

### Windows

mvnw.cmd spring-boot:run

### macOS / Linux

./mvnw spring-boot:run

Alternatively, if Maven is installed:

mvn spring-boot:run

The backend will start on:

http://localhost:8080

## 7. Run the Frontend

Open a new terminal.

Navigate to the frontend:

cd JobTrack/jobtrack-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Vite will provide the frontend URL, normally:

http://localhost:5173

Open that URL in your browser.

## 8. Running the Application

Both servers need to be running.

Backend:

http://localhost:8080

Frontend:

http://localhost:5173

The frontend communicates with the backend through the REST API.

The API base URL is configured in:

jobtrack-frontend/src/services/api.js

## Authentication

JobTrack uses JWT-based authentication.

After a successful login:

1. The backend generates a JWT.
2. The frontend stores the token.
3. Axios automatically attaches the token to protected API requests.
4. Spring Security validates the JWT.
5. Protected resources are accessible only when the token is valid.

Protected requests use:

Authorization: Bearer <JWT_TOKEN>

## Password Reset

The password reset flow works as follows:

1. User selects Forgot Password.
2. User enters their registered email address.
3. Backend generates a password-reset JWT.
4. A reset link is sent through email.
5. User opens the reset link.
6. User enters a new password.
7. Backend validates the reset token.
8. The password is securely hashed using BCrypt.
9. The reset token is invalidated after successful use.

Password-reset tokens expire after a limited period.

## API Overview

The backend exposes REST APIs for authentication and job application management.

### Authentication

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password

### Job Applications

The application also provides APIs for creating, reading, updating, and deleting job applications.

Authentication is required for protected endpoints.

## Development

### Backend

The backend is built using:

Java 17
Spring Boot
Spring Security
Spring Data MongoDB
JWT

### Frontend

The frontend is built using:

React
Vite
React Router
Axios
Tailwind CSS

## Environment Variables

The following environment variables are required:

JWT_SECRET

Secret key used to sign JWT tokens.

MAIL_USERNAME

Gmail account used to send emails.

MAIL_PASSWORD

Gmail App Password.

Never commit actual secrets to the repository.

## Troubleshooting

### Backend does not start

Make sure:

- Java 17+ is installed
- MongoDB is running
- Required environment variables are configured
- Port 8080 is available

### Frontend cannot connect to backend

Make sure the Spring Boot backend is running:

http://localhost:8080

Also verify the API configuration in:

jobtrack-frontend/src/services/api.js

### Password reset email is not received

Check:

- Gmail credentials
- Gmail App Password
- SMTP configuration
- Spam/Junk folder
- Backend console for email errors

### JWT authentication fails

Make sure:

- JWT_SECRET is configured
- The backend is using the same secret for generating and validating tokens
- The JWT has not expired
- The frontend is sending:

Authorization: Bearer <token>

## Security Notes

For production deployment:

- Use a strong randomly generated JWT secret.
- Never commit .env files.
- Never commit passwords or API keys.
- Use HTTPS.
- Use secure production database credentials.
- Configure production CORS settings.
- Store secrets using environment variables or a secrets manager.
- Use a production-ready email provider/configuration.

## Future Improvements

Possible future improvements include:

- Production deployment
- Advanced application filtering
- Search and sorting
- Application reminders
- Interview tracking
- Analytics and charts
- Resume management
- Docker support
- Automated CI/CD pipeline

## License

This project is intended for educational and portfolio purposes.
