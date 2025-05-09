# 📚 Library Management System API

<div align="center">
  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)

</div>

## 🌟 Overview

A modern RESTful API for a digital library management system built with TypeScript, Express, Prisma ORM, and PostgreSQL. This system allows users to register, browse, and reserve books from the library's collection with comprehensive tracking of reservation history.

## ✨ Features

### 👤 User Management

-   **Registration**: Create a new user account
-   **Authentication**: Secure login with JWT tokens
-   **Profile Management**: View and update user profiles
-   **Reservation History**: Track all books a user has borrowed

### 📖 Book Management

-   **Comprehensive Catalog**: Store and retrieve detailed book information
-   **Advanced Search**: Filter books by multiple criteria (genre, author, availability)
-   **Book Details**: View complete information about any book
-   **Inventory Control**: Track available copies of each book

### 🔄 Reservation System

-   **Book Borrowing**: Reserve available books
-   **Return Processing**: Mark books as returned and update inventory
-   **Due Date Tracking**: Set and monitor return dates

### 🔒 Security Features

-   **Role-based Access Control**: Different permission levels for users
-   **Soft Delete**: Records are never permanently removed
-   **JWT Authentication**: Secure API endpoints
-   **Input Validation**: Data validation with Zod schemas

## 🛠️ Tech Stack

-   **Language**: TypeScript
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Validation**: Zod
-   **Authentication**: JWT (JSON Web Tokens)
-   **Password Security**: bcrypt

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/lellerena/proyecto_1_backend
cd proyecto_1_backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment setup**

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. **Database setup**

```bash
npx prisma migrate dev --name init
```

5. **Start the server**

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 🔌 API Endpoints

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Authenticate and get token

### Users

-   `GET /api/users/profile` - Get current user profile
-   `GET /api/users/reservations/history` - Get user's reservation history
-   `PUT /api/users/:id` - Update user information
-   `DELETE /api/users/:id` - Deactivate user (soft delete)

### Books

-   `POST /api/books` - Create a new book (admin only)
-   `GET /api/books` - Search books with filters
-   `GET /api/books/:id` - Get book by ID
-   `PUT /api/books/:id` - Update book information (admin only)
-   `DELETE /api/books/:id` - Deactivate book (soft delete) (admin only)

### Reservations

-   `POST /api/reservations` - Create a new reservation
-   `GET /api/reservations/active` - Get current user's active reservations
-   `POST /api/reservations/return` - Return a borrowed book

## 📝 Testing

Use the included `req.http` file with the VS Code REST Client extension to test all API endpoints.

## 🔐 Environment Variables

| Variable       | Description                         |
| -------------- | ----------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string        |
| `JWT_SECRET`   | Secret key for JWT token generation |
| `PORT`         | Port the server will run on         |

## 📋 Database Schema

### User

-   ID, email, name, password, active status, permissions

### Book

-   ID, title, author, genre, published date, publisher, available copies, active status

### Reservation

-   ID, user ID, book ID, reservation date, return date, returned date, active status

### Permission

-   User ID, various permission flags (create/update/delete books and users)

## 👨‍💻 Development

The project follows a modular architecture:

-   **Controllers**: Handle request processing
-   **Routes**: Define API endpoints
-   **Middlewares**: Handle authentication, validation, etc.
-   **Schemas**: Define data validation with Zod
-   **Models**: Database schema defined with Prisma

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
