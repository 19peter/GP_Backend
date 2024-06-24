const express = require('express');
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');
const LoginController = require('../Controllers/LoginController')

router.get('/', ServiceProviderController.getServiceProvider);

router.get('/nearest', ServiceProviderController.getNearestProviders);

router.post('/', ServiceProviderController.createServiceProvider);

router.post('/providers', ServiceProviderController.getServiceProvidersByIds);

router.post('/login',LoginController.ProviderLogin)
module.exports = router;