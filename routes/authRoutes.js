const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser } = require('../controllers/authController');
const { forgotPassword, resetPassword} = require('../controllers/passwordController');
const router = express.Router();

router.post(
  '/register',
  [
    // Validation for the name field to ensure it's not empty and contains only letters and spaces
    check('name', 'Name is required')
      .not()
      .isEmpty()
      .withMessage('Name cannot be empty')
      .matches(/^[A-Za-z\s]+$/)
      .withMessage('Name must contain only letters and spaces'),  // New validation to disallow numbers
    // Validation for the email field
    check('email', 'Please include a valid email').isEmail(),
    // Validation for the password field
    check('password', 'Password must be at least 6 characters and contain a number')
      .isLength({ min: 6 })
      .matches(/\d/),
  ],
  registerUser
);
// Route for Forgot Password (requesting password reset link)
router.post('/forgot-password', forgotPassword);

// Route for resetting the password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
