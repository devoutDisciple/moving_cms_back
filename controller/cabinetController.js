const express = require('express');
const router = express.Router();
const cabinetService = require('../services/cabinetService');
const multer = require('multer');
const ObjectUtil = require('../util/ObjectUtil');
let AppConfig = require('../config/AppConfig');
let filePath = AppConfig.swiperImgFilePath;

let filename = '';
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, filePath);
	},
	filename: function (req, file, cb) {
		// 将保存文件名设置为 随机字符串 + 时间戳名，比如 JFSDJF323423-1342342323.jpg
		filename = 'cabinet_' + ObjectUtil.getName() + '_' + Date.now() + '.jpg';
		cb(null, filename);
	},
});
let upload = multer({ dest: filePath, storage: storage });

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

module.exports = router;
