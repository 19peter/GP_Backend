const express = require('express');
const router = express.Router();
const multer = require('multer');
///CONTROLLERS
const ServiceProviderController = require('../Controllers/ServiceProviderController');
///MIDDLEWARES
const multerUpload = require('../Middlewares/MulterUpload');
const googleUpload = require('../Middlewares/GoogleUpload');
const serverImagesCleanUp = require('../Middlewares/ServerImagesCleanUp')

////USING MULTER MW FOR PARSING MULTIPART/FORMDATA IN REQUEST AND ATTACHING DATA TO REQ.BODY AND REQ.FILES TO BE  
////AVAILABLE IN ALL MIDDLEWARES
const multerRequestFormDataParser = multer().array('image', 4);

router.post('/', multerRequestFormDataParser, ServiceProviderController.createServiceProvider, multerUpload, googleUpload, serverImagesCleanUp);

router.get('/', ServiceProviderController.getServiceProvider);

router.get('/nearest', ServiceProviderController.getNearestProviders);

module.exports = router;