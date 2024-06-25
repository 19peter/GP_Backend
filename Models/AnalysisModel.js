const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    providerId:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    numberOfRequests: {
        type: Number,
        required: true
    }
});

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    numberOfRequests: {
        type: Number,
        // required: true
    },
    
});

const servicesWithDatesSchema = new mongoose.Schema({
    requestDate:{
        type:Date,
        // required:true
    },
})

const analysisSchema = new mongoose.Schema(
    {
        providers:{
            type : [providerSchema],
            required : true
        },
        services:{
            type : [serviceSchema],
            // required:true
        },
        servicesWithDates:{
            type:[servicesWithDatesSchema],
            // required:true
        }

    }
)

module.exports = mongoose.model("analysis", analysisSchema);