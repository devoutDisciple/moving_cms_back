const resultMessage = require("../util/resultMessage");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = require("../dataSource/MysqlPoolClass");
const swiper = require("../models/swiper");
const SwiperModel = swiper(sequelize);
const shop = require("../models/shop");
const shopModel = shop(sequelize);
const AppConfig = require("../config/AppConfig");
let preUrl = AppConfig.swiperPreUrl;
const fs = require("fs");
let filePath = AppConfig.swiperImgFilePath;
const ImageDeal = require("../util/ImagesDeal");
SwiperModel.belongsTo(shopModel, { foreignKey: "shopid", targetKey: "id", as: "shopDetail",});
const goods = require("../models/goods");
const goodsModel = goods(sequelize);
SwiperModel.belongsTo(goodsModel, { foreignKey: "goodsid", targetKey: "id", as: "goodsDetail",});

module.exports = {
	getAll: async (req, res) => {
		try {
			let swiper = await SwiperModel.findAll({
				where: {
					is_delete: {
						[Op.not]: ["2"]
					},
					campus: req.query.position || ""
				},
				include: [{
					model: shopModel,
					as: "shopDetail",
				}, {
					model: goodsModel,
					as: "goodsDetail",
				}],
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["sort", "DESC"],
				]
			});
			let result = [];
			swiper.map(item => {
				let shopName = item.shopDetail ? item.shopDetail.name : null;
				let goodsName = item.goodsDetail ? item.goodsDetail.name : null;
				let obj = {
					id: item.id,
					campus: item.campus,
					shopid: item.shopid,
					type: item.type,
					goodsid: item.goodsid,
					url: item.url,
					sort: item.sort,
					shopName: shopName,
					goodsName: goodsName,
				};
				result.push(obj);
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
				type: body.type,
				campus: body.campus,
				sort: body.sort,
			};
			body.goodsid ? params.goodsid = body.goodsid : null;
			body.shopid ? params.shopid = body.shopid : null;
			filename ? params.url = preUrl + filename : null;
			await SwiperModel.create(params);
			res.send(resultMessage.success("success"));
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
			let params = {
				type: body.type,
				sort: body.sort,
			};
			body.goodsid ? params.goodsid = body.goodsid : null;
			body.shopid ? params.shopid = body.shopid : null;
			filename ? params.url = preUrl + filename : null;
			await SwiperModel.update(params, {
				where: {
					id: body.id
				}
			});
			res.send(resultMessage.success("success"));
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
					id: req.body.id
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
