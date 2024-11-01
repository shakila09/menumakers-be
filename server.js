const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

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
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173', // Replace with your frontend URL
//   methods: ['GET', 'POST'],       // Specify allowed methods
//   allowedHeaders: ['Content-Type'], // Specify allowed headers
// }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 3600000 }, // 1 hour
  })
);

// Routes
app.use('/api/auth', authRoutes); // path matches your route folder structure
// Use the payment route
app.use('/api/payment', paymentRoutes);
// Start server
const PORT = process.env.PORT || 5001 || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


