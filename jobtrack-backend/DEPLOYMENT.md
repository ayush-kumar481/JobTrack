# Backend deployment configuration

Set these values in the backend hosting provider's environment configuration. Spring Boot does not load `.env` files by itself; `.env.example` is a list of the values to configure, not a file the application reads automatically.

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Hosted MongoDB connection URI. |
| `JWT_SECRET` | Random secret with at least 32 bytes. Required for JWT signing. |
| `FRONTEND_URL` | Public frontend origin, such as `https://app.example.com`, without a trailing slash. Used in reset emails. |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins, such as `https://app.example.com`. Do not include paths or trailing slashes. |
| `MAIL_USERNAME` | SMTP account for password reset email. |
| `MAIL_PASSWORD` | SMTP password or app password. |

The frontend must be built with `VITE_API_BASE_URL` set to the backend API base URL, including `/api` (for example, `https://api.example.com/api`). When frontend and API share an origin and `/api` is reverse-proxied to the backend, this variable can be omitted.

SMTP credentials are optional at startup, but forgot-password emails will fail until valid SMTP settings are configured.
