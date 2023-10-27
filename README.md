# Usof Backend API

This project provides the backend API for the Usof platform. Follow the instructions below to get it up and running.
## Prerequisites

- *Node.js*: The backend is written in JavaScript and runs on Node.js. Ensure you have it installed. If not, download and install it from Node.js official website.

- *MySQL*: The database used for this project is MySQL. Ensure you have MySQL installed and running. If not, download and install it from MySQL official website.

## Setup
### Step 1: Clone the repository

Clone the repository to your local machine.
```bsh
git clone [REPO_URL]
cd [REPO_DIRECTORY]
```
Replace [REPO_URL] with your repository's URL and [REPO_DIRECTORY] with your repository's directory name.
###Step 2: Install Dependencies

Install all the necessary dependencies:

```bsh
npm install
```

### Step 3: Environment Variables

Before running the application, you need to configure the environment variables. Create a .env file in the root directory and configure the following parameters:
```bsh
PORT=5000
DB_NAME=usof
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
EMAIL_USERNAME=your_email_address
EMAIL_PASSWORD=your_email_password
SMTP_PORT=587
SMTP_HOST=smtp-mail.outlook.com
API_URL=http://localhost:5000
```

Replace the placeholders (your_db_user, your_db_password, etc.) with your actual values.

Important: Never commit your .env file or share it with anyone. It contains sensitive information.
### Step 4: Start the Server

With the environment variables in place, you can start the server:

```bsh
npm run dev
```

The server will start, and you should be able to access the API at http://localhost:5000.

## Usage

To interact and test the API, you can use tools like Postman.

### Testing with Postman

- *Download* and install Postman from Postman's official site.

- *Once installed*, open Postman and set up your request.

- *Use the API URL* (http://localhost:5000) as the base and append the respective endpoint paths.

- *Choose the appropriate request method* (GET, POST, PUT, DELETE, etc.) and provide any necessary headers, body data, or query parameters as required by the endpoint.

- *Hit Send* to make the request and inspect the response returned by the API.