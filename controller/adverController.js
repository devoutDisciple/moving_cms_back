const express = require('express');

const router = express.Router();
const multer = require('multer');
const adverService = require('../services/adverService');
const AppConfig = require('../config/AppConfig');

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
        filename = 'advertisement.jpg';
        cb(null, filename);
    },
});
const upload = multer({ dest: filePath, storage });

// 编辑广告图
router.post('/modify', upload.single('file'), (req, res) => {
    adverService.update(req, res, filename);
});

module.exports = router;
