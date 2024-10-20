// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // The URL of your frontend
  credentials: true, // Allow credentials (cookies) to be shared
}));
app.use(express.json());

// Session setup
app.use(session({
  secret: 'menuMakersSecret', // Your session secret key
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://chandanjotsinghs2:chandanjotsinghs2@mycluster.bcmqn.mongodb.net/' }),
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://chandanjotsinghs2:chandanjotsinghs2@mycluster.bcmqn.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// User model definition (simplified)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Register route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  console.log('Login endpoint hit'); // Debugging log
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Dashboard route to provide user info after login
app.get('/api/dashboard', (req, res) => {
  console.log('Dashboard endpoint hit');
  console.log('Session data:', req.session);

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  res.status(200).json({ message: 'Welcome to your dashboard', user: req.session.user });
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
