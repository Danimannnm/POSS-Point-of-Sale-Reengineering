import "dotenv/config";
import express from "express";
import cors from "cors";

import "./config/db.js";

import employeeRoutes from "./routes/employeeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cashierRoutes from "./routes/cashierRoutes.js";
import inventoryRoutes from "./routes/inventory.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost during development
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }

    // Check allowed origins
    const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
    if (allowedOrigins.indexOf(origin) === -1) {
      // In dev, we can be lenient or strict. Let's strict to known + dynamic localhost
      // For now, strict 'localhost' regex above covers 5173, 5174, etc.
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // Log request body for non-GET requests (mask passwords)
  if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '***';
    console.log(`  Body:`, sanitizedBody);
  }

  // Log query params if present
  if (Object.keys(req.query || {}).length > 0) {
    console.log(`  Query:`, req.query);
  }

  next();
});

// lightweight health check
app.get("/", (req, res) => {
  console.log("✓ Health check OK");
  res.status(200).send({ status: "ok", time: new Date().toISOString() });
});

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cashier", cashierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transaction", transactionRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      '/api/admin/*',
      '/api/cashier/*',
      '/api/employees/*',
      '/api/inventory/*',
      '/api/transaction/*'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`❌ Error on ${req.method} ${req.path}:`);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

export default app;
