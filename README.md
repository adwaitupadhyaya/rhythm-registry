# 🎵 Rhythm Registry

### Artist Management System (AMS)

A streamlined management platform designed to handle users, artists, and music records with granular **Role-Based Access Control (RBAC)**. This project focuses on high performance and minimal overhead by utilizing a **Vanilla Tech Stack**—zero heavy frameworks, just pure code.

---

## 🚀 Project Overview

The Rhythm Registry provides an administrative interface to manage the lifecycle of artists and their musical catalogs.

### Key Features

* **RBAC System:** Three distinct levels of access:
* `Super Admin`: Full system control (User & Artist management).
* `Artist Manager`: Manage Artist profiles and Song records.
* `Artist`: View and manage their own music catalog.


* **Stateless Auth:** Secure authentication using **JWT** (JSON Web Tokens).
* **CRUD Operations:** Full Create, Read, Update, and Delete capabilities for Users, Artists, and Music.
* **Vanilla Implementation:** Built without Express or React to demonstrate deep understanding of the underlying protocols.

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| **Backend** | Node.js (Built-in `http` module) |
| **Database** | PostgreSQL (`pg` driver) |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Security** | JWT for sessions, `bcrypt` for password hashing |
| **API** | RESTful principles using Fetch API |

---

## 📂 Database Schema

The system relies on a relational structure optimized for an artist-centric ecosystem.

* **User Table:** Stores credentials and RBAC roles.
* **Artist Table:** Detailed profiles including debut year and discography counts.
* **Music Table:** Song-level data linked via `artist_id`.

---

## ⚙️ Getting Started

### Prerequisites

* **Node.js** (v16.x or higher)
* **PostgreSQL** (v14.x or higher)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/rhythm-registry.git
cd rhythm-registry

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
Create a `.env` file in the root directory and follow the structure in `.env.example`:

4. **Database Migration:**
Run the DDL scripts (found in `/db/schema.sql`) inside your PostgreSQL instance (DBeaver/psql).
5. **Run the App:**
```bash
npm run dev

```



---

## 🚧 Development Status

> [!NOTE]
> **Engineering Team:** Please track the `dev` branch for active feature sprints and work-in-progress API endpoints.
