# 🎵 Rhythm Registry - Artist Management System

A full-stack Artist Management System with **Role-Based Access Control (RBAC)** built using vanilla technologies—no frameworks, just pure Node.js, PostgreSQL, and modern JavaScript.

---

## 🎯 Overview

Rhythm Registry is a comprehensive artist management platform that enables administrators and artists to manage music catalogs with granular access control. The system demonstrates production-level application architecture using only native Node.js modules and vanilla JavaScript—no Express, no React, no frameworks.

### Core Capabilities

- **User Management** - Full CRUD operations with role-based permissions
- **Artist Profiles** - Comprehensive artist information and discography tracking
- **Music Catalog** - Song-level data management with artist association
- **CSV Import/Export** - Bulk operations for artist data
- **Secure Authentication** - JWT-based stateless authentication
- **RBAC** - Three-tier role system with granular permissions

---

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication with secure token management
- ✅ Password hashing using bcrypt
- ✅ Role-based route protection
- ✅ Automatic token refresh and session management

### User Management (Super Admin)
- ✅ Create, read, update, delete users
- ✅ Assign roles (super_admin, artist_manager, artist)
- ✅ Activate/deactivate user accounts
- ✅ Paginated user listings

### Artist Management (Artist Manager)
- ✅ Full CRUD operations on artist profiles
- ✅ CSV import/export for bulk operations
- ✅ Paginated artist listings
- ✅ Link artists to user accounts

### Music Management (Artist)
- ✅ Artists manage their own songs
- ✅ Create, edit, delete songs
- ✅ Genre categorization (R&B, Country, Classic, Rock, Jazz)
- ✅ Release date tracking
- ✅ Album organization

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js (http module) | Raw HTTP server without Express |
| **Database** | PostgreSQL | Relational data storage |
| **Frontend** | Vanilla TypeScript | SPA with custom router |
| **Authentication** | JWT + bcrypt | Stateless auth with secure hashing |
| **Styling** | Pure CSS | No frameworks, custom design system |

### Why Vanilla?

This project intentionally avoids frameworks to demonstrate:
- Deep understanding of HTTP protocols
- DOM manipulation
- Proper separation of concerns
- Manual state management
- Custom routing implementation

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   artists    │       │    music     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │───┐   │ id (PK)      │───┐   │ id (PK)      │
│ first_name   │   │   │ name         │   │   │ artist_id(FK)│
│ last_name    │   └──→│ user_id (FK) │   └──→│ title        │
│ email (UQ)   │       │ dob          │       │ album_name   │
│ password_hash│       │ gender       │       │ genre        │
│ role (ENUM)  │       │ address      │       │ release_date │
│ is_active    │       │ first_release│       │ created_at   │
│ created_at   │       │ no_of_albums │       │ updated_at   │
└──────────────┘       │ created_at   │       └──────────────┘
                       └──────────────┘
```

### Table Definitions

#### Users Table
```sql
CREATE TYPE user_role AS ENUM ('super_admin', 'artist_manager', 'artist');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  gender TEXT,
  address TEXT,
  role user_role DEFAULT 'artist' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
