const express = require('express');
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');
const LoginController = require('../Controllers/LoginController')


router.post('/', ServiceProviderController.createServiceProvider);
router.get('/unapproved',ServiceProviderController.getUnapproved)
router.post('/updateApprovalStatus',ServiceProviderController.changeApprovalStatus)
router.post('/login',LoginController.ProviderLogin)
router.get('/', ServiceProviderController.getServiceProvider);
router.get('/count',ServiceProviderController.getCount)
router.get('/nearest', ServiceProviderController.getNearestProviders);

module.exports = router;