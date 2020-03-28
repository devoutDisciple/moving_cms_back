const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// 获取所有用户
router.get("/all", (req, res) => {
	userService.all(req, res);
});
// 用户注册，返回openid
router.get("/register", (req, res) => {
	userService.register(req, res);
});
// 通过openid获取用户信息
router.get("/getUserByOpenid", (req, res) => {
	userService.getUserByOpenid(req, res);
});
// 填写收货地址
router.post("/addAddress", (req, res) => {
	userService.addAddress(req, res);
});
// 更改收货地址
router.post("/updateAddress", (req, res) => {
	userService.updateAddress(req, res);
});

module.exports = router;
