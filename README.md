# TailBuddies Frontend

The client-side application for **TailBuddies** — an online pet care consultation platform. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Redux Toolkit.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [User Roles & Pages](#user-roles--pages)

---

## Overview

TailBuddies Frontend is a full-featured telemedicine platform for pets that serves three distinct user types — **Pet Owners**, **Veterinary Doctors**, and **Admins** — each with their own dedicated layout, navigation, and feature set. The app communicates with the TailBuddies REST API and uses WebSockets for real-time chat and notifications.

---

## Features

### Authentication
- Email/password signup with OTP verification
- Login for owners and doctors
- Google OAuth sign-in via `@react-oauth/google`
- Password forgot/reset flow
- JWT-based auth stored in HTTP-only cookies
- Auth state managed globally via Redux with `AuthLoader` bootstrapping on app load

### Pet Owner Portal
- View and edit profile (name, avatar, contact, email)
- Manage pets (add, update, delete with photo upload)
- Browse and filter veterinary doctors by specialty, name, availability
- View detailed doctor profiles (qualifications, reviews, business hours)
- Book, view, and cancel appointments
- Real-time chat with doctor during active consultation
- Agora-powered video call integration for video consultations
- View and download digital prescriptions as PDF
- In-app wallet (view balance, transaction history)
- Submit and view doctor reviews/ratings
- AI-powered pet health assistant chat
- Real-time in-app notifications

### Doctor Portal
- Profile management (basic details, education, experience, clinic, certificates, business hours)
- Manage appointment requests (accept/reject)
- Calendar view of scheduled appointments
- Patient history and medical records
- Issue digital prescriptions (form-based, auto-generated PDF)
- Real-time consultation chat and video call
- Wallet and earnings management
- View own reviews

### Admin Portal
- Dashboard with platform analytics (charts via Chart.js + react-chartjs-2)
- User management (block/unblock)
- Doctor verification workflow (approve/reject with detail view)
- Pet management across the platform
- Appointment oversight
- Specialty/category management
- Transaction and payment history
- Chat assistant management
- Export reports (XLSX via `xlsx`, PDF via `jsPDF`)

### Real-time
- Socket.IO client for live chat messaging
- WebSocket-based notification handler (`NotificationSocketHandler`)
- Notification popover with real-time updates

---

## Architecture

The frontend follows Next.js **App Router** conventions with a clean separation of UI, data-fetching, and state management:

```
app/                     Next.js App Router pages (grouped by role)
  (auth)/                Public auth pages (signin, signup, etc.)
  (owner)/owner/         Pet owner portal
  (doctor)/doctor/       Doctor portal
  (admin)/admin/         Admin portal
  home/                  Landing/home page

components/              Reusable UI components (grouped by domain)
lib/
  api/                   Axios-based API client + domain API modules
  redux/                 Redux store, slices, hooks
  hooks/                 Custom React hooks
  services/              Business logic / data transformation
  types/                 Shared TypeScript types
  validation/            Zod validation schemas
  utils/                 Utility functions (cookies, JWT, etc.)
  providers/             React context providers (Auth, Google)
  constants/             Route constants, API base URLs
```

### State Management

Redux Toolkit is used for global state:

| Slice | Responsibility |
|-------|---------------|
| `authSlice` | Current user session (user data, role, token status) |
| `doctorSlice` | Doctor profile state for the doctor portal |

### API Layer

All backend communication is centralized under `lib/api/`:

- `apiClient.ts` — Axios instance with base URL, credentials, and interceptors
- Domain modules: `auth/`, `admin/`, `doctor/`, `user/` + standalone files for appointments, payments, chat, notifications, AI, etc.

### Routing & Layouts

Route groups with dedicated layouts enable per-role sidebar/navigation without code duplication:

- `(auth)/layout.tsx` — Public layout for auth pages
- `(owner)/owner/layout.tsx` — Owner sidebar layout
- `(doctor)/doctor/layout.tsx` — Doctor sidebar layout
- `(admin)/admin/` — Admin layout (implicit layout from common layout components)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.x |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| State Management | Redux Toolkit + React Redux |
| Form Validation | Zod |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Video Calls | Agora RTC SDK (`agora-rtc-sdk-ng`) |
| Charts | Chart.js + react-chartjs-2 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
| Alerts | SweetAlert2 |
| Auth (Google) | @react-oauth/google |
| Auth (JWT) | jose |
| Calendar | react-calendar |
| Date Utilities | date-fns |
| PDF Generation | jsPDF + jspdf-autotable |
| Spreadsheet Export | xlsx |
| 3D / WebGL | Three.js |
| Markdown Rendering | react-markdown |
| Font | Geist (via next/font) |
| Linting | ESLint + eslint-config-next |
| Bundler | Next.js (Turbopack in dev) |

---

## Project Structure

```
tailbuddies-frontend/
├── app/
│   ├── layout.tsx               # Root layout (Redux, AuthLoader, ErrorBoundary, Toaster, Notifications)
│   ├── page.tsx                 # Root page (redirect to home)
│   ├── globals.css              # Global styles (Tailwind base)
│   ├── favicon.ico
│   │
│   ├── home/
│   │   └── page.tsx             # Landing/home page
│   │
│   ├── (auth)/
│   │   ├── layout.tsx           # Auth layout
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-otp/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (owner)/owner/
│   │   ├── layout.tsx           # Owner sidebar layout
│   │   ├── services/            # Doctor discovery & booking
│   │   ├── bookings/            # Appointment management
│   │   ├── pets/                # Pet management
│   │   ├── medical-records/     # Prescriptions & history
│   │   ├── chat/                # Real-time chat
│   │   ├── video-call/          # Video consultation
│   │   ├── ai-assistant/        # AI health chat
│   │   ├── wallet/              # Balance & transactions
│   │   ├── reviews/             # Submit/view reviews
│   │   ├── calendar/            # Appointment calendar
│   │   ├── payment/             # Payment flow
│   │   ├── subscriptions/
│   │   ├── profile/             # Profile management
│   │   └── account/             # Account settings (email, password)
│   │
│   ├── (doctor)/doctor/
│   │   ├── layout.tsx           # Doctor sidebar layout
│   │   ├── dashboard/           # Doctor analytics & overview
│   │   ├── appointments/        # Appointment management
│   │   ├── requests/            # Pending appointment requests
│   │   ├── patients/            # Patient list & history
│   │   ├── chat/                # Consultation chat
│   │   ├── calendar/            # Schedule view
│   │   ├── slots/               # Availability management
│   │   ├── invoices/            # Billing & prescriptions
│   │   ├── wallet/              # Earnings
│   │   ├── reviews/             # Own reviews
│   │   └── profile/             # Doctor profile tabs
│   │
│   └── (admin)/admin/
│       ├── signin/              # Admin login
│       ├── dashboard/           # Platform analytics
│       ├── usersManagement/     # User oversight
│       ├── doctorVerifications/ # Doctor approval flow
│       ├── appointmentManagement/
│       ├── petsManagement/
│       ├── specialitiesManagement/
│       ├── transactionManagement/
│       ├── paymentApprovals/
│       ├── reviews/
│       ├── reports/
│       └── chatAssistant/
│
├── components/
│   ├── admin/
│   │   ├── AdminDashboardContent.tsx
│   │   ├── DoctorVerifications.tsx
│   │   ├── SingleDoctorView.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── AppointmentManagement.tsx
│   │   ├── SingleAppointmentView.tsx
│   │   ├── PetsManagement.tsx
│   │   ├── SinglePetView.tsx
│   │   ├── SpecialitiesManagement.tsx
│   │   ├── TransactionManagement.tsx
│   │   ├── SingleTransactionView.tsx
│   │   └── ChatAssistantManagement.tsx
│   │
│   ├── auth/
│   │   ├── SigninForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── VerifyOTPForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── AdminLoginForm.tsx
│   │   ├── AuthLayout.tsx
│   │   └── AuthLeftPanel.tsx
│   │
│   ├── common/
│   │   ├── AiAssistant.tsx      # AI chat panel
│   │   ├── Wallet.tsx           # Wallet component
│   │   ├── NotificationSocketHandler.tsx  # WebSocket notification listener
│   │   ├── forms/               # Input, PasswordInput, RadioGroup, RoleSelector, Select
│   │   ├── layout/
│   │   │   ├── admin/           # Admin sidebar/header
│   │   │   ├── doctor/          # Doctor sidebar/header
│   │   │   └── owner/           # Owner sidebar/header
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── DataTable.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Loader.tsx
│   │       ├── NotificationPopover.tsx
│   │       ├── Pagination.tsx
│   │       └── SearchInput.tsx
│   │
│   ├── consultation/
│   │   ├── VideoCall.tsx        # Agora video call UI
│   │   ├── ConsultationChat.tsx # Real-time chat UI
│   │   ├── PrescriptionForm.tsx # Doctor prescription form
│   │   └── PrescriptionView.tsx # Owner prescription viewer
│   │
│   ├── doctor/
│   │   ├── DoctorDashboardContent.tsx
│   │   ├── InvoiceList.tsx
│   │   └── profile/             # Doctor profile tab components
│   │       ├── BasicDetailsTab.tsx
│   │       ├── EducationTab.tsx
│   │       ├── ExperienceTab.tsx
│   │       ├── ClinicDetailsTab.tsx
│   │       ├── CertificatesTab.tsx
│   │       └── BusinessHoursTab.tsx
│   │
│   ├── owner/
│   │   ├── DoctorCard.tsx
│   │   ├── DoctorFilters.tsx
│   │   ├── AddPetModal.tsx
│   │   ├── ReviewModal.tsx
│   │   ├── ProfileView.tsx
│   │   ├── AccountForm.tsx
│   │   ├── ChangeEmailForm.tsx
│   │   ├── ChangePasswordForm.tsx
│   │   └── DoctorTabs/
│   │       ├── Overview.tsx
│   │       ├── BusinessHours.tsx
│   │       └── Reviews.tsx
│   │
│   └── error/
│       ├── ErrorBoundary.tsx
│       └── ErrorFallback.tsx
│
├── lib/
│   ├── api/
│   │   ├── apiClient.ts         # Axios instance (baseURL, withCredentials)
│   │   ├── index.ts             # API module re-exports
│   │   ├── ai.api.ts
│   │   ├── appointment.api.ts
│   │   ├── chat.api.ts
│   │   ├── notification.api.ts
│   │   ├── payment.api.ts
│   │   ├── prescription.api.ts
│   │   ├── review.api.ts
│   │   ├── slot.api.ts
│   │   ├── admin/               # Admin-specific API calls
│   │   ├── auth/                # Auth API calls (signup, login, OTP, etc.)
│   │   ├── doctor/              # Doctor API calls
│   │   └── user/                # User API calls (profile, pets)
│   │
│   ├── redux/
│   │   ├── store.ts             # Redux store configuration
│   │   ├── provider.tsx         # ReduxProvider wrapper
│   │   ├── hooks.ts             # Typed useAppSelector, useAppDispatch
│   │   └── slices/
│   │       ├── authSlice.ts     # Auth state (user, role, status)
│   │       └── doctorSlice.ts   # Doctor profile state
│   │
│   ├── hooks/
│   │   ├── auth/                # useSignin, useSignup, useOtp, usePasswordRecovery
│   │   ├── owner/               # useOwnerBookings, useOwnerPets, useOwnerProfile, etc.
│   │   ├── useAdmin.ts
│   │   ├── useConsultation.ts
│   │   ├── useDebounce.ts
│   │   ├── useRazorpay.ts
│   │   └── useSocket.ts
│   │
│   ├── services/
│   │   └── auth/                # Auth business logic (mappers, service functions)
│   │
│   ├── providers/
│   │   ├── AuthLoader.tsx       # Bootstraps user session from cookies on mount
│   │   └── GoogleAuthProvider.tsx
│   │
│   ├── types/
│   │   ├── api.types.ts         # Shared API response types
│   │   ├── auth/                # Auth-specific types
│   │   ├── admin/               # Admin types
│   │   ├── doctor/              # Doctor types (model, profile, API)
│   │   └── owner/               # Owner types
│   │
│   ├── validation/
│   │   ├── auth/auth.schema.ts  # Zod schemas for auth forms
│   │   ├── admin/admin.schema.ts
│   │   ├── doctor/doctor.schema.ts
│   │   └── owner/               # Pet, account, review, wallet schemas
│   │
│   ├── utils/
│   │   ├── api-error.handler.ts # Axios error normalizer
│   │   ├── clientCookies.ts     # Browser cookie utilities
│   │   ├── cookies.ts           # Server-side cookie helpers
│   │   ├── jwt.ts               # JWT decode utilities (jose)
│   │   ├── cloudinary.ts        # Image upload helper
│   │   ├── user-id.util.ts
│   │   └── utils.ts             # General utilities
│   │
│   ├── constants/
│   │   ├── api.ts               # API base URL constant
│   │   ├── routes.ts            # App route path constants
│   │   ├── httpStatus.ts        # HTTP status codes
│   │   └── index.ts
│   │
│   ├── endpoints/               # Typed API endpoint strings per domain
│   │   ├── auth.ts, admin.ts, doctor.ts, user.ts
│   │   ├── appointment.ts, payment.ts, chat.ts
│   │   ├── notification.ts, prescription.ts
│   │   ├── review.ts, slot.ts, pet.ts, ai.ts
│   │
│   ├── config/
│   │   └── env.ts               # Public environment variable accessor
│   │
│   └── logger/
│       └── index.ts             # Client-side logger utility
│
└── public/                      # Static assets
    ├── next.svg
    ├── vercel.svg
    ├── file.svg
    ├── globe.svg
    └── window.svg
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- TailBuddies Backend running locally or deployed

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd tailbuddies-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your actual values

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Agora (Video)
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Cloudinary (for direct browser uploads if used)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Available Scripts

```bash
npm run dev       # Start development server (Turbopack, memory: 4GB)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## User Roles & Pages

### Pet Owner  `/owner/*`

| Route | Page |
|-------|------|
| `/owner/services` | Browse & book veterinary doctors |
| `/owner/bookings` | View & manage appointments |
| `/owner/pets` | Pet management |
| `/owner/medical-records` | Prescriptions & records |
| `/owner/chat` | Consultation chat |
| `/owner/video-call` | Video consultation |
| `/owner/ai-assistant` | AI health assistant |
| `/owner/wallet` | Wallet & transactions |
| `/owner/reviews` | Reviews & ratings |
| `/owner/calendar` | Appointment calendar |
| `/owner/payment` | Payment screen |
| `/owner/profile` | Profile settings |
| `/owner/account` | Email & password |

### Doctor  `/doctor/*`

| Route | Page |
|-------|------|
| `/doctor/dashboard` | Overview & stats |
| `/doctor/appointments` | All appointments |
| `/doctor/requests` | Pending requests |
| `/doctor/patients` | Patient list |
| `/doctor/chat` | Consultation chat |
| `/doctor/calendar` | Schedule view |
| `/doctor/slots` | Availability slots |
| `/doctor/invoices` | Prescriptions & billing |
| `/doctor/wallet` | Earnings |
| `/doctor/reviews` | Own reviews |
| `/doctor/profile` | Profile (multi-tab) |

### Admin  `/admin/*`

| Route | Page |
|-------|------|
| `/admin/signin` | Admin login |
| `/admin/dashboard` | Platform analytics |
| `/admin/usersManagement` | Manage users |
| `/admin/doctorVerifications` | Doctor approval |
| `/admin/appointmentManagement` | Appointment oversight |
| `/admin/petsManagement` | Pet oversight |
| `/admin/specialitiesManagement` | Specialty CRUD |
| `/admin/transactionManagement` | Transaction history |
| `/admin/paymentApprovals` | Payment oversight |
| `/admin/reviews` | Review management |
| `/admin/reports` | Reports & exports |
| `/admin/chatAssistant` | AI assistant management |

### Auth  (public)

| Route | Page |
|-------|------|
| `/signin` | Login |
| `/signup` | Register |
| `/verify-otp` | OTP verification |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |
| `/home` | Landing page |
