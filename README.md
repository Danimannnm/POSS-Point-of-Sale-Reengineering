# POSS - Point of Sale System (Reengineering Project)

## 📋 Overview

A comprehensive Point-of-Sale (POS) web application built as part of a software reengineering initiative. This system provides complete retail management functionality including sales processing, inventory management, employee administration, and transaction tracking.

**Tech Stack:**
- **Frontend:** React 19 + Vite 7 + React Router
- **Backend:** Node.js + Express 5
- **Database:** MongoDB with Mongoose ODM
- **Testing:** Vitest + Supertest

## 🚀 Features

### Admin Features
- **Employee Management:** Add, edit, and manage employee accounts
- **Inventory Control:** Full CRUD operations for inventory items
- **Purchase Order Management:** Handle purchase orders and rentals (POH/POR)
- **Transaction History:** View and analyze all sales transactions
- **Reporting:** Access comprehensive business analytics

### Cashier Features
- **Point of Sale:** Process sales transactions with intuitive interface
- **Payment Processing:** Support for multiple payment methods
- **Item Entry:** Quick item lookup and entry
- **Customer Management:** Handle customer information and transactions
- **Return Processing:** Manage product returns
- **Rental Management:** Process rental transactions
- **Coupon Application:** Apply discounts and promotional codes

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Danimannnm/POSS-Point-of-Sale-Reengineering.git
   cd POSS-Point-of-Sale-Reengineering
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   # For development with auto-reload:
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend (in a separate terminal):**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`

## 🔐 Login Credentials

Use the following credentials to access the system:

| Role    | Username | Password     | Access Level |
|---------|----------|--------------|--------------|
| Admin   | admin    | admin123     | Full system access |
| Cashier | cashier  | cashier123   | POS and transaction access |

*Note: Select the appropriate role on the login page.*

## 🧪 Testing

### Run Server Tests
```bash
cd server
npm test

# Watch mode for development
npm run test:watch
```

### Run Client Tests
```bash
cd client
npm test
```

### Test Coverage
- Unit tests for all controllers, routes, and services
- Integration tests for API endpoints
- Model validation tests
- Frontend component tests

## 📁 Project Structure

```
POS_WebApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   ├── context/       # React context providers
│   │   └── __tests__/     # Frontend tests
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration files
│   │   └── tests/         # Backend tests
│   └── package.json
├── docs/                  # Documentation
└── README.md
```

## 🗄️ Database Models

- **User:** Authentication and authorization
- **Employee:** Staff information and roles
- **Inventory:** Product stock management
- **Transaction:** Sales records
- **SaleInvoice:** Invoice generation
- **Customer:** Customer information
- **Rental:** Rental transaction tracking
- **ReturnItem:** Product return handling
- **Coupon:** Discount and promotion codes
- **Item:** Product catalog

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin Routes
- `GET /api/admin/employees` - List all employees
- `POST /api/admin/employees` - Add new employee
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Remove employee

### Cashier Routes
- `POST /api/cashier/transaction` - Process sale
- `GET /api/cashier/inventory` - View inventory
- `POST /api/cashier/return` - Process return
- `POST /api/cashier/rental` - Process rental

### Inventory Routes
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Remove inventory item

### Transaction Routes
- `GET /api/transactions` - List all transactions
- `GET /api/transactions/:id` - Get transaction details

## 🤝 Contributing

This is an academic project for the Software Reengineering course (SRE). 

## 📝 Notes

- Ensure MongoDB is running before starting the backend server
- The backend must be running before the frontend can authenticate users
- Environment variables must be configured properly for database connectivity
- For production deployment, update authentication mechanism and secure credentials

## 📄 License

This project is developed for educational purposes as part of Semester 7 coursework.

## 👥 Team

**Course:** Software Reengineering (SRE)  
**Semester:** 7  
**Academic Year:** 2025-2026


