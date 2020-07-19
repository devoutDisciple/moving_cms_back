const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// 获取订单通过
router.get('/getAll', (req, res) => {
	orderService.getAll(req, res);
});

// 订单数据汇总 getDataNum
router.get('/getDataNum', (req, res) => {
	orderService.getDataNum(req, res);
});

module.exports = router;
