const express = require('express');

const router = express.Router();
const multer = require('multer');
const intergralService = require('../services/intergralService');
const ObjectUtil = require('../util/ObjectUtil');
const AppConfig = require('../config/AppConfig');

const filePath = AppConfig.intergralImgFilePath;

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, filePath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.jpg
		filename = `intergral_${ObjectUtil.getName()}_${Date.now()}.jpg`;
		cb(null, filename);
	},
});
const upload = multer({ dest: filePath, storage });

// 根据商店id获取积分数据 getByShopId
router.get('/getByShopId', (req, res) => {
	intergralService.getByShopId(req, res);
});

// 新增积分图
router.post('/add', upload.single('file'), (req, res) => {
	intergralService.add(req, res, filename);
});

// 删除
router.post('/delete', (req, res) => {
	intergralService.delete(req, res);
});

// 编辑轮积分
router.post('/update', upload.single('file'), (req, res) => {
	intergralService.update(req, res, filename);
});

module.exports = router;
