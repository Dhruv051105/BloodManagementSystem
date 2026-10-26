# 🩸 Blood Management System

A full-stack web application designed to manage blood donations, blood stock, donors, patients, donation requests, donor schedules, and blood issue requests through a centralized platform.

The system provides a user-friendly interface for managing blood-related operations using a React frontend, Node.js/Express backend, and MongoDB database.

---

## 📌 Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Role-based access control
- Secure authentication middleware

### 🩸 Blood Stock Management

- View available blood stock
- Manage different blood groups
- Track blood inventory
- Update blood stock
- Manage blood issue requests
- Maintain blood availability records

### ❤️ Donor Management

- Register blood donors
- Manage donor information
- View donor details
- Manage donor availability
- Schedule blood donations

### 🏥 Patient Management

- Register patient information
- Create patient blood requests
- Track patient requests
- Manage required blood groups
- Manage patient-related blood requirements

### 🩸 Donation Management

- Create donation requests
- Manage donation requests
- Track donation information
- Schedule donor appointments
- Maintain donation records

### 📋 Blood Issue Management

- Create blood issue requests
- Manage blood issue requests
- Track issued blood
- Check available blood stock
- Manage blood distribution

### 📊 Dashboard

- Centralized dashboard
- Easy navigation between modules
- User-friendly interface
- Responsive React-based interface
- Organized management of blood-related operations

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- React Icons
- React Toastify
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv

### Development Tools

- Git
- GitHub
- Nodemon
- Visual Studio Code

---

## 📁 Project Structure

```text
BloodManagementSystem/
│
├── client/                         # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── App.js
│       ├── App.css
│       └── index.js
│
├── server/                         # Node.js / Express backend
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bloodController.js
│   │   ├── bloodIssueController.js
│   │   ├── donationController.js
│   │   ├── donorScheduleController.js
│   │   └── patientController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── BloodIssue.js
│   │   ├── BloodStock.js
│   │   ├── DonationRequest.js
│   │   ├── DonorSchedule.js
│   │   ├── PatientRequest.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bloodIssueRoutes.js
│   │   ├── bloodRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── donorScheduleRoutes.js
│   │   └── patientRoutes.js
│   │
│   └── server.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Prerequisites

Before running this project, make sure you have the following installed:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git
- Visual Studio Code

---

## 🚀 Getting Started

Follow the steps below to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Dhruv051105/BloodManagementSystem.git
```

### 2. Navigate to the Project

```bash
cd BloodManagementSystem
```

---

# 🖥️ Frontend Setup

### 1. Navigate to the Client Folder

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the React Development Server

```bash
npm start
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# ⚙️ Backend Setup

Open a new terminal while keeping the frontend running.

### 1. Navigate to the Server Folder

From the project root:

```bash
cd server
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your actual MongoDB connection string and JWT secret.

### 4. Start the Backend

```bash
npm start
```

For development using Nodemon:

```bash
npm run dev
```

The backend will normally run at:

```text
https://blood-management-system-api-7p86.onrender.com
```

---

## 🔑 Environment Variables

The backend uses environment variables to store configuration and sensitive information.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### ⚠️ Important

Never upload your actual `.env` file to GitHub.

Do not expose:

- Database passwords
- MongoDB connection strings containing credentials
- JWT secrets
- API keys
- Other private credentials

The `.gitignore` file is configured to prevent `.env` files from being committed.

---

## 🔗 API Modules

The backend contains API routes for the major modules of the application.

| Module | Route |
|---|---|
| Authentication | `/api/auth` |
| Blood Stock | `/api/blood` |
| Donation Requests | `/api/donation` |
| Patient Requests | `/api/patient` |
| Donor Schedule | `/api/donor-schedule` |
| Blood Issues | `/api/blood-issue` |

---

## 🏗️ Application Architecture

```text
                    ┌──────────────────────┐
                    │      React Client    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTP / Axios
                               ▼
                    ┌──────────────────────┐
                    │   Express.js Server  │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │ Controllers │  │ Middleware  │  │   Routes    │
       └──────┬──────┘  └─────────────┘  └─────────────┘
              │
              ▼
       ┌─────────────┐
       │  Mongoose   │
       │   Models    │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │   MongoDB   │
       │   Database  │
       └─────────────┘
```

---

## 🔄 Main Application Modules

### 1. Authentication

Handles:

- User registration
- User login
- Authentication
- Authorization
- Protected routes

### 2. Blood Stock

Handles:

- Blood group information
- Blood availability
- Blood inventory
- Stock management

### 3. Donor Management

Handles:

- Donor information
- Donor scheduling
- Donation availability
- Donor-related operations

### 4. Patient Requests

Handles:

- Patient information
- Blood requirements
- Blood requests
- Request tracking

### 5. Donation Requests

Handles:

- Blood donation requests
- Donation scheduling
- Donation information

### 6. Blood Issue

Handles:

- Blood issue requests
- Blood distribution
- Blood availability
- Issued blood records

---

## 🔐 Security

The application implements several security mechanisms, including:

- JWT authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based authorization
- Environment variables for sensitive configuration
- `.gitignore` protection for sensitive files

---

## 💻 Development

To contribute or modify the project:

### 1. Clone the repository

```bash
git clone https://github.com/Dhruv051105/BloodManagementSystem.git
```

### 2. Create a new branch

```bash
git checkout -b feature-name
```

### 3. Make your changes

Modify the required frontend or backend files.

### 4. Check your changes

```bash
git status
```

### 5. Add the changes

```bash
git add .
```

### 6. Commit the changes

```bash
git commit -m "Describe your changes"
```

### 7. Push the branch

```bash
git push origin feature-name
```

---

## 📦 Useful Git Commands

### Check status

```bash
git status
```

### Add changes

```bash
git add .
```

### Commit changes

```bash
git commit -m "Your commit message"
```

### Push changes

```bash
git push
```

### Pull latest changes

```bash
git pull
```

### View branches

```bash
git branch
```

---

## 🚧 Future Enhancements

Possible future improvements include:

- Email notifications
- SMS notifications
- Blood donation reminders
- Advanced dashboard analytics
- Blood stock alerts
- Search and filtering improvements
- Hospital management
- Blood bank management
- Donation history
- Patient history
- Advanced reporting
- Export reports to PDF/Excel
- Improved mobile responsiveness
- Cloud deployment
- Automated testing

---

## 🌐 Repository

GitHub Repository:

https://github.com/Dhruv051105/BloodManagementSystem

---

## 👨‍💻 Author

### Dhruv B Shah

GitHub:

https://github.com/Dhruv051105

---

## 📄 License

This project was developed for educational and project purposes.
