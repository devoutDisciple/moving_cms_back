const express = require('express');

const router = express.Router();
const multer = require('multer');
const cabinetService = require('../services/cabinetService');
const ObjectUtil = require('../util/ObjectUtil');
const AppConfig = require('../config/AppConfig');

const filePath = AppConfig.cabinetImgFilePath;

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
const storage = multer.diskStorage({
	destination(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, filePath);
	},
	filename(req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.jpg
		filename = `cabinet_${ObjectUtil.getName()}_${Date.now()}.jpg`;
		cb(null, filename);
	},
});
const upload = multer({ dest: filePath, storage });

// 新增快递柜
router.post('/add', upload.single('file'), (req, res) => {
	cabinetService.add(req, res, filename);
});

// 根据商店id获取快递柜 getByShopId
router.get('/getByShopId', (req, res) => {
	cabinetService.getByShopId(req, res);
});

// 删除快递柜子
router.post('/delete', (req, res) => {
	cabinetService.delete(req, res);
});

// 更新快递柜子
router.post('/update', upload.single('file'), (req, res) => {
	cabinetService.update(req, res, filename);
});

// 获取所有快递柜为下拉框
router.get('/getAllForSelect', (req, res) => {
	cabinetService.getAllForSelect(req, res);
});

module.exports = router;
