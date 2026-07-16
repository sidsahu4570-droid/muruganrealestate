# Real Estate Management Platform - Phase 1 Foundation

An enterprise-grade Real Estate Management Platform foundation using the MERN stack (MongoDB, Express, React 19, Node.js). 

## Architecture Overview

```
├── backend/
│   ├── config/          # Configurations (db, socket, mail, cloudinary)
│   ├── controllers/     # Authentication & core business logic
│   ├── middleware/      # Auth validation, rate limiters, logging, error handler
│   ├── models/          # 14 MongoDB collections
│   ├── routes/          # Express API route registrations
│   ├── services/        # Service tier (email, upload, loggers)
│   ├── utils/           # Utilities (tokens, hashers, errors)
│   ├── validators/      # Zod or Express validators
│   └── Dockerfile       # Container definition for backend
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI library (buttons, inputs, cards, tables, badges, etc.)
│   │   ├── context/     # AuthContext, DarkModeContext, ToastContext
│   │   ├── layouts/     # AdminLayout (sidebar, navbar, mobile drawer)
│   │   ├── pages/       # Auth pages (login, forgot-password, reset-password)
│   │   ├── routes/      # Guarded paths (Protected vs Guest routes)
│   │   ├── services/    # Axios client with refresh interceptors
│   │   ├── types/       # Global TypeScript types
│   │   └── main.tsx     # Application root
│   └── Dockerfile       # Container definition for frontend
│
└── docker-compose.yml   # Multi-container local orchestration
```

## Running the Application

### 1. Locally (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 2. Using Docker

Run the entire stack (MongoDB, Backend, Frontend) with a single command:
```bash
docker-compose up --build
```
- Frontend will be available at: http://localhost:5173
- Backend API will be available at: http://localhost:5000

## Database Schemas (Mongoose)

Phase 1 registers and schemas for:
- **User / Role**: Complete RBAC supporting Super Admin, Admin, and Sales Executive.
- **Property / Category / City / Location**: Core real estate data layout.
- **Lead / Enquiry**: Lead capture, status tracking, and assignments.
- **Blog / Testimonial / Gallery**: Public content configurations.
- **Settings / Notification / Activity Log**: Logging, alerts, and system-wide settings.
