const express = require('express');
const router = express.Router();
const billService = require('../services/billService');

// 获取所有区域
router.get('/getAllByUserid', (req, res) => {
	billService.getAllByUserid(req, res);
});

module.exports = router;
