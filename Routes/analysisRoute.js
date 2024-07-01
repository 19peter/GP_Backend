const analysisController = require('../Controllers/AnalysisController');


const express = require('express');
const router = express.Router();



router.post('/',analysisController.insertData)
router.get('/',analysisController.getAnalysisData)

module.exports = router