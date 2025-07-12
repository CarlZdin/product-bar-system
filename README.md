# Product Bar System

## Introduction

The **Product Bar System** is a comprehensive platform designed to manage user memberships, session tracking, and product redemption efficiently. It provides the following features:

### 1️⃣ User Registration & Authentication
- Users can register with their name, email, and password.
- Login functionality is provided using email and password.
- Password reset is available via email.

### 2️⃣ Membership Purchase & Credits
- Upon registration, users must purchase a $100 membership.
- Successful payment grants users $100 in credits.

### 3️⃣ Check-In & Check-Out (Session Tracking)
- Users can check in to start a session.
- Users can check out to end a session.
- The system calculates the total session duration.
- Upon checkout, users are charged $25 per hour (rounded to the nearest hour) from their credit balance.

### 4️⃣ Product Redemption
- Users can redeem one product every minute.
- Each redeemed product costs $2.
- The system deducts the product cost from available credits.
- Tracks the total products redeemed by each user.

---

## 🚀 How to Run the Project

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start the Development Server

```bash
npm run start:dev
```

The server will start at `http://localhost:3000`.

---

## 📦 Database Migration

### 1️⃣ Initialize Prisma

Ensure the `prisma/schema.prisma` file is configured correctly.

Run the following command to initialize Prisma:

```bash
npx prisma init
```

### 2️⃣ Apply Migrations

Run the following command to apply migrations:

```bash
npx prisma migrate dev --name <migration_name>
```

### 3️⃣ Generate Prisma Client

Run the following command to generate the Prisma client:

```bash
npx prisma generate
```

---

## 🔧 Environment Variables

### 1️⃣ Configure `.env` File

Create a `.env` file in the root directory and add the following variables:

```env
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
JWT_SECRET="" //your_JWT_secret_key
DATABASE_URL="" //supabase connection-transaction pooler
DIRECT_URL="" //supabase connection-session pooler
ENCRYPTION_ALGO1="aes-256-cbc"
```

---

## 🛠️ Postman API Requests

### 1️⃣ User Registration

**Endpoint:** `POST /auth/register`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com", //use your real email
  "password": "password123"
}
```

### 2️⃣ User Login

**Endpoint:** `POST /auth/login`

**Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 3️⃣ Check-In

**Endpoint:** `POST /session/check-in`

**Headers:**

```http
Authorization: Bearer <token>
```

### 4️⃣ Check-Out

**Endpoint:** `POST /session/check-out`

**Headers:**

```http
Authorization: Bearer <token>
```

### 5️⃣ Redeem Product

**Endpoint:** `POST /redemption/redeem`

**Headers:**

```http
Authorization: Bearer <token>
```

### 6️⃣ Password Reset

**Endpoint:** `POST /auth/reset-password`

**Body:**

```json
{
  "email": "john.doe@example.com"
}
```

**Response:**

```json
{
  "message": "Password reset link sent to your email."
}
```

### 7️⃣ Set New Password

**Endpoint:** `POST /auth/set-password`

**Body:**

```Bash
Password Reset Link
http://localhost:3000/reset-password#access_token="access_token"&expires_at=1752277099&expires_in=3600&refresh_token="refresh_token"&token_type=bearer&type=recovery
```

```json
{
  "access_token": "",
  "refresh_token": "",
  "new_password": "newpassword"
}
```

**Response:**

```json
{
  "message": "Password updated successfully."
}
```

### 8️⃣ User Logout

**Endpoint:** `POST /auth/logout`

**Headers:**

```http
Authorization: Bearer <token>
```

---

## ✅ Done!

You now have the **Product Bar System** running with **NestJS + Prisma + Supabase**! 🎉


