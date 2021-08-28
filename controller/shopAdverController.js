const express = require('express');

const router = express.Router();
const multer = require('multer');
const adverService = require('../services/shopAdverService');
const AppConfig = require('../config/AppConfig');
const ObjectUtil = require('../util/ObjectUtil');

const filePath = AppConfig.adverImgFilePath;

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, filePath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.jpg
		filename = `adver_${ObjectUtil.getName()}_${Date.now()}.jpg`;
		cb(null, filename);
	},
});
const upload = multer({ dest: filePath, storage });

// 查询广告图列表
router.get('/list', (req, res) => {
	adverService.getList(req, res);
});

// 添加商家广告图
router.post('/add', upload.single('file'), (req, res) => {
	adverService.addAdver(req, res, filename);
});

// 删除
router.post('/delete', (req, res) => {
	adverService.deleteAdver(req, res);
});

module.exports = router;
