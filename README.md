# Hospital Management System

An upgraded version of Hospital Management System Project, that is a part of the centralized authentication service system with logreg(my auth proxy npm pacakge), full-stack hospital management system with patient profiles, appointment booking, and prescription management. 

## Features

- Patient registration and authentication
- Profile management with personal and medical information
- Appointment booking with hospital, department, doctor, and time slot selection
- Automatic appointment expiration and prescription generation
- Previous treatments and prescription history
- Dark/light mode support

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication via external auth service

### Frontend
- React 18
- Tailwind CSS
- Vite
- React Router

### Authentication
- Uses `@bmdinner/logreg` npm package
- Centralized authentication service

## Prerequisites

- Node.js 18+
- MongoDB
- Auth Service running on port 3001

## Installation

### Backend

```bash
cd backend
npm install
npm run seed
npm run seed-medicines
npm start