const express = require('express');

const router = express.Router();
const exceptionService = require('../services/exceptionService');

// 获取订单通过分页
router.get('/getAllByPagesize', (req, res) => {
	exceptionService.getAllByPagesize(req, res);
});

module.exports = router;
