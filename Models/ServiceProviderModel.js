const mongoose = require('mongoose');


const serviceProviderSchema = new mongoose.Schema({
    location: {
        type: [String],
    },

    live_location: {
        type: [String]
    },

    location: {
        live_location: { type: [String] },
        static_location: { type: [String] }
    },

    status: {
        type: String,
        enum: ["busy", "available"],
    },

    price_per_km: {
        type: Number
    },

    service_type: {
        type: String,
        enum: ["repair", "pickup", "pickup and repair"],
        required: true
    },

    name: {
        type: String,
        required: true
    },

    contact_number: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password: {
        type: String,
        required: true
    },

    profile_pic: {
        type: String
    },

    driving_lic: {
        type: String,
    },

    car_lic: {
        type: String,
    },

    nid_pic: {
        type: String,
    },

    owned_car: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        license_plate: { type: String, required: true, pattern: "/^[1-9]{3,4}[A-Za-z]{2,3}$/" }
    },
    approvalStatus: {
        type: String,
        enum: ["approved", "pending", "rejected"]
    },
    rating:{
        type:Number,
        default:0
    }

})

serviceProviderSchema.pre('save', function (next) {
    if (this.email) {
        this.profile_pic = `${this.email.split('.')[0]}_profile_pic`;
        this.car_lic = `${this.email.split('.')[0]}_car_licence`;
        this.nid_pic = `${this.email.split('.')[0]}_national_id_pic`;
        this.driving_lic = `${this.email.split('.')[0]}_driver_licence_pic`;
    }

    this.status = "available";
    next();
});

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);