const express = require('express');
const router = express.Router();
const ServiceProviderController = require('../Controllers/ServiceProviderController');


router.post('/',ServiceProviderController.createServiceProvider);