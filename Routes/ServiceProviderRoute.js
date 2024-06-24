const express = require('express');
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');
const LoginController = require('../Controllers/LoginController')
router.post('/', ServiceProviderController.createServiceProvider);
router.post('/login',LoginController.ProviderLogin)
router.get('/', ServiceProviderController.getServiceProvider);

router.get('/nearest', ServiceProviderController.getNearestProviders);

module.exports = router;