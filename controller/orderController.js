const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// 获取订单通过
router.get('/getAll', (req, res) => {
	orderService.getAll(req, res);
});

module.exports = router;
