const fs = require('fs');
const Sequelize = require('sequelize');
const resultMessage = require('../util/resultMessage');

const Op = Sequelize.Op;
const sequelize = require('../dataSource/MysqlPoolClass');
const swiper = require('../models/swiper');

const SwiperModel = swiper(sequelize);
const responseUtil = require('../util/responseUtil');
const shop = require('../models/shop');

const shopModel = shop(sequelize);
const AppConfig = require('../config/AppConfig');

const preUrl = AppConfig.swiperPreUrl;

const filePath = AppConfig.swiperImgFilePath;
const ImageDeal = require('../util/ImagesDeal');

SwiperModel.belongsTo(shopModel, { foreignKey: 'shop_id', targetKey: 'id', as: 'shopDetail' });

module.exports = {
	getByShopId: async (req, res) => {
		try {
			const shopid = req.query.shopid;
			const where = {
				is_delete: {
					[Op.not]: ['2'],
				},
			};
			if (shopid && Number(shopid) !== -1) where.shop_id = shopid;
			const swiperDetail = await SwiperModel.findAll({
				where,
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
				],
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(swiperDetail, ['id', 'shop_id', 'url', 'sort', 'create_time']);
			result.forEach((item, index) => {
				item.shopName = swiperDetail[index].shopDetail ? swiperDetail[index].shopDetail.name || '' : '';
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
			const body = req.body;
			const params = {
				shop_id: body.shopid,
				sort: body.sort,
				create_time: body.create_time,
			};
			if (filename) params.url = preUrl + filename;
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
			const body = req.body;
			const params = { sort: body.sort };
			if (!body.nopicture && filename) params.url = preUrl + filename;
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
