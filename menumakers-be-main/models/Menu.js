const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  title: String,
  items: [
    {
      category: String,
      items: [
        {
          name: String,
          description: String,
          price: Number,
        },
      ],
    },
  ],
  template: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Menu', MenuSchema);
