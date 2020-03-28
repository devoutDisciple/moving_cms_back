const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const adver = require("../models/adver");
const adverModel = adver(sequelize);
const goods = require("../models/goods");
const GoodsModel = goods(sequelize);
adverModel.belongsTo(GoodsModel, { foreignKey: "goods_id", targetKey: "id", as: "goodsDetail",});
const shop = require("../models/shop");
const ShopModel = shop(sequelize);
adverModel.belongsTo(ShopModel, { foreignKey: "shop_id", targetKey: "id", as: "shopDetail",});
const fs = require("fs");
const AppConfig = require("../config/AppConfig");
let preUrl = AppConfig.swiperPreUrl;
let filePath = AppConfig.swiperImgFilePath;
const ImageDeal = require("../util/ImagesDeal");

module.exports = {
	// 获取广告数据
	getAll: async (req, res) => {
		try {
			let data = await adverModel.findOne({
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}, {
					model: ShopModel,
					as: "shopDetail",
				}],
			});
			let result = [{
				id: data.id,
				url: data.url,
				shop_id: data.shop_id,
				goods_id: data.goods_id,
				shopName: data.shopDetail ? data.shopDetail.name : "",
				goodsName: data.goodsDetail ? data.goodsDetail.name : null,
				status: data.status,
				show: data.show,
				time: data.time
			}];
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 修改广告数据
	modify: async (req, res, filename) => {
		try {
			let body = req.body;
			let params = {
				show: body.show,
				status: body.status,
			};
			body.time ? params.time = body.time : null;
			body.shop_id ? params.shop_id = body.shop_id : null;
			body.goods_id ? params.goods_id = body.goods_id : null;
			filename ? params.url = preUrl + filename : null;
			await adverModel.update(params, {
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
};
