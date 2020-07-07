const express = require("express");
const router = express.Router();
const evaluateService = require("../services/evaluateService");

// 获取所有评价
router.get("/getAll", (req, res) => {
	evaluateService.getAll(req, res);
});

// 根据商品id获取评价
router.get("/getEvaluateByGoodsId", (req, res) => {
	evaluateService.getEvaluateByGoodsId(req, res);
});

// 获取用户评价 getEvaluateByOpenid
router.get("/getEvaluateByOpenid", (req, res) => {
	evaluateService.getEvaluateByOpenid(req, res);
});

// 通过商店id获取商品评价 getEvaluateByShopId
router.get("/getEvaluateByShopId", (req, res) => {
	evaluateService.getEvaluateByShopId(req, res);
});

// 通过商店名称筛选 getEvaluate
router.get("/getEvaluate", (req, res) => {
	evaluateService.getEvaluate(req, res);
});

// 根据订单id获取评价 getEvaluateByOrderId
router.get("/getEvaluateByOrderId", (req, res) => {
	evaluateService.getEvaluateByOrderId(req, res);
});

module.exports = router;
