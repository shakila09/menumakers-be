const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const templateRoutes = require('./routes/templateRoutes');

const app = express();

// Load environment variables from .env file
require('dotenv').config();
console.log('Environment Variables:', process.env);

// Connect to MongoDB with proper logging
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if there's a connection error
  });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend origin
  credentials: true // Allow credentials to be sent with the request
}));

app.use(express.json());

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false, // Avoid saving uninitialized sessions
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { 
      maxAge: 3600000, // 1 hour
      secure: false,    // Set to true if using HTTPS
      httpOnly: true    // Ensures cookie is only accessible by the web server
    }
  })
);


// Define the /api/auth/session route
app.get('/api/auth/session', (req, res) => {
  console.log('Session data:', req.session); // Debugging: Check if session data exists
  if (req.session && req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).json({ error: 'No active session' });
  }
});



// Routes
app.use('/api/auth', authRoutes); // path matches your route folder structure
app.use('/api/payment', paymentRoutes); // Use the payment route
app.use('/api/purchases', purchaseRoutes); // Adds purchase routes
app.use('/api/templates', templateRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});
