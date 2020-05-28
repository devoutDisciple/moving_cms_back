const express = require('express');
const router = express.Router();
const testService = require('../services/testService');

// 登录
router.get('/login', (req, res) => {
	testService.login(req, res);
});

// 获取格口状态
router.get('/getState', (req, res) => {
	testService.getState(req, res);
});

// 开启格口
router.get('/open', (req, res) => {
	testService.open(req, res);
});

module.exports = router;
