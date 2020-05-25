const express = require('express');
const router = express.Router();
const clothingService = require('../services/clothingService');

// 增加衣物
router.post('/add', (req, res) => {
	clothingService.add(req, res);
});

// 删除衣物
router.post('/deleteById', (req, res) => {
	clothingService.deleteById(req, res);
});

// 获取衣物根据商店id
router.get('/getByshopid', (req, res) => {
	clothingService.getByShopid(req, res);
});

// 更新衣物
router.post('/update', (req, res) => {
	clothingService.update(req, res);
});

module.exports = router;
