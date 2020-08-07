const express = require('express');
const router = express.Router();
const billService = require('../services/billService');

// 获取所有根据用户id
router.get('/getAllByUserid', (req, res) => {
	billService.getAllByUserid(req, res);
});

// 获取销售额
router.get('/getMoneyNumByTime', (req, res) => {
	billService.getMoneyNumByTime(req, res);
});

// 根据收费类型获取数据
router.get('/getAllMoneyByType', (req, res) => {
	billService.getAllMoneyByType(req, res);
});

module.exports = router;
