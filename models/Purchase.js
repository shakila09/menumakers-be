const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