```

#### Artists Table
```sql
CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  address TEXT,
  first_release_year INTEGER,
  no_of_albums_released INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE
);
```

#### Music Table
```sql
CREATE TABLE music (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  album_name TEXT,
  genre TEXT,
  release_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_music_artist_id ON music(artist_id);
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v16.x or higher
- **PostgreSQL** v14.x or higher
- **npm** v8.x or higher

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/rhythm-registry.git
cd rhythm-registry
```

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Step 3: Database Setup

1. **Create Database**
```bash
psql -U postgres
CREATE DATABASE rhythm_registry;
\c rhythm_registry
```

2. **Create ENUM Type**
```sql
CREATE TYPE user_role AS ENUM ('super_admin', 'artist_manager', 'artist');
```

3. **Create Tables**

Run the following SQL in order:

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  dob DATE,
  gender TEXT,
  address TEXT,
  role user_role DEFAULT 'artist' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON users(email);

-- Artists Table
CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  address TEXT,
  first_release_year INTEGER,
  no_of_albums_released INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- Music Table
CREATE TABLE music (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  album_name TEXT,
  genre TEXT,
  release_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_music_artist_id ON music(artist_id);
```

### Step 4: Environment Configuration

#### Backend `.env`
```env
PORT=PORT_NUMBER_HERE
DATABASE_URL=DB_URL
JWT_SECRET=supersecretkey
BCRYPT_SALT_ROUNDS=SALT_ROUNDS_NUMBER_HERE
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000
```

### Step 5: Run Application

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:3000`

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5174`

### Step 6: Create Initial Admin User

```bash
# Using psql or any PostgreSQL client
INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES ('Admin', 'User', 'admin@test.com', '$2b$10$YourHashedPasswordHere', 'super_admin');
```

Or use the registration endpoint with super_admin role via API.

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "artist"
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "artist"
  }
}
```

---

### User Management Endpoints

#### List Users (super_admin only)
```http
GET /api/users?limit=10&offset=0
Authorization: Bearer {token}

Response: 200 OK
{
  "users": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "role": "artist",
      "is_active": true,
      "created_at": "2026-02-06T10:00:00.000Z"
    }
  ],
  "limit": 10,
  "offset": 0
}
```

#### Create User (super_admin only)
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "role": "artist_manager"
}

Response: 201 Created
{
  "id": 2,
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "role": "artist_manager",
  "is_active": true,
  "created_at": "2026-02-06T10:00:00.000Z"
}
```

#### Update User (super_admin only)
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "Jane",
  "role": "super_admin",
  "is_active": true
}

Response: 200 OK
{
  "id": 2,
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "super_admin",
  "is_active": true
}
```

#### Delete User (super_admin only)
```http
DELETE /api/users/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

---

### Artist Management Endpoints

#### List Artists (super_admin, artist_manager)
```http
GET /api/artists?limit=10&offset=0
Authorization: Bearer {token}

Response: 200 OK
{
  "artists": [
    {
      "id": 1,
      "name": "Taylor Swift",
      "dob": "1989-12-13",
      "gender": "female",
      "address": "Nashville, Tennessee",
      "first_release_year": 2006,
      "no_of_albums_released": 10,
      "created_at": "2026-02-06T10:00:00.000Z",
      "updated_at": "2026-02-06T10:00:00.000Z",
      "user_id": 5
    }
  ],
  "limit": 10,
  "offset": 0
}
```

#### Create Artist (artist_manager only)
```http
POST /api/artists
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Ed Sheeran",
  "dob": "1991-02-17",
  "gender": "male",
  "address": "Halifax, England",
  "first_release_year": 2011,
  "no_of_albums_released": 5
}

Response: 201 Created
{
  "id": 2,
  "name": "Ed Sheeran",
  "dob": "1991-02-17",
  "gender": "male",
  "address": "Halifax, England",
  "first_release_year": 2011,
  "no_of_albums_released": 5,
  "created_at": "2026-02-06T10:00:00.000Z",
  "updated_at": "2026-02-06T10:00:00.000Z",
  "user_id": null
}
```

#### Update Artist (artist_manager only)
```http
PUT /api/artists/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Ed Sheeran (Updated)",
  "no_of_albums_released": 6
}

Response: 200 OK
{
  "id": 2,
  "name": "Ed Sheeran (Updated)",
  "no_of_albums_released": 6,
  ...
}
```

#### Delete Artist (artist_manager only)
```http
DELETE /api/artists/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

#### Export Artists CSV (artist_manager only)
```http
GET /api/artists/export-csv
Authorization: Bearer {token}

Response: 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="artists-2026-02-06.csv"

id,name,dob,gender,address,first_release_year,no_of_albums_released,created_at
1,"Taylor Swift",1989-12-13,female,"Nashville, Tennessee",2006,10,2026-02-06...
```

#### Import Artists CSV (artist_manager only)
```http
POST /api/artists/import-csv
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
  file: artists.csv

