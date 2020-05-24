const express = require('express');
const router = express.Router();
const testService = require('../services/testService');

// 登录
router.get('/login', (req, res) => {
	testService.login(req, res);
});

// getState
router.get('/getState', (req, res) => {
	testService.getState(req, res);
});

module.exports = router;
