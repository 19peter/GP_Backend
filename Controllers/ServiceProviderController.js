const serviceProviderModel = require('../Models/ServiceProviderModel');

let createServiceProvider = async (req, res) => {
    // console.log(req);
    console.log('controller');

    res.json("controller")
}


module.exports = {createServiceProvider}