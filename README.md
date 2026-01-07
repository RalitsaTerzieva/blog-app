# Blog App 📝

A full-stack **Blog Application** built with **GraphQL**, **Apollo**, **Prisma v3**, **PostgreSQL**, and **React**. The app supports authentication, user profiles, and complete post management (create, update, delete, publish/unpublish).

---

## ✨ Features

### 🔐 Authentication & Authorization

* User **signup** and **signin**
* JWT-based authentication
* Auth token stored in `localStorage`
* Protected mutations and queries
* Authorization checks (users can only manage their own posts)

### 👤 Users & Profiles

* User profiles with bio
* View other users’ profiles
* `isMyProfile` flag for conditional UI (edit/create only on your own profile)

### 📰 Posts

* Create posts
* Update posts
* Delete posts
* Publish / Unpublish posts
* Draft posts visible only to the author
* Published posts visible to everyone

### ⚙️ Tech Stack

#### Backend

* **Node.js**
* **GraphQL** (Apollo Server)
* **Prisma v3** ORM
* **PostgreSQL**
* **JWT** for authentication

#### Frontend

* **React**
* **Apollo Client**
* **React Router**
* **GraphQL Queries & Mutations**

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/RalitsaTerzieva/blog-app
cd blog-app
```

---

## 🛠 Backend Setup (Server)

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in `/server`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"
JWT_SECRET="your_jwt_secret"
```

### Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### Start Server

```bash
npm run start:dev
```


---

## 🎨 Frontend Setup (Client)

```bash
cd client
npm install
npm start
or
NODE_OPTIONS=--openssl-legacy-provider npm start
```

---

## 📦 Git Ignore

```gitignore
node_modules/
.env
dist/
build/
```



