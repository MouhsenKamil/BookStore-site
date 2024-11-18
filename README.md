# BookStore-site

`.env` location - Project root directory

It should contain these:

```yaml
MONGODB_ADMIN_USERNAME: MongoDB Admin user acount's username
MONGODB_ADMIN_PASSWORD: MongoDB Admin user acount's password

MONGODB_USER_USERNAME: MongoDB customer user account's username
MONGODB_USER_PASSWORD: MongoDB customer user account's username

BOOKSTORE_DB_NAME: Name of the MongoDB Database

BACKEND_PORT: Express JS backend port number (in integer)
MONGODB_PORT: MongoDB port number (in integer)

# Secrets for secure encrypted communication
ACCESS_TOKEN_SECRET: Secret key for signing access tokens
REFRESH_TOKEN_SECRET: Secret key for signing refresh tokens
COOKIE_SESSION_SECRET: Secret key for cookie-parser package for signing cookies

CLIENT_ID_SALT: Salt value that's used to generate client id hash

# Cookie names list
REFRESH_TOKEN_COOKIE_NAME: Name of the cookie to store refresh token
ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME: Name of the cookie to store access token's header and payload
ACCESS_TOKEN_SIGN_COOKIE_NAME: Name of the cookie to store access token's signature
```
