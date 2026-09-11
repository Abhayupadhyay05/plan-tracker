# Plan Tracker API

A backend REST API for managing users and subscriptions with secure authentication, authorization, automated renewal reminders, and email notifications.

This project is built with **Node.js, Express.js, MongoDB, and Mongoose** and can be tested using **Postman**. There is currently no frontend application.

---

##  Features

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* User authorization
* Subscription creation and retrieval
* MongoDB database integration using Mongoose
* Automated subscription renewal reminders
* Email notifications for upcoming renewals
* Upstash Workflow integration for scheduled reminders
* Arcjet security protection
* Rate limiting using Arcjet Token Bucket
* Bot detection using Arcjet
* Shield protection against common attacks
* Centralized error handling
* Environment variable configuration

---

##  Tech Stack

### Backend

* Node.js
* Express.js
* JavaScript (ES Modules)

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcryptjs
* Arcjet

### Workflow & Notifications

* Upstash Workflow
* Nodemailer
* Gmail SMTP
* Day.js

### API Testing

* Postman

---

##  Project Structure

```text
plan-tracker/
│
├── config/
│   ├── arcjet.js
│   └── env.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── models/
│   ├── user.model.js
│   └── subscription.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
│
├── utils/
│   └── send.email.js
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

> Folder and file names may vary slightly depending on the final project structure.



#  Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Abhayupadhyay05/plan-tracker.git
```

## 2. Navigate into the project

```bash
cd plan-tracker
```

## 3. Install dependencies

```bash
npm install
```

---

#  Environment Variables

Create an environment file for your local development environment.

Example:

```env
PORT=8000
NODE_ENV=development

SERVER_URL=http://localhost:8000

DB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

ARCJET_API_KEY=your_arcjet_api_key

QSTASH_TOKEN=your_qstash_token
QSTASH_URL=your_qstash_url

EMAIL_PASSWORD=your_email_app_password
```

---

#  Running the Project

Start the development server:

```bash
npm run dev
```

Or, depending on the scripts configured in `package.json`:

```bash
npm start
```

The API will be available at:

```text
http://localhost:8000
```

---

#  Authentication API

## Sign Up

```http
POST /api/v1/auth/sign-up
```

Example request:

```json
{
  "name": "Abhay",
  "email": "abhay@example.com",
  "password": "your_password"
}
```

The API creates the user, securely hashes the password, and returns a JWT token.

---

## Sign In

```http
POST /api/v1/auth/sign-in
```

Example request:

```json
{
  "email": "abhay@example.com",
  "password": "your_password"
}
```

A successful login returns a JWT token.

Use this token when accessing protected routes.

---

## Sign Out

```http
POST /api/v1/auth/sign-out
```

> Sign-out handling is currently a placeholder and can be extended to implement token invalidation or cookie-based authentication.

---

# 👤 User API

## Get All Users

```http
GET /api/v1/users
```

Returns the users stored in the database.

---

## Get User by ID

```http
GET /api/v1/users/:id
```

This is a protected route and requires authentication.

The user's password is excluded from the response.

---

# Subscription API

## Create Subscription

```http
POST /api/v1/subscriptions
```

This is a protected route.

The authenticated user's ID is automatically associated with the subscription.

Example request:

```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "renewalDate": "2026-10-10"
}
```

> The exact request fields depend on the `Subscription` model used in the project.

---

## Get Current User's Subscriptions

```http
GET /api/v1/subscriptions
```

Requires authentication.

Returns subscriptions belonging to the currently authenticated user.

---

## Get User's Subscriptions by User ID

```http
GET /api/v1/subscriptions/user/:id
```

Requires authentication.

The API verifies that the requested user ID belongs to the authenticated user before returning subscriptions.

---

# ⏰ Automated Subscription Reminders

The project includes an automated workflow for subscription renewal reminders.

When a subscription is active, the workflow checks its renewal date and schedules reminders:

