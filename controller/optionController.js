const express = require('express');
const router = express.Router();
const optionService = require('../services/optionService');

router.get('/all', (req, res) => {
	optionService.all(req, res);
});

router.post('/updateStatus', (req, res) => {
	optionService.updateStatus(req, res);
});

module.exports = router;
