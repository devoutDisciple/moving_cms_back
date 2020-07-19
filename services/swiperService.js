const resultMessage = require('../util/resultMessage');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../dataSource/MysqlPoolClass');
const swiper = require('../models/swiper');
const SwiperModel = swiper(sequelize);
const responseUtil = require('../util/responseUtil');
const shop = require('../models/shop');
const shopModel = shop(sequelize);
const AppConfig = require('../config/AppConfig');
let preUrl = AppConfig.swiperPreUrl;
const fs = require('fs');
let filePath = AppConfig.swiperImgFilePath;
const ImageDeal = require('../util/ImagesDeal');
SwiperModel.belongsTo(shopModel, { foreignKey: 'shop_id', targetKey: 'id', as: 'shopDetail' });

module.exports = {
	getByShopId: async (req, res) => {
		try {
			let shopid = req.query.shopid;
			let where = {
				is_delete: {
					[Op.not]: ['2'],
				},
			};
			shopid && shopid != -1 ? (where.shop_id = shopid) : null;
			let swiper = await SwiperModel.findAll({
				where: where,
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
				],
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(swiper, ['id', 'shop_id', 'url', 'sort', 'create_time']);
			result.forEach((item, index) => {
				item.shopName = swiper[index]['shopDetail'] ? swiper[index]['shopDetail']['name'] || '' : '';
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 增加轮播图
	add: async (req, res, filename) => {
		try {
			let body = req.body;
			let params = {
				shop_id: body.shopid,
				sort: body.sort,
				create_time: body.create_time,
			};
			filename ? (params.url = preUrl + filename) : null;
			await SwiperModel.create(params);
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

	// 更新轮播图
	update: async (req, res, filename) => {
		try {
			let body = req.body;
			let params = { sort: body.sort };
			if (!body.nopicture) {
				filename ? (params.url = preUrl + filename) : null;
			}
			await SwiperModel.update(params, {
				where: {
					id: body.id,
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

	delete: async (req, res) => {
		try {
			await SwiperModel.destroy({
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
};
