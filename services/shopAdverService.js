const fs = require('fs');
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
			const advers = await advertisingModel.findAll({
				where: { is_delete: 1 },
				order: [
					['sort', 'DESC'],
					['create_time', 'DESC'],
				],
			});
			res.send(resultMessage.success(advers));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 更新轮播图
	update: async (req, res, filename) => {
		try {
			res.send(resultMessage.success('success'));
			ImageDeal.dealImages(`${filePath}/${filename}`);
			fs.exists(`${filePath}/${filename}`, () => {
				fs.copyFileSync(`${filePath}/${filename}`, `${filePath}/advertisement.png`);
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
