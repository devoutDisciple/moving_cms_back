const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// 获取订单通过分页
router.get('/getAllByPagesize', (req, res) => {
	orderService.getAllByPagesize(req, res);
});

// 订单数据汇总 getDataNum
router.get('/getDataNum', (req, res) => {
	orderService.getDataNum(req, res);
});

// 获取数据汇总 getSalesByTime
router.get('/getSalesByTime', (req, res) => {
	orderService.getSalesByTime(req, res);
});

// 获取订单种类汇总
router.get('/getOrderTypeNum', (req, res) => {
	orderService.getOrderTypeNum(req, res);
});

module.exports = router;
