# 🚀 DriveFleet Backend API

The robust, secure, and scalable backend engine for the **DriveFleet** Car Rental Platform. Built with Node.js and Express, it provides secure authentication, protected CRUD operations for vehicle management, and an efficient booking system.

---

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) stored in HTTPOnly cookies
- **Security:** Helmet, CORS, and Bcrypt.js for password hashing

---

## 🏗 Key Features
- **JWT-based Auth:** Secure login/registration with token-based session management.
- **Role-Based Protection:** Middleware to protect private routes (Add/Update/Delete cars).
- **Advanced Querying:** Support for search (using `$regex`) and filtering (by car type) via API parameters.
- **Inventory Management:** Automatic inventory updates and booking count increments using `$inc`.
- **Deployment Ready:** Configured for cross-origin resource sharing (CORS) to prevent deployment errors.

---

## ⚙️ Environment Variables
Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000


📡 API Endpoints
Authentication
POST /api/auth/register - Create a new user account.

POST /api/auth/login - Authenticate user and set HTTPOnly cookie.

POST /api/auth/logout - Clear authentication cookies.

Vehicles
GET /api/cars - Fetch all cars (Supports ?search=name&type=SUV query params).

POST /api/cars - Add a new car listing (Private).

PUT /api/cars/:id - Update specific car details (Private/Owner-only).

DELETE /api/cars/:id - Remove a car listing (Private/Owner-only).

Bookings
POST /api/bookings - Create a new booking.

GET /api/bookings/my-bookings - Fetch current user's booking history (Private).

🚀 Installation & Local Setup
Clone the repository:

Bash
   git clone [https://github.com/yourusername/drivefleet-backend.git](https://github.com/yourusername/drivefleet-backend.git)
   cd drivefleet-backend
Install dependencies:

Bash
   npm install
Start the server:

Bash
   # Development mode (nodemon)
   npm run dev
   
   # Production mode
   npm start
🛡 Security Practices
Password Hashing: All user passwords are encrypted using bcrypt before storage.

JWT Protection: Sensitive endpoints are guarded by a custom middleware that validates the JWT in the HTTPOnly cookie.

CORS Protection: Configured to accept requests only from the trusted frontend origin.