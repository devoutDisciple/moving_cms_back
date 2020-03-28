const express = require("express");
const router = express.Router();
const countService = require("../services/countService");

// 获取会员总量, 销售额，订单，商铺量
router.get("/num", (req, res) => {
	countService.getCount(req, res);
});
// 获取会员曲线
router.get("/users", (req, res) => {
	countService.getUsers(req, res);
});
// // 获取销售总额
// router.get("/sales/money", (req, res) => {
// 	countService.getSalesMoney(req, res);
// });
// // 获取订单总量
// router.get("/order/num", (req, res) => {
// 	countService.getOrderNum(req, res);
// });
// // 获取商铺总量
// router.get("/shop/num", (req, res) => {
// 	countService.getShopNum(req, res);
// });
module.exports = router;
