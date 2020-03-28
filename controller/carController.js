const express = require("express");
const router = express.Router();
const carService = require("../services/carService");

// 根据用户id获取购物车信息
router.get("/getByOpenid", (req, res) => {
	carService.getByOpenid(req, res);
});
// 加入购物车
router.post("/addCarGoods", (req, res) => {
	carService.addCarGoods(req, res);
});
// 更改购物车数量 modifyNum
router.post("/modifyNum", (req, res) => {
	carService.modifyNum(req, res);
});


module.exports = router;
