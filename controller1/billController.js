const express = require("express");
const router = express.Router();
const billService = require("../services/billService");

// 获取全部提现金额 getBillMoneyReady
router.get("/getBillMoneyReady", (req, res) => {
	billService.getBillMoneyReady(req, res);
});

// 获取商店已经提现的金额
router.get("/getBillMoneyReadyByShopid", (req, res) => {
	billService.getBillMoneyReadyByShopid(req, res);
});

// 提交提现 addBill
router.post("/addBill", (req, res) => {
	billService.addBill(req, res);
});

// 获取商店的提现记录 getAllByShopid
router.get("/getAllByShopid", (req, res) => {
	billService.getAllByShopid(req, res);
});

// 修改数据状态 modifyBillById
router.post("/modifyBillById", (req, res) => {
	billService.modifyBillById(req, res);
});

// 获取所有提现记录 getAllBill
router.get("/getAllBill", (req, res) => {
	billService.getAllBill(req, res);
});

module.exports = router;
