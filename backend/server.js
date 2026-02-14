
const path = require('path');
const fs = require('fs');
require("dotenv").config();

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('Loaded .env from:', envPath);
} else {
  require('dotenv').config();
  console.log('Using .env from current directory (backend/.env not found)');
}

console.log('JWT_SECRET:', process.env.JWT_SECRET );
console.log('MONGO_URI:', process.env.MONGO_URI );

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();


const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin === corsOrigin) return cb(null, true);
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);


app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    message: 'Chest Disease Detection API',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});


app.get('/api/check-env', (req, res) => {
  res.json({
    JWT_SECRET_set: Boolean(process.env.JWT_SECRET),
    MONGO_URI_set: Boolean(process.env.MONGO_URI),
    database_readyState: mongoose.connection.readyState,
    database_connected: mongoose.connection.readyState === 1,
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not set in backend/.env - signup and login will fail');
  }
  connectDB()
    .then(() => console.log('MongoDB Connected:', mongoose.connection.host))
    .catch((err) => console.error('MongoDB connection failed:', err.message));
});
