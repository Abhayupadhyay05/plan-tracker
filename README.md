# Plan Tracker API

A backend REST API for managing users and subscriptions with authentication, authorization, automated renewal reminders, and email notifications.

## Features

* User registration and login
* JWT authentication
* Password hashing with bcrypt
* User authorization
* Create and view subscriptions
* MongoDB database integration
* Subscription renewal reminders
* Email notifications
* Arcjet security and rate limiting
* Upstash Workflow

## Tech Stack

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT
* bcryptjs
* Arcjet
* Upstash Workflow
* Nodemailer
* Postman

## Installation

Clone the repository:

```bash
git clone https://github.com/Abhayupadhyay05/plan-tracker.git
cd plan-tracker
npm install
```

Create a `.env` file and add your required environment variables.

Start the server:

```bash
npm run dev
```

## API Routes

### Authentication

```text
POST /api/v1/auth/sign-up
POST /api/v1/auth/sign-in
POST /api/v1/auth/sign-out
```

### Users

```text
GET /api/v1/users
GET /api/v1/users/:id
```

### Subscriptions

```text
POST /api/v1/subscriptions
GET /api/v1/subscriptions
GET /api/v1/subscriptions/user/:id
```

### Workflow

```text
POST /api/v1/workflows/subscription/reminder
```

## Testing

This project currently has no frontend.
The API can be tested using **Postman**.


## Author

**Abhay Upadhyay**

