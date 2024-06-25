const express = require('express');
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');
const LoginController = require('../Controllers/LoginController')


router.get('/', ServiceProviderController.getServiceProvider);

router.get('/unapproved', ServiceProviderController.getUnapproved)

router.get('/count', ServiceProviderController.getCount)

router.get('/nearest', ServiceProviderController.getNearestProviders);


router.post('/', ServiceProviderController.createServiceProvider);

router.post('/', ServiceProviderController.createServiceProvider);

router.post('/updateApprovalStatus', ServiceProviderController.changeApprovalStatus)

router.post('/login', LoginController.ProviderLogin)

router.post('/providers', ServiceProviderController.getServiceProvidersByIds);

// router.post('/login', LoginController.ProviderLogin)
module.exports = router;