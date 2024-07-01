const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  password: {
    type: String,
    required: true,
  },

  contact_number: {
    type: Number,
    required: true,
  },

  owned_cars: {
    type: [{ make: String, model: String, year: Number }],
  },

  history: {
    type: [
      {
        providerName: String,
        serviceName: String,
        servicePrice: Number,
        providerId: String,
      },
    ],
  },
});

module.exports = mongoose.model("users", userSchema);
