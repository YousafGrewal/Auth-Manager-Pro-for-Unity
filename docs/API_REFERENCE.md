# API REFERENCE

Base URL: `http://localhost:8000`

## POST /api/users/register
Body: `{ "email": "", "password": "" }`

## POST /api/users/login
Body: `{ "email": "", "password": "" }`

## GET /api/users/me
Header: `Authorization: Bearer <token>`

## POST /api/users/forgot-password
Body: `{ "email": "" }`

## POST /api/users/reset-password
Body: `{ "token": "", "password": "" }`
