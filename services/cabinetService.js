const fs = require('fs');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const cabinet = require('../models/cabinet');
const CabinetModel = cabinet(sequelize);
const shop = require('../models/shop');
const ShopModel = shop(sequelize);
// ShopModel.belongsTo(CabinetModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });
CabinetModel.belongsTo(ShopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });
const AppConfig = require('../config/AppConfig');
const preUrl = AppConfig.cabinetPresUrl;
const ImageDeal = require('../util/ImagesDeal');
const filePath = AppConfig.cabinetImgFilePath;
const responseUtil = require('../util/responseUtil');

module.exports = {
	// 根据商店ip获取快递柜
	getByShopId: async (req, res) => {
		try {
			let { shopid } = req.query;
			let where = {};
			shopid && shopid != -1 ? (where.shopid = shopid) : null;
			let swiper = await CabinetModel.findAll({
				where: where,
				include: [
					{
						model: ShopModel,
						as: 'shopDetail',
					},
				],
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(swiper, ['id', 'shopid', 'boxid', 'name', 'address', 'url', 'sort', 'create_time']);
			result.forEach((item, index) => {
				item.shopName = swiper[index]['shopDetail']['name'] || '';
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取所有快递柜为下拉框
	getAllForSelect: async (req, res) => {
		try {
			let cabinets = await CabinetModel.findAll({
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(cabinets, ['id', 'name']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 增加快递柜
	add: async (req, res, filename) => {
		try {
			let body = req.body;
			let params = {
				shopid: body.shopid,
				name: body.name,
				sort: body.sort,
				boxid: body.boxid,
				address: body.address,
				create_time: body.create_time,
			};
			filename ? (params.url = preUrl + filename) : null;
			await CabinetModel.create(params);
			res.send(resultMessage.success('success'));
			ImageDeal.dealImages(`${filePath}/${filename}`);
		} catch (error) {
			fs.exists(`${filePath}/${filename}`, () => {
				fs.unlinkSync(`${filePath}/${filename}`);
			});
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除快递柜
	delete: async (req, res) => {
		try {
			await CabinetModel.destroy({
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

	// 更新柜子
	update: async (req, res, filename) => {
		try {
			let { id, sort, name, address, boxid, nopicture } = req.body;
			let params = { sort, name, address, boxid };
			if (!nopicture) {
				filename ? (params.url = preUrl + filename) : null;
			}
			await CabinetModel.update(params, {
				where: {
					id: id,
				},
			});
			res.send(resultMessage.success('success'));
			ImageDeal.dealImages(`${filePath}/${filename}`);
		} catch (error) {
			fs.exists(`${filePath}/${filename}`, () => {
				fs.unlinkSync(`${filePath}/${filename}`);
			});
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
