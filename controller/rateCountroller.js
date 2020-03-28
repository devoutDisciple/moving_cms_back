const express = require("express");
const router = express.Router();
const rateService = require("../services/rateService");

// 获取所有
router.get("/getAll", (req, res) => {
	rateService.getAll(req, res);
});

// 修改
router.post("/modify", (req, res) => {
	rateService.modify(req, res);
});

module.exports = router;
