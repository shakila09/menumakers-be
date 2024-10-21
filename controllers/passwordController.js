const User = require('../models/User'); // assuming a User model is already defined
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Forgot password controller (sending email with reset link)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if user with this email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Store the token in the user's record (hashed)
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hash;
    user.resetPasswordExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Create a reset link
    const resetLink = `http://localhost:5173/ResetPassword/${resetToken}`;

    // Configure the nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: 'menumakers12@gmail.com',
        pass: 'qisriszbychdgufn',
      },
    });

    // Send email to the user
    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    // Send a success response
    res.status(200).json({ message: 'Password reset link sent to your email.' });

  } catch (error) {
    console.log("error " + error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

// Reset password controller (handling new password submission)
exports.resetPassword = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token to compare it with the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user with this reset token and check if it's still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() } // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password and update the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Remove the reset token and expiry time from the user record
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset.' });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};
