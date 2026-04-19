# 🚀 VIT Skill-Match (Internship Platform)

A full-stack, database-driven web application that intelligently connects students with relevant internship opportunities using **SQL-based eligibility filtering and real-time application tracking**.

---

## 📌 Project Overview

VIT Skill-Match solves a critical inefficiency in internship dissemination within academic institutions.

Traditional systems:

* Flood students with irrelevant opportunities
* Lack personalization
* Cause missed deadlines

This platform introduces a **centralized, intelligent system** that uses structured data and SQL queries to deliver **precise, eligibility-based internship recommendations**.

---

## 🧠 Core Concept

The system leverages a **relational database (PostgreSQL)** and executes **optimized SQL queries** to:

* Match students with internships
* Filter based on skills, CGPA, and domain
* Maintain application state

---

## 🏗️ Tech Stack

### Frontend

* Next.js (React)
* TypeScript
* Tailwind CSS
* Deployed on Vercel

### Backend

* Node.js + Express
* REST API with raw SQL queries

### Database

* PostgreSQL + SQL Relational schema

---

## 🔄 System Architecture

Frontend (Next.js) → Backend API (Express) → SQL Queries → PostgreSQL

* Frontend handles UI & user interactions
* Backend processes requests and executes SQL queries
* Database stores normalized relational data

---

## 🔐 Features

### 👤 Authentication System

* Login & Registration
* Role-based access:

  * Student
  * Employer
  * Admin

---

### 🎯 Smart Internship Matching

* SQL-based filtering using:

  * Skills (tags)
  * CGPA
  * Domain
  * Course

---

### 🏢 Internship Management

* Employers can:

  * Create internships
  * Define eligibility criteria
* Admin approval system

---

### 📊 Application System

* Apply to internships
* Track status:

  * Applied
  * Shortlisted
  * Accepted
  * Rejected

---

### 🧾 SQL-Driven Backend

All operations are executed using **direct SQL queries**, including:

```sql
SELECT * FROM users WHERE email = $1;

INSERT INTO applications (student_id, internship_id)
VALUES ($1, $2);

SELECT i.*
FROM internships i
JOIN internship_tags it ON i.id = it.internship_id
JOIN student_skills ss ON ss.tag_id = it.tag_id;
```

---

## 🗄️ Database Design

* Fully normalized (BCNF)
* Uses:

  * Primary Keys
  * Foreign Keys
  * Composite Keys
  * Constraints & Indexing

### Core Tables:

* USERS
* STUDENTS
* COMPANIES
* INTERNSHIPS
* APPLICATIONS
* TAGS
* STUDENT_SKILLS
* INTERNSHIP_TAGS

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd vit-skill-match
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file using `.env.example`

---

### 4. Setup Database

* Install PostgreSQL
* Run SQL schema (provided in project)

---

### 5. Run Backend

```bash
cd server
node server.js
```

---

### 6. Run Frontend

```bash
npm run dev
```

---

## 📈 Key Highlights

* SQL-first backend architecture
* Real-world database normalization (BCNF)
* Clean separation of frontend & backend
* Scalable and modular design

---

## 📚 Academic Context

Developed as part of:

**Course:** Database Systems
**Institution:** VIT Chennai

---

## 👨‍💻 Author

**Gaurish Budhiraja**

---

## 🔮 Future Enhancements

* JWT Authentication
* Real-time notifications
* AI-based recommendation engine
* Resume parsing

---

## ⭐ Final Note

This project demonstrates the integration of **frontend development, backend APIs, and relational database design**, forming a complete full-stack system.

---
