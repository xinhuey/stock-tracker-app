# 📈 MERN Stock Tracker

A full-stack stock tracker web application that lets you securely register, build personalized watchlists, and view live & historical market data—all in one place.

## Key Features

- **User Authentication**

  - Sign up and log in with email & password
  - JWT-protected routes to ensure only authorized access

- **Watchlist Management**

  - Add / remove stock symbols to your personal watchlist
  - Persisted in MongoDB via Mongoose

- **Live & Historical Data**

  - Fetches real-time quotes and historical price series from the Polygon API
  - Auto-refresh every 60 seconds for up-to-the-moment accuracy
  - Interactive charts on the React frontend

- **Scalable Backend**
  - Express.js server with modular routes for auth & stocks
  - MongoDB indexing and optional caching to minimize query latency
  - Designed for horizontal scaling to handle high concurrency

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios, React Hooks
- **Backend:** Node.js, Express.js, jsonwebtoken (JWT)
- **Database:** MongoDB, Mongoose
- **Market Data:** Polygon API
- **Deployment:** AWS (probably, tbd)
