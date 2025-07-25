 Express + MongoDB Backend API

This project is a robust, secure, and scalable backend REST API built with Express.js and MongoDB (via Mongoose). It provides user authentication, authorization, and user management features, with a strong focus on security, validation, and performance.

 Features

 User Management

- User Registration:  
  - Endpoint: `POST /api/register`  
  - Registers a new user with strong password validation and input sanitization.

- User Login:  
  - Endpoint: `POST /api/login`  
  - Authenticates users and issues JWT access and refresh tokens.

- Token Refresh:  
  - Endpoint: `POST /api/refresh-token`  
  - Issues a new access token using a valid refresh token (stored in HTTP-only cookies).

- Logout:  
  - Endpoint: `POST /api/logout`  
  - Logs out the user and invalidates the refresh token.

- Get All Users (Paginated, Admin Only):  
  - Endpoint: `GET /api/getUsers`  
  - Returns a paginated list of users. Only accessible by admin users.

- Get User by ID (Admin Only):  
  - Endpoint: `GET /api/getUserById/:id`  
  - Fetches a single user by their ID. Only accessible by admin users.

- Update User:  
  - Endpoint: `PUT /api/updateUser/:id`  
  - Updates user details. Protected route.

- Delete User:  
  - Endpoint: `DELETE /api/deleteUser/:id`  
  - Deletes a user by ID. Protected route.

 Security & Middleware

- Authentication Middleware:  
  - Protects routes using JWT access tokens (Bearer scheme).
  - Verifies token validity and user role.

- Rate Limiting:  
  - Limits login attempts to prevent brute-force attacks.
  - General API rate limiting is also available.

- Input Validation & Sanitization:  
  - Validates and sanitizes all user input using `express-validator`.
  - Enforces strong password policies.
  - Prevents NoSQL/SQL injection by sanitizing request keys.

- CORS Configuration:  
  - Restricts allowed origins, headers, and methods based on environment variables.
  - Supports credentials and custom CORS policies.

- Cacheability:  
  - Caches GET responses for improved performance (configurable duration).

- Error Handling:  
  - Centralized error handler returns consistent error responses for validation, authentication, authorization, and server errors.

 Project Structure

```
src/
  config/          Database connection setup
  controller/      Route handler logic (user CRUD, auth, etc.)
  models/          Mongoose schemas and models
  routes/          API route definitions
  middlewares/     Custom middleware (auth, validation, rate limit, etc.)
  data/            (Reserved for seed data or static files)
test/              End-to-end and security tests
util/              Test utilities
server.js          Entry point
```

 Getting Started

1. Install dependencies  
   ```
   npm install
   ```

2. Set up environment variables  
   Create a `.env` file with the following (example):
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ALLOWED_ORIGINS=http://localhost:3000
   ALLOWED_HEADERS=Content-Type,Authorization
   ALLOWED_METHODS=GET,POST,PUT,DELETE
   CRENDENTIALS=true
   NODE_ENV=development
   ```

3. Run the server  
   ```
   npm start
   ```

4. Run tests  
   ```
   npm test
   ```

 Testing

- Includes end-to-end tests for authentication, user management, and security (e.g., NoSQL injection prevention).

 Dependencies

- express
- mongoose
- bcrypt
- jsonwebtoken
- express-validator
- express-rate-limit
- node-cache
- cors
- dotenv

 Security Best Practices

- All sensitive routes are protected by authentication and role-based authorization.
- Rate limiting and input validation are enforced on all endpoints.
- Refresh tokens are stored securely in HTTP-only cookies.
- CORS and cacheability are configurable for production environments.

---