Response: 200 OK
{
  "success": true,
  "imported": 10,
  "failed": 0,
  "errors": []
}
```

**CSV Format:**
```csv
name,dob,gender,address,first_release_year,no_of_albums_released
"Taylor Swift",1989-12-13,female,"Nashville, Tennessee",2006,10
"Ed Sheeran",1991-02-17,male,"Halifax, England",2011,5
```

---

### Music/Song Management Endpoints

#### List Songs for Artist (all roles)
```http
GET /api/artists/{artistId}/songs?limit=10&offset=0
Authorization: Bearer {token}

Response: 200 OK
{
  "songs": [
    {
      "id": 1,
      "artist_id": 1,
      "title": "Love Story",
      "album_name": "Fearless",
      "genre": "country",
      "release_date": "2008-09-15",
      "created_at": "2026-02-06T10:00:00.000Z",
      "updated_at": "2026-02-06T10:00:00.000Z"
    }
  ],
  "limit": 10,
  "offset": 0
}
```

**Access:** Artists can only view their own songs

#### Create Song (artist only - own profile)
```http
POST /api/artists/{artistId}/songs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Shake It Off",
  "album_name": "1989",
  "genre": "pop",
  "release_date": "2014-08-18"
}

Response: 201 Created
{
  "id": 2,
  "artist_id": 1,
  "title": "Shake It Off",
  "album_name": "1989",
  "genre": "pop",
  "release_date": "2014-08-18",
  "created_at": "2026-02-06T10:00:00.000Z",
  "updated_at": "2026-02-06T10:00:00.000Z"
}
```

**Genres:** `rnb`, `country`, `classic`, `rock`, `jazz`

#### Update Song (artist only - own songs)
```http
PUT /api/artists/{artistId}/songs/{songId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Shake It Off (Taylor's Version)",
  "genre": "pop"
}

Response: 200 OK
{
  "id": 2,
  "title": "Shake It Off (Taylor's Version)",
  "genre": "pop",
  ...
}
```

#### Delete Song (artist only - own songs)
```http
DELETE /api/artists/{artistId}/songs/{songId}
Authorization: Bearer {token}

Response: 204 No Content
```

---

## 🔐 Role-Based Access Control

### Role Hierarchy

| Role | Users | Artists | Songs | Description |
|------|-------|---------|-------|-------------|
| **super_admin** | Full CRUD | View Only | View All | System administrator |
| **artist_manager** | ❌ | Full CRUD + CSV | View All | Manages artist profiles |
| **artist** | ❌ | ❌ | Own CRUD | Manages own music |

### Detailed Permissions

#### Super Admin
- ✅ Create, read, update, delete users
- ✅ Assign any role to users
- ✅ Activate/deactivate user accounts
- ✅ View all artists (read-only)
- ✅ View all songs (read-only)

#### Artist Manager
- ✅ Create, read, update, delete artists
- ✅ CSV import/export for artists
- ✅ Link artists to user accounts
- ✅ View all songs (read-only)
- ❌ Cannot manage users

#### Artist
- ✅ View their own artist profile
- ✅ Create, read, update, delete their own songs
- ✅ Automatically redirected to their songs on login
- ❌ Cannot view other artists' songs
- ❌ Cannot manage users or other artists

### Security Features

- **JWT Authentication:** Stateless token-based auth
- **Password Hashing:** bcrypt with salt rounds
- **Route Protection:** Middleware validates JWT and role
- **Ownership Checks:** Artists can only access their own data
- **SQL Injection Prevention:** Parameterized queries
---

## 📁 Project Structure

```
rhythm-registry/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database queries (raw SQL)
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth & RBAC
│   │   ├── routes/           # Route definitions
│   │   ├── validators/       # Input validation
│   │   ├── utils/            # Helpers (JWT, bcrypt, etc)
│   │   ├── interfaces/       # TypeScript types
│   │   └── server.ts         # HTTP server
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   ├── utils/            # Helpers (router, validation)
│   │   ├── styles/           # CSS files
│   │   ├── types/            # TypeScript interfaces
│   │   └── main.ts           # Application entry
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```


