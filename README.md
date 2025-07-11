# REST_api

## JWT Authentication Setup

This project uses a secure JWT-based authentication system with access and refresh tokens.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
DBconn_string=your_mongodb_connection_string_here

# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
```

- `JWT_ACCESS_SECRET`: Used to sign and verify access tokens (short-lived)
- `JWT_REFRESH_SECRET`: Used to sign and verify refresh tokens (long-lived)

### Authentication Flow

1. **Login**: User receives an access token (valid for 15 minutes) and a refresh token (valid for 7 days) stored in an HTTP-only cookie
2. **Accessing Protected Routes**: Include the access token in the Authorization header as a Bearer token
3. **Token Refresh**: When the access token expires, use the `/api/refresh-token` endpoint to get a new access token
4. **Logout**: Use the `/api/logout` endpoint to invalidate the refresh token

### Security Features

- Access tokens are short-lived (15 minutes)
- Refresh tokens are stored in HTTP-only cookies
- Refresh tokens are stored in the database and validated on each refresh
- Logout invalidates refresh tokens
