const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review '],
    maxlength: 70
  },
  text: {
    type: String,
    required: [true, 'Please add the text for your review'],
    minlength: 15
  },
  rating:{
      type: String,
      min: 1,
      max: 10,
      required: [true, 'Please add rating between 1 and 10 '],

  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});


module.exports = mongoose.model('Review', ReviewSchema);