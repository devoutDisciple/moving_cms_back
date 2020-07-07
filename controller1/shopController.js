const express = require('express');
const router = express.Router();
const shopService = require('../services/shopService');

// 获取所有店铺信息
router.get('/all', (req, res) => {
	shopService.getAll(req, res);
});

// 根据店铺id获取店铺信息 getShopDetailById
router.get('/getShopDetailById', (req, res) => {
	shopService.getShopDetailById(req, res);
});

// 更新店铺信息
router.post('/updateShop', (req, res) => {
	shopService.updateShop(req, res);
});

// 更新店铺位置信息
router.post('/updateShopSite', (req, res) => {
	shopService.updateShopSite(req, res);
});

// 根据店铺id获取店铺
router.post('/addShop', (req, res) => {
	shopService.addShop(req, res);
});

// 删除店铺
router.post('/delete', (req, res) => {
	shopService.deleteShop(req, res);
});

// 根据店铺id获取店铺账户
router.get('/getAccountByShopId', (req, res) => {
	shopService.getAccountByShopId(req, res);
});

// -------------

// 获取所有店铺信息为了下拉框
// router.get('/getAllForSelect', (req, res) => {
// 	shopService.getAllForSelect(req, res);
// });

// // 确认开店或者关店
// router.post('/closeOrOpen', (req, res) => {
// 	shopService.closeOrOpen(req, res);
// });

// // 修改店铺
// router.post('/update', (req, res) => {
// 	shopService.updateShop(req, res);
// });

// // 获取小程序二维码
// router.get('/getAccessCode', (req, res) => {
// 	shopService.getAccessCode(req, res);
// });

// 是否开启自动打印 StartAutoPrint
// router.post('/startAutoPrint', (req, res) => {
// 	shopService.startAutoPrint(req, res);
// });

module.exports = router;
