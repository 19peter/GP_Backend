const express = require('express');
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');

router.post('/', ServiceProviderController.createServiceProvider);

router.get('/', ServiceProviderController.getServiceProvider);

router.get('/nearest', ServiceProviderController.getNearestProviders);

module.exports = router;