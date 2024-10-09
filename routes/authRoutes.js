const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser } = require('../controllers/authController');
const router = express.Router();

router.post(
  '/register',
  registerUser
);

module.exports = router;
