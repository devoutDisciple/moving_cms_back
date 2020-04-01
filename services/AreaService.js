const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const area = require('../models/area');
const responseUtil = require('../util/responseUtil');
const areaModel = area(sequelize);

module.exports = {
	// 获取全部区域
	getAllByLevel: async (req, res) => {
		try {
			let areas = await areaModel.findAll({
				order: [
					['level', 'ASC'],
					['sort', 'DESC'],
				],
			});
			let result = responseUtil.renderFieldsAll(areas, ['id', 'name', 'parentid', 'level', 'active', 'create_time', 'sort']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 新增区域
	add: async (req, res) => {
		try {
			let body = req.body;
			let params = {
				parentid: body.parentid,
				level: body.level,
				name: body.name,
				active: body.active || 1,
				sort: body.sort,
				create_time: body.create_time,
			};
			await areaModel.create(params);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 更新区域
	update: async (req, res) => {
		try {
			let body = req.body;
			await areaModel.update(body, {
				where: {
					id: body.id,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除区域
	delete: async (req, res) => {
		try {
			await areaModel.destroy({
				where: {
					id: req.body.id,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据parentid获取区域
	getAllByParentid: async (req, res) => {
		try {
			let ares = await areaModel.findAll({
				where: {
					parentid: req.query.parentid,
				},
			});
			let result = responseUtil.renderFieldsAll(ares, ['id', 'name', 'parentid', 'level', 'active', 'create_time', 'sort']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
