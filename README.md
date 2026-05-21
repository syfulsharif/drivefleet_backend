# 🚀 DriveFleet Backend API

A robust, secure, and scalable backend engine for the **DriveFleet** Car Rental Platform. Built with Node.js and Express, it provides secure authentication, protected CRUD operations for vehicle management, and an efficient booking system.

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Token-based authentication |
| Helmet, CORS, Bcrypt.js | Security |

---

## ✨ Features

- **JWT-based Authentication** — Secure login/registration with HTTPOnly cookie sessions
- **Role-Based Access Control** — Middleware protection for admin-only routes
- **Advanced Querying** — Search and filter vehicles using `$regex` and type parameters
- **Inventory Management** — Automatic stock and booking count updates via `$inc`
- **CORS Enabled** — Ready for cross-origin frontend deployment

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Authenticate user & set HTTPOnly cookie |
| `POST` | `/api/auth/logout` | Clear authentication cookies |

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cars` | Fetch all cars (supports `?search=name&type=SUV`) |
| `POST` | `/api/cars` | Add a new car listing *(Private)* |
| `PUT` | `/api/cars/:id` | Update car details *(Private/Owner-only)* |
| `DELETE` | `/api/cars/:id` | Remove a car listing *(Private/Owner-only)* |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings/my-bookings` | Fetch user's booking history *(Private)* |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/syfulsharif/drivefleet-backend.git
cd drivefleet-backend

# Install dependencies
npm install

# Start the server
npm run dev      # Development mode (with nodemon)
npm start        # Production mode
```

---

## 🛡 Security Practices

- **Password Hashing** — All passwords encrypted with bcrypt before storage
- **JWT Validation** — Sensitive routes protected by custom middleware
- **CORS Protection** — Configured to accept requests from trusted origins only

---

## 📂 Project Structure

```
├── controllers/         # Route handlers
├── middlewares/        # Auth middleware
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── index.js            # Application entry point
├── vercel.json         # Vercel deployment config
└── package.json        # Dependencies & scripts
```