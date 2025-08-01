# Contango Fullstack App

This is a full-stack web application that enables users to upload their CVs and provide supplemental details such as their experience and skills. The application stores the uploaded files and submitted data securely, with a planned integration of AI services to analyze and validate the contents of the CVs in the future.

This project is structured to demonstrate modular fullstack development using Next.js (App Router), form data handling via API routes, PostgreSQL for storage, and Docker-based local development. It’s designed to be easily extended for AI-based screening, recruiter review tools, or applicant tracking workflows.

---

## 🚀 Tech Stack Summary

| Layer          | Tech Used                                                        |
|----------------|------------------------------------------------------------------|
| **Frontend**   | Next.js (React + TypeScript) with MUI for responsive UI          |
| **Backend**    | API Routes (`/pages/api`) and tRPC (`/server/api`) using Node.js |
| **Database**   | PostgreSQL (Local via Docker Compose)                            |

GitHub Repo: [https://github.com/melvindemesa/contango-fullstack-app](https://github.com/melvindemesa/contango-fullstack-app)

---

## 🧠 AI Integration (Planned)

While this application is designed to include AI-based parsing and validation of uploaded CVs or user profile data, **we have not yet integrated any external AI service** due to limited time and the absence of API credentials or compute resource provisioning.

---

## 🛠️ Local Development Setup

Follow the steps below to run the project locally using Docker:

### 1. Clone the Repository

```bash
git clone https://github.com/melvindemesa/contango-fullstack-app.git
cd contango-fullstack-app
```

### 2. Set Up Environment Variables
DATABASE_URL=postgresql://postgres:postgres@db:5432/contango

`You may also copy the copy the .env.example to a .env file`

### 3. Run Docker Compose
docker compose up --build -d

### 4. Access the App
http://localhost:3000
http://localhost:3000/users