# ARCHITECTURE

- **Unity Client** calls backend via HTTPS. Stores JWT in PlayerPrefs.
- **Frontend** is static (no framework) for ease of deployment. Interacts with backend via fetch.
- **Backend** uses Express + MongoDB. JWT for auth, bcrypt for hashing. Forgot/reset password uses time-bound token emailed to user.
