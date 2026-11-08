# RVU Sports Portal — Full Stack Platform

A centralized, full-stack sports management platform designed for **RV University**, built with **React (Frontend)** and **Node.js / Express (Backend)**, meeting all criteria of the Full Stack Development evaluation rubric.

---

## 🎯 Evaluation Rubric Alignment

| Sl. No | Criteria | Implementation in Project |
|---|---|---|
| **1** | **Frontend Development & Responsiveness** | Fully functional, responsive React interface styled with custom RVU teal & gold themes, sports rosters, tournament registration, mobile drawer navigation, and accessible modals. |
| **2** | **Backend Development & APIs** | Express.js REST API with complete CRUD capabilities, strict domain validation, health checks, route parameters, and centralized error handling. |
| **3** | **Database Design & Integration** | Schema-validated persistent data store (`server/data/db.json`) supporting collections for `users`, `sports`, `tournaments`, and `matches` with relationship integrity and duplicate prevention. |
| **4** | **Authentication & Security** | Secure JWT Bearer authentication, bcrypt password hashing, and strict authorization restricting access exclusively to official `@rvu.edu.in` university emails. |

---

## 📂 Project Architecture

```text
rvu-sports/
├── client/                     # ⚛️ React 19 + Vite 8 Frontend
│   ├── public/                 # Static assets & RVU SVGs
│   ├── src/
│   │   ├── assets/images/      # Team backdrops, logos & emblems
│   │   ├── services/
│   │   │   └── api.js          # REST API Client communicating with Express
│   │   ├── App.css             # Component-level responsive styles
│   │   ├── App.jsx             # Main React application
│   │   ├── index.css           # Global theme tokens & resets
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── vite.config.js          # Configured with proxy to http://localhost:5000/api
│   ├── eslint.config.js
│   └── package.json
│
├── server/                     # 🚀 Node.js + Express REST API Backend
│   ├── data/
│   │   └── db.json             # Persistent schema store
│   ├── src/
│   │   ├── config/             # DB & env configuration
│   │   ├── controllers/        # Request handlers (auth, sports, tournaments)
│   │   ├── middleware/         # JWT auth & error handlers
│   │   ├── models/             # Database schema engine & seed data
│   │   ├── routes/             # REST route endpoints
│   │   └── server.js           # Express app entry point
│   ├── test-api.js             # Automated API test suite
│   ├── .env                    # Server environment variables
│   └── package.json
│
├── package.json                # Root package configuration
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher)
* `npm`

### 2. Install Dependencies
Run the following from the root directory:
```bash
# Install both client and server dependencies
npm run install:all
```

### 3. Run the Backend Server
In your first terminal:
```bash
npm run dev:server
# or cd server && npm run dev
```
* **API Server**: `http://localhost:5000`

### 4. Run the React Frontend
In a second terminal:
```bash
npm run dev:client
# or cd client && npm run dev
```
* **Frontend App**: `http://localhost:5173`

---

## 🔑 Authentication & Demo Accounts

Only emails ending with `@rvu.edu.in` are authorized to sign in. The system includes pre-seeded demo accounts:

| Role | University Email | Password |
|---|---|---|
| **Student / Athlete** | `aman.varma@rvu.edu.in` | `password123` |
| **Coach / Faculty** | `coach.sharma@rvu.edu.in` | `password123` |
| **Student** | `kavya.nair@rvu.edu.in` | `password123` |

*Any new valid `@rvu.edu.in` email entered will be securely provisioned with bcrypt password hashing.*

---

## 📡 REST API Endpoints

### Authentication
* `POST /api/auth/login` — Sign in with `@rvu.edu.in` email and password (returns JWT).
* `POST /api/auth/register` — Register a new student or faculty account.
* `GET  /api/auth/me` — Retrieve current user profile (requires Bearer token).

### Sports
* `GET  /api/sports` — List all 5 varsity sports with active rosters and captains.
* `GET  /api/sports/:id` — Retrieve detailed information and matches for a specific sport.
* `GET  /api/sports/matches/recent` — Retrieve recent collegiate match scores and MVPs.

### Tournaments
* `GET  /api/tournaments` — List upcoming championships and open leagues.
* `GET  /api/tournaments/:id` — Retrieve tournament info and registered athlete count.
* `POST /api/tournaments/:id/register` — Register logged-in athlete (requires Bearer token).

---

## 🧪 Automated Testing

To run the automated API, database, and security test suite:
```bash
cd server
npm test
```
Runs 8 automated test assertions verifying:
1. API Health check response.
2. Sports and rosters endpoints.
3. Tournament fixtures.
4. Rejection of unauthorized non-`@rvu.edu.in` domains with HTTP 403.
5. Generation of signed JWT tokens for valid logins.
6. Bearer token authorization on private routes.
7. Tournament registration and duplicate prevention.

---

## 📄 License
Academic Full Stack Development (FSD) project for **RV University**.