```text
7 days before renewal
        ↓
5 days before renewal
        ↓
2 days before renewal
        ↓
1 day before renewal
```

The workflow uses:

* Upstash Workflow
* Day.js
* Nodemailer

Reminder emails are sent to the user's registered email address.

---

# 📧 Email Notifications

Nodemailer is used to send subscription reminder emails through Gmail SMTP.

The email notification system is connected to the subscription reminder workflow.

For security, the email password is stored in an environment variable rather than directly in the source code.

---

#  API Security

The project uses **Arcjet** to add additional protection to the backend.

Implemented security features include:

### Shield

Protects the application against common attacks.

### Rate Limiting

A Token Bucket rate-limiting strategy is configured to control excessive requests.

### Bot Detection

Arcjet bot detection is configured to identify automated traffic.

---

#  Authorization Flow

Protected routes use JWT authentication.

The basic flow is:

```text
User Sign Up / Sign In
        ↓
JWT Token Generated
        ↓
Client Stores Token
        ↓
Token Sent With Protected Request
        ↓
Authentication Middleware
        ↓
User Identified
        ↓
Protected Controller Executes
```

For example:

```http
GET /api/v1/subscriptions
Authorization: Bearer <JWT_TOKEN>
```

---

# Testing With Postman

This project currently has **no frontend**.

All API functionality can be tested using **Postman**.

Recommended testing flow:

```text
1. Sign Up
      ↓
2. Sign In
      ↓
3. Copy JWT Token
      ↓
4. Add Token to Authorization
      ↓
5. Create Subscription
      ↓
6. Get Subscriptions
      ↓
7. Test Protected Routes
      ↓
8. Test Renewal Reminder Workflow
```

---

# 📌 Current API Routes

| Method | Endpoint                                  | Authentication |
| ------ | ----------------------------------------- | -------------- |
| POST   | `/api/v1/auth/sign-up`                    | ❌              |
| POST   | `/api/v1/auth/sign-in`                    | ❌              |
| POST   | `/api/v1/auth/sign-out`                   | ❌              |
| GET    | `/api/v1/users`                           | ❌              |
| GET    | `/api/v1/users/:id`                       | ✅              |
| POST   | `/api/v1/subscriptions`                   | ✅              |
| GET    | `/api/v1/subscriptions`                   | ✅              |
| GET    | `/api/v1/subscriptions/user/:id`          | ✅              |
| GET    | `/api/v1/subscriptions/:id`               | 🚧             |
| PUT    | `/api/v1/subscriptions/:id`               | 🚧             |
| DELETE | `/api/v1/subscriptions/:id`               | 🚧             |
| PUT    | `/api/v1/subscriptions/:id/cancel`        | 🚧             |
| GET    | `/api/v1/subscriptions/upcoming-renewals` | 🚧             |
| POST   | `/api/v1/workflows/subscription/reminder` | Workflow       |

**Legend:**

* ✅ Implemented
* 🚧 Planned / currently being developed

---

# 🎯 Future Improvements

* Complete subscription update and delete functionality
* Subscription cancellation
* Upcoming renewal API
* Complete sign-out implementation
* Improved request validation
* API documentation with Swagger/OpenAPI
* Frontend dashboard
* Subscription analytics
* Monthly spending calculations
* Subscription categories and filtering
* Deployment to a cloud platform

---

# 📚 What I Learned From This Project

This project helped me practice:

* Building REST APIs with Express.js
* MongoDB database design with Mongoose
* JWT authentication
* Password hashing
* Middleware and authorization
* Environment variable management
* Error handling
* API testing with Postman
* Rate limiting and bot protection
* Background workflows
* Scheduled tasks
* Email notifications
* Working with third-party services

---

## 👨‍💻 Author

**Abhay Upadhyay**

GitHub: `Abhayupadhyay05`

---

⭐ If you find this project useful, feel free to star the repository.


