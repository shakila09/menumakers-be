const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Registration Route
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces'),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters long and contain an uppercase, lowercase, number, and special character')
      .isLength({ min: 8 })
      .matches(/[a-z]/)
      .matches(/[A-Z]/)
      .matches(/\d/)
      .matches(/[\W_]/)
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    registerUser(req, res);
  }
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    loginUser(req, res);
  }
);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password/:token', resetPassword);

module.exports = router;