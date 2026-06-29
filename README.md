# Job Board API

A RESTful API for a job board application, built with Node.js, Express, and MongoDB.

## Features
- Full CRUD operations for job postings
- MongoDB Atlas integration via Mongoose

## Tech Stack
- Node.js
- Express.js
- MongoDB / Mongoose

## API Endpoints
| Method | Endpoint           | Description           |
|--------|---------------------|------------------------|
| POST   | /api/jobs           | Create a new job      |
| GET    | /api/jobs           | Get all jobs           |
| GET    | /api/jobs/:id        | Get a single job       |
| PUT    | /api/jobs/:id        | Update a job            |
| DELETE | /api/jobs/:id        | Delete a job             |

## Status
🚧 In progress — authentication (JWT) coming next.