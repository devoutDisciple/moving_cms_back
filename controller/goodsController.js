const express = require("express");
const router = express.Router();
const goodsService = require("../services/goodsService");
const multer  = require("multer");
const ObjectUtil = require("../util/ObjectUtil");
let AppConfig = require("../config/AppConfig");
let filePath = AppConfig.goodsImgFilePath;

let filename = "";
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.jpg
		filename = ObjectUtil.getName() + "-" + Date.now() + ".jpg";
		cb(null, filename);
	}
});
let upload = multer({ dest: filePath, storage: storage });

// 上传描述图片
router.post("/uploadDescImg", upload.single("file"), (req, res) => {
	goodsService.uploadDescImg(req, res, filename);
});

// 根据商店id获取商品
router.get("/getByShopId", (req, res) => {
	goodsService.getByShopId(req, res);
});

// 根据商店id获取食品简介  getDescGoodsByShopId
router.get("/getDescGoodsByShopId", (req, res) => {
	goodsService.getDescGoodsByShopId(req, res);
});

// 更改今日推荐
router.get("/updateToday", (req, res) => {
	goodsService.updateToday(req, res);
});

// 新增商品
router.post("/add", upload.single("file"), (req, res) => {
	goodsService.add(req, res, filename);
});

// 修改商品
router.post("/update", upload.single("file"), (req, res) => {
	goodsService.update(req, res, filename);
});

// 删除商品
router.post("/delete", (req, res) => {
	goodsService.delete(req, res);
});

// 获取所有今日推荐商品
router.get("/getAllToday", (req, res) => {
	goodsService.getAllToday(req, res);
});

// 商品上下架 updateShow
router.post("/updateShow", (req, res) => {
	goodsService.updateShow(req, res);
});

// 商品是否有余货 updateLeave
router.post("/updateLeave", (req, res) => {
	goodsService.updateLeave(req, res);
});

// 通过名称搜索商品 getAllGoodsByName
router.get("/getAllGoodsByName", (req, res) => {
	goodsService.getAllGoodsByName(req, res);
});

module.exports = router;
