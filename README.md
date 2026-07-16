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

## Deploying the frontend on Vercel

The Vercel site is only the frontend. Properties, blogs, settings, and all
admin content live in MongoDB and are served by the Express backend, so that
backend must be deployed to a public HTTPS host (such as Render, Railway, or
Fly.io) with a persistent MongoDB database.

Set these environment variables before redeploying:

| Where | Variable | Value |
| --- | --- | --- |
| Vercel (frontend) | `VITE_API_URL` | `https://your-backend-domain.example/api` |
| Backend host | `MONGO_URI` | Your production MongoDB connection string |
| Backend host | `CLIENT_URL` | `https://your-project.vercel.app` (add any custom domain, comma-separated) |
| Backend host | `NODE_ENV` | `production` |
| Backend host | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Secure, unique production secrets |

Then redeploy the backend and use **Redeploy** in Vercel. Vite reads
`VITE_API_URL` only while building, so changing that value without a new
Vercel deployment will not update the live site.

## Database Schemas (Mongoose)

Phase 1 registers and schemas for:
- **User / Role**: Complete RBAC supporting Super Admin, Admin, and Sales Executive.
- **Property / Category / City / Location**: Core real estate data layout.
- **Lead / Enquiry**: Lead capture, status tracking, and assignments.
- **Blog / Testimonial / Gallery**: Public content configurations.
- **Settings / Notification / Activity Log**: Logging, alerts, and system-wide settings.
