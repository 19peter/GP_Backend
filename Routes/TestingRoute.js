const express = require('express');
const TestController = require('../Controllers/TestController');

const router = express.Router();

router.get('/', TestController.testingResponse);
// router.post('/', TestController.testingPost);


module.exports = router;