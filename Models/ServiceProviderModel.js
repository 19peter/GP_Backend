const mongoose = require('mongoose');


const serviceProviderSchema = new mongoose.Schema({
    location: {
        type : String,
        required: true
    },

    service_type: {
        type: String,
        enum: ["Repair", "PickUp", "PickUp And Repair"],
        required: true
    },

    name : {
        type: String,
        required: true
    },

    contact_number: {
        type: Number,
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

    profile_pic: {
        type: String,
        required: true
    },

    driving_lic: {
        type: String,
        required: true
    }, 

    car_lic: {
        type: String,
        required: true
    },

    nid_pic: {
        type: String,
        required: true
    },

    owned_cars : {
        type: [{make : String, model : String, year: Number}]
    },

    license_plate : {
        type: String,
        required: true,
        pattern: "/^[1-9]{3,4}[A-Za-z]{2,3}$/"
    }
})


module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);