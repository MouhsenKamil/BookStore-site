# BookStore-site

[GDrive link for video sample](https://drive.google.com/drive/folders/1r_Gt4PMm1XnjLpZGozAqqKzoFRq7Iz60?usp=sharing)

An E-commerce site for buying and selling books. \
MERN stack project.

![Book store site](assets/homepage_screenshot.png)

# Pre-requisites

`.env` location - Project root directory

```
backend
frontend
assets
.gitignore
README.md
```

`.env` file should contain these:

```yaml
MONGODB_ADMIN_USERNAME: MongoDB Admin user acount's username
MONGODB_ADMIN_PASSWORD: MongoDB Admin user acount's password

MONGODB_USER_USERNAME: MongoDB customer user account's username
MONGODB_USER_PASSWORD: MongoDB customer user account's username

# Note: You can use either of the credentials based off of your need.

BOOKSTORE_DB_NAME: Name of the MongoDB Database

BACKEND_PORT: Express JS backend port number (in integer)
MONGODB_URI: URL endpoint where the MongoDB server is running and hosted

# Secrets for secure encrypted communication/authentication
ACCESS_TOKEN_SECRET: Secret key for signing access tokens
REFRESH_TOKEN_SECRET: Secret key for signing refresh tokens
COOKIE_SESSION_SECRET: Secret key for cookie-parser package for signing cookies
CLIENT_ID_SECRET: Secret key that's used to generate Client ID hash

# Cookie names list
REFRESH_TOKEN_COOKIE_NAME: Name of the cookie to store refresh token
ACCESS_TOKEN_HEADER_PAYLOAD_COOKIE_NAME: Name of the cookie to store access token's header and payload
ACCESS_TOKEN_SIGN_COOKIE_NAME: Name of the cookie to store access token's signature
```

# How to run

## Clone the Repository
```
git clone https://github.com/MouhsenKamil/BookStore-site.git
cd BookStore-site
```
## Install Dependencies
(Run these commands from each code block from the project root directory)

For Frontend
```
cd frontend
npm i
```
For Backend
```
cd backend
npm i
```
## Run the server
(Run these commands from each code block from the project root directory)

For Frontend
```
cd frontend
npm run dev
```

For Backend
```
cd backend
npm run dev
```
The database will run along with the backend.
