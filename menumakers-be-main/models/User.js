const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  verified: {
    type: Boolean,
    default: false,
  },
  createdMenus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
});

module.exports = mongoose.model('User', UserSchema);
