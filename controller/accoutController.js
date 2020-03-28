const express = require("express");
const router = express.Router();
const accountService = require("../services/accountService");

// 用户登录
router.post("/login", (req, res) => {
	accountService.login(req, res);
});
// 查看用户是否登录
router.get("/isLogin", (req, res) => {
	accountService.isLogin(req, res);
});
// 用户退出登录
router.get("/logout", (req, res) => {
	accountService.logout(req, res);
});

// 根据商店id获取用户账号 getAccount
router.get("/getAccount", (req, res) => {
	accountService.getAccount(req, res);
});

// 根据商店id获取用户账号 modifyAccount
router.post("/modifyAccount", (req, res) => {
	accountService.modifyAccount(req, res);
});

module.exports = router;
