Unity Auth System Pro
A complete and secure backend solution for player authentication and management in Unity3D games. This project provides a Node.js server with a REST API for registration, login, password resets, and an admin dashboard for player administration.

## Features ✨
Secure Player Authentication: JWT-based login and registration system.

Password Security: Passwords are encrypted using bcrypt.

Forgot/Reset Password: Secure email-based password reset functionality.

Admin Dashboard: A web interface to view all player data, search for users, and issue bans.

Player Banning System:

Issue permanent bans.

Issue temporary bans for a specific duration.

Player Data Tracking: Logs signupDate and lastLogin for each player.

Scalable Backend: Built with Node.js, Express, and MongoDB for high performance.

Easy Unity Integration: Designed to be easily integrated into any Unity3D project using simple HTTP requests.

## Technology Stack 🛠️
Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Authentication: JSON Web Tokens (JWT)

Password Hashing: bcrypt.js

Email: Nodemailer

## Getting Started
### Prerequisites
Make sure you have the following installed:

Node.js (which includes npm)

MongoDB or a MongoDB Atlas account

Unity Hub & Unity Editor

### Backend Setup
Clone the repository:

Bash

git clone <your-repository-url>
cd <your-repository-folder>
Install dependencies:

Bash

npm install
Create an environment file: Create a file named .env in the root of the project and add the following configuration variables.

Code snippet

# MongoDB Connection String
MONGO_URI=your_mongodb_connection_string

# JWT Secret Key
JWT_SECRET=a_long_random_secret_string_for_security

# Email Configuration (e.g., for SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=YOUR_SENDGRID_API_KEY
EMAIL_FROM=noreply@yourgame.com
Start the server:

Bash

node server.js
The server will be running at http://localhost:3000.

### Unity Client Setup
Open your project in the Unity Editor.

Add the AuthManager.cs and PasswordManager.cs scripts to a GameObject in your scene.

In the script's Inspector, ensure the serverUrl variable is set to http://localhost:3000/api/auth.

Connect the UI elements (input fields and buttons) to the public functions in the scripts (OnLoginButtonPressed, OnRegisterButtonPressed, etc.).

## Admin Dashboard
Once the server is running, you can access the admin dashboard by navigating to the following URL in your web browser:
http://localhost:3000

From the dashboard, you can:

View a list of all registered players.

Search for a specific player by their email or unique ID.

Ban a player permanently or for a set number of days.

View player details such as their last login date and signup date.

## API Endpoints
All API routes are prefixed with /api.

#### Auth Routes (/api/auth)
POST /register: Creates a new player account. Requires email and password.

POST /login: Logs in a player. Requires email and password. Returns a JWT.

POST /forgot-password: Starts the password reset process. Requires email.

POST /reset-password/:token: Sets a new password using a valid reset token. Requires password.

#### Admin Routes (/api/admin)
GET /players: Retrieves a list of all players (admin access only).

POST /ban: Bans a player. Requires identifier (email or uniqueId) and optional banDurationDays.

POST /unban: Unbans a player. Requires identifier.
