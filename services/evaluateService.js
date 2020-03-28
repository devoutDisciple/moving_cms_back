const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const evaluate = require("../models/evaluate");
const evaluateModel = evaluate(sequelize);
const goods = require("../models/goods");
const GoodsModel = goods(sequelize);
evaluateModel.belongsTo(GoodsModel, { foreignKey: "goods_id", targetKey: "id", as: "goodsDetail",});
const shop = require("../models/shop");
const shopModel = shop(sequelize);
evaluateModel.belongsTo(shopModel, { foreignKey: "shopid", targetKey: "id", as: "shopDetail",});

module.exports = {
	// 获取所有用户评价
	getAll: async (req, res) => {
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}],
				order: [
					["create_time", "DESC"],
				],
			});
			let result = [];
			evaluates.map(item => {
				result.push({
					id: item.id,
					goods_id: item.goods_id,
					goodsName: item.goodsDetail.name,
					orderid: item.orderid,
					username: item.username,
					desc: item.desc,
					shop_grade: item.shop_grade,
					sender_grade: item.sender_grade,
					create_time: item.create_time
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 通过用户openid查看该用户评价列表
	getEvaluateByOpenid: async (req, res) => {
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				where: {
					openid: req.query.openid
				},
				order: [
					["create_time", "DESC"],
				],
			});
			let result = [];
			evaluates.map(item => {
				result.push({
					goods_id: item.goods_id,
					desc: item.desc,
					goods_grade: item.goods_grade,
					create_time: item.create_time
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据商品id获取评价
	getEvaluateByGoodsId: async (req, res) => {
		let goods_id = req.query.goods_id;
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				where: {
					goods_id: goods_id
				},
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				],
			});
			// 获取评价平均值
			let sumEvaluate = await evaluateModel.sum("shop_grade", {
				where: {
					goods_id: goods_id
				}
			});
			let result = [];
			evaluates.map(item => {
				result.push(item.dataValues);
			});
			res.send(resultMessage.success({
				sumEvaluate,
				result
			}));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据商店id 获取所有评价
	getEvaluateByShopId: async (req, res) => {
		let shopid = req.query.shopid;
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				where: {
					shopid: shopid
				},
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}],
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				],
			});
			let result = [];
			evaluates.map(item => {
				result.push({
					id: item.id,
					goods_id: item.goods_id,
					shopid: item.shopid,
					goodsName: item.goodsDetail.name,
					orderid: item.orderid,
					username: item.username,
					avatarUrl: item.avatarUrl,
					desc: item.desc,
					shop_grade: item.shop_grade,
					sender_grade: item.sender_grade,
					create_time: item.create_time,
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取全部评价
	getEvaluate: async (req, res) => {
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}, {
					model: shopModel,
					as: "shopDetail",
				}],
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				],
			});
			let result = [];
			evaluates.map(item => {
				if(item.shopDetail && item.shopDetail.campus == req.query.position) {
					result.push({
						id: item.id,
						goods_id: item.goods_id,
						shopName: item.shopDetail ? item.shopDetail.name : null,
						shopid: item.shopid,
						goods_grade: item.goods_grade,
						goodsName: item.goodsDetail ? item.goodsDetail.name : "",
						orderid: item.orderid,
						username: item.username,
						avatarUrl: item.avatarUrl,
						desc: item.desc,
						create_time: item.create_time,
					});
				}
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据订单id获取评价
	getEvaluateByOrderId: async (req, res) => {
		try {
			// 获取评价
			let evaluates = await evaluateModel.findAll({
				where: {
					orderid: req.query.id
				},
				include: [{
					model: GoodsModel,
					as: "goodsDetail",
				}, {
					model: shopModel,
					as: "shopDetail",
				}],
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				],
			});
			let result = [];
			evaluates.map(item => {
				result.push({
					id: item.id,
					goods_id: item.goods_id,
					d: item.goods_grade,
					goodsName: item.goodsDetail ? item.goodsDetail.name : "",
					goodsUrl: item.goodsDetail ? item.goodsDetail.url : "",
					desc: item.desc,
					create_time: item.create_time,
					show: item.show
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

};
