# Project: StudentApply

StudentApply is a modern Next.js application designed to compare the use cases of PostgreSQL and MongoDB within the same architecture.

---

## Architecture & Database Design

### 1. PostgreSQL (Relational Database)

- **Purpose:** Handles relational, structured, and transactional data that requires strong consistency and integrity.
- **Entities:**
  - `User`: Application tracking and user authentication.
  - `Program`: University programs (Bachelor, Master, Professional Certificate).
  - `ApplicationStatus`: Immutable records tracking the progression of an application.

### 2. MongoDB (Document Database)

- **Purpose:** Handles semi-structured, highly dynamic data and document references.
- **Entities:**
  - `DynamicForm`: Flexible schema allowing universities to change the required fields per program type.
  - `SubmissionData`: The actual answers to the dynamic form and links to uploaded documents (S3 or local storage).

---

## Tech Stack

- **Framework:** Next.js (App Router, React)
- **Styling:** Tailwind CSS
- **ORM / Database Clients:** Prisma (for PostgreSQL) and Mongoose/Prisma (for MongoDB)

---

## Project Setup Instructions

1. **Environment Variables:** Create a `.env.local` file with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/studentapply_postgres"
   MONGODB_URI="mongodb://localhost:27017/studentapply_mongo"
   ```
