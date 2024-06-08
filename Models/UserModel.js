const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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

    contact_number: {
        type: Number,
        required: true
    },

    owned_cars : {
        type: [{make : String, model : String, year: Number}]
    },
})

module.exports = mongoose.model("users", userSchema);