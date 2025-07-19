# Sensegrass - Sustainable Travel Booking Platform

Sensegrass is a full-stack web application for discovering, booking, and managing eco-friendly properties. Built with Next.js, MongoDB, OpenLayers, and Razorpay, Sensegrass provides:

* **User & Admin Authentication** via NextAuth.js
* **Interactive Map** to explore properties
* **Property Listings** with image uploads and CRUD operations
* **Booking Flow** with date selection and Razorpay integration
* **Dashboards** for users and admins
* **Profile Settings** for managing user information

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the App](#running-the-app)
* [Project Structure](#project-structure)
* [Key Features](#key-features)
* [API Endpoints](#api-endpoints)
* [Seeding the Database](#seeding-the-database)
* [Creating an Admin User](#creating-an-admin-user)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

---

## Tech Stack

* **Next.js 13 (App Router)**
* **React** (Client Components)
* **NextAuth.js** (User & Admin roles)
* **MongoDB** with **Mongoose**
* **OpenLayers** (Interactive map)
* **Axios** (HTTP client)
* **Razorpay** (Payment gateway)
* **Node.js** & **Vercel** (Hosting)

---

## Prerequisites

* **Node.js** >= 16
* **npm** or **yarn**
* **MongoDB** Atlas cluster or local instance
* **Razorpay** account (optional for live payments)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Surya816/sensegrass-booking-app.git
   cd sensegrass-booking-app
   ```
2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```
3. **Copy example env file**

   ```bash
   cp .env.example .env.local
   ```
4. **Edit `.env.local`** with your settings (see below).

---

## Environment Variables

Rename `.env.example` to `.env.local` and fill in your values:

```dotenv
# MongoDB connection string
tool=env MONGODB_URI=your_mongodb_uri

# NextAuth.js secret
tool=env NEXTAUTH_SECRET=your_secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Razorpay keys (optional for payments)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

> **Note**: If you omit Razorpay keys, bookings will use a stubbed order for testing.

---

## Running the App

* **Development**

  ```bash
  npm run dev
  # or
  yarn dev
  ```

  Open [http://localhost:3000](http://localhost:3000)

* **Production Build**

  ```bash
  npm run build
  npm start
  ```

---

## Project Structure

```plaintext
src/
├── app/               # App Router pages
│   ├── layout.js      # Imports global CSS & fonts
│   ├── page.jsx       # Home
│   ├── properties/    # Map view
│   ├── book/[id]/     # Booking flow
│   ├── dashboard/     # User/Admin dashboards
│   ├── profile/       # Profile settings
│   └── admin/         # Admin CRUD
│       ├── properties
│       ├── bookings
│       └── users
├── api/               # Route handlers
├── lib/               # Helpers (mongodb connection)
├── models/            # Mongoose schemas
└── public/uploads/    # Property images
```

---

## Key Features

1. **Authentication & Authorization**: User & Admin roles
2. **Property CRUD**: Admin can add/edit/delete
3. **Interactive Map**: Click markers to view details
4. **Booking Flow**: Date picking, amount calc, Razorpay
5. **Dashboards**:

   * User: view personal bookings
   * Admin: metrics & management links
6. **Profile Settings**: Update name & password

---

## API Endpoints

* **Auth**: `/api/auth/...` (NextAuth)
* **Properties**: CRUD operations (`/api/properties`)
* **Bookings**: Create & fetch (`/api/bookings`)
* **User**: Profile update (`/api/user`)

---

## Seeding the Database

Add sample properties via a script or Mongo shell:

```js
// scripts/seed.js
import { connectToDB } from '../src/lib/mongodb'
import Property from '../src/models/Property'
(async()=>{
  await connectToDB()
  await Property.insertMany([...])
  console.log('Seed complete')
  process.exit()
})()
```

Run with:

```bash
node scripts/seed.js
```

---

## Creating an Admin User

In the Mongo shell or GUI:

```js
db.users.insertOne({
  name: 'Admin',
  email: 'admin@example.com',
  password: '<hashed>',
  role: 'admin'
})
```

---

## Deployment

1. **Push** to GitHub
2. **Connect** your repo on Vercel
3. **Set** environment variables in Vercel dashboard
4. **Deploy**

---

## Contributing

PRs and issues welcome! Please follow code style and update tests.

---
