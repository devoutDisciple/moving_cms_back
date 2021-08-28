const moment = require('moment');
const sequelize = require('../dataSource/MysqlPoolClass');
const resultMessage = require('../util/resultMessage');
const AppConfig = require('../config/AppConfig');
const advertising = require('../models/advertising');

const advertisingModel = advertising(sequelize);
const filePath = AppConfig.adverImgFilePath;
const ImageDeal = require('../util/ImagesDeal');

module.exports = {
	// 获取列表
	getList: async (req, res) => {
		try {
			const { shopid } = req.query;
			const condition = {
				where: { is_delete: 1 },
				order: [
					['sort', 'DESC'],
					['create_time', 'DESC'],
				],
			};
			if (shopid && String(shopid) !== '-1') {
				condition.where.shopid = shopid;
			}
			const advers = await advertisingModel.findAll(condition);
			res.send(resultMessage.success(advers));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 添加商家广告图
	addAdver: async (req, res, filename) => {
		try {
			const { shopid, sort } = req.body;
			res.send(resultMessage.success('success'));
			await advertisingModel.create({
				url: filename,
				shopid,
				sort,
				create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			});
			ImageDeal.dealImages(`${filePath}/${filename}`);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除
	deleteAdver: async (req, res) => {
		try {
			const { id } = req.body;
			await advertisingModel.update({ is_delete: 2 }, { where: { id } });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
