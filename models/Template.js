const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema(
  {
    userId: String,
    templateName: String,
    imageUrl: String,
    previewUrl: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model('Template', TemplateSchema);