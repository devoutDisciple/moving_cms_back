const express = require("express");
const router = express.Router();
const adverService = require("../services/adverService");
const multer  = require("multer");
const ObjectUtil = require("../util/ObjectUtil");
let AppConfig = require("../config/AppConfig");
let filePath = AppConfig.swiperImgFilePath;

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

// 获取广告图
router.get("/getAll", (req, res) => {
	adverService.getAll(req, res);
});

// 修改信息
router.post("/modify", upload.single("file"), (req, res) => {
	adverService.modify(req, res, filename);
});

module.exports = router;
