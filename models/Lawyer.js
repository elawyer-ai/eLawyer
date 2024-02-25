const mongoose = require('mongoose');


const LawyerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    copnum: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    
  });
  

  const Lawyer = mongoose.model('Lawyer', LawyerSchema);

  module.exports = Lawyer;