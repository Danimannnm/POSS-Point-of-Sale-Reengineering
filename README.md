# SG Technologies POS System

## Overview

This is a Point-of-Sale (POS) system built with React (frontend) and Node.js/Express (backend).  
It supports cashier and admin logins, employee management, and transaction processing.

## Setup

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies for both client and server:

   ```bash
   cd pos-system/client
   npm install
   cd ../server
   npm install
   ```

3. Start the backend server:

   ```bash
   npm start
   # or
   node src/index.js
   ```

4. Start the frontend (in a separate terminal):

   ```bash
   cd ../client
   npm run dev
   # or
   yarn dev
   ```

## Login Credentials

Use the following hardcoded credentials to log in:

| Role    | Username | Password     |
|---------|----------|--------------|
| Admin   | admin    | admin123     |
| Cashier | cashier  | cashier123   |

Select the appropriate role on the login page.

## Features

- Cashier and Admin authentication
- Employee management (Admin only)
- Transaction processing
- Purchase Order and Payment pages

## Notes

- The backend uses hardcoded login credentials for demonstration.
- Make sure the backend server is running before logging in from the frontend.
- If you encounter login issues, check that the backend routes are correctly mounted and accessible.


