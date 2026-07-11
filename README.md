# Hospital Management System

A full-featured hospital management application with patient registration, appointment booking, prescription generation, and secure authentication.

## Features

### Authentication
- User registration with patient profile creation
- Secure login with JWT tokens
- Forgot password with email reset link
- Reset password functionality
- Change email with password confirmation
- Change password with current password verification
- Session management with token blacklisting

### Patient Features
- Patient profile management
- View and edit personal information
- View and edit medical information
- Active appointments dashboard
- Previous treatments history
- Prescription history with medication details

### Appointment System
- Book appointments with hospitals and doctors
- Select from available time slots
- Automatic appointment expiration (15 seconds for testing)
- Automatic prescription generation on appointment completion

### Prescription System
- Automatic prescription generation with 1-3 medications
- Detailed medication information (dosage, frequency, duration)
- Diagnosis and doctor notes
- Follow-up date tracking

### Security
- JWT token authentication
- API key and project ID hidden from browser
- Secure communication through backend proxy
- Token blacklisting on logout and tab close
- Content Security Policy (CSP) protection(inside the auth-service)

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- React Hot Toast
- FontAwesome Icons
- @bmdinner/logreg (Authentication package)

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Axios

### Auth Service
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT

### Infrastructure
- Docker
- Docker Compose
- Nginx (reverse proxy)

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB Atlas account (or local MongoDB)
- PostgreSQL (for auth-service)

```env
VITE_PROJECT_ID=your-project-id
VITE_API_KEY=your-api-key
