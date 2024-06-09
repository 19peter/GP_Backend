const express = require('express');
const router = express.Router();
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');
///MIDDLEWARES
const multerUpload = require('../Middlewares/MulterUpload')
const googleUpload = require('../Middlewares/GoogleUpload')


router.post('/', multerUpload, googleUpload, ServiceProviderController.createServiceProvider);



module.exports = router;