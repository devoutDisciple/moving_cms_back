const express = require('express');
const router = express.Router();
const areaService = require('../services/AreaService');

// 获取所有区域
router.get('/getAllByLevel', (req, res) => {
	areaService.getAllByLevel(req, res);
});

// 新增区域
router.post('/add', (req, res) => {
	areaService.add(req, res);
});

// 更新区域
router.post('/update', (req, res) => {
	areaService.update(req, res);
});

// 删除区域
router.post('/delete', (req, res) => {
	areaService.delete(req, res);
});

// 根据parentid获取区域
router.get('/getAllByParentid', (req, res) => {
	areaService.getAllByParentid(req, res);
});

module.exports = router;
