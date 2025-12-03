-- Database Creation Script for POS System

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Admin', 'Cashier'))
);

-- Items Table
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    phone_number INTEGER PRIMARY KEY
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('SALE', 'RENTAL', 'RETURN')),
    customer_phone INTEGER,
    FOREIGN KEY (customer_phone) REFERENCES customers(phone_number)
);

-- Transaction Lines Table
CREATE TABLE IF NOT EXISTS transaction_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_sale REAL NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- Rentals Table (for tracking current rental status)
CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_phone INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    rental_date DATE NOT NULL,
    return_date DATE,
    status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'RETURNED')),
    FOREIGN KEY (customer_phone) REFERENCES customers(phone_number),
    FOREIGN KEY (item_id) REFERENCES items(id)
);
