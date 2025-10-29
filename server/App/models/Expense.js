const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Bills', 'Shopping', 'Other']
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // linked to User model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('expense', expenseSchema);
