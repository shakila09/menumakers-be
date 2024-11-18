const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  templateName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  previewUrl: {
    type: String,
    required: true, // This field is causing the error because it's required
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Template', TemplateSchema);
