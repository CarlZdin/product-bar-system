# Product Bar System

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
DATABASE_URL="" //transaction pooler
DIRECT_URL="" //session pooler
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

**Body:**
```json
{
  "userId": 1
}
```

### 4️⃣ Check-Out

**Endpoint:** `POST /session/check-out`

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": 1
}
```

### 5️⃣ Redeem Product

**Endpoint:** `POST /redemption/redeem`

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userId": 1
}
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

---

## ✅ Done!

You now have the **Product Bar System** running with **NestJS + Prisma + Supabase**! 🎉

Let me know if you need further assistance!
