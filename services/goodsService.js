const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const goods = require("../models/goods");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const GoodsModel = goods(sequelize);
const AppConfig = require("../config/AppConfig");
const fs = require("fs"); // 引入fs模块
let preUrl = AppConfig.goodsPreUrl;
let goodsImgFilePath = AppConfig.goodsImgFilePath;
const shop = require("../models/shop");
let filePath = AppConfig.goodsImgFilePath;
// const gm = require("gm");
const ShopModel = shop(sequelize);
const ImageDeal = require("../util/ImagesDeal");
GoodsModel.belongsTo(ShopModel, { foreignKey: "shopid", targetKey: "id", as: "shopDetail",});

module.exports = {
	// 获取同一家商店的所有食物
	getByShopId: async (req, res) => {
		let id = req.query.id;
		let options = {
			where: {
				shopid: id
			},
			order: [
				// will return `name`  DESC 降序  ASC 升序
				["sort", "DESC"],
			]
		};
		let name = req.query.name;
		name ? options.where.name = {
			[Op.like]: "%" + name + "%"
		} : null;
		try {
			let goods = await GoodsModel.findAll(options);
			let result = [];
			goods.map(item => {
				result.push(item.dataValues);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取商店食品的简介
	getDescGoodsByShopId: async (req, res) => {
		let shopid = req.query.shopid;
		try {
			let goods = await GoodsModel.findAll({
				where: {
					shopid: shopid
				},
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["sort", "DESC"],
				]
			});
			let result = [];
			goods.map(item => {
				result.push({
					id: item.id,
					name: item.name
				});
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 更改商品的今日推荐
	updateToday: async (req, res) => {
		let params = req.query;
		try {
			await GoodsModel.update({today: params.type}, {
				where: {
					id: params.id
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 上传商品描述图片
	uploadDescImg: async (req, res, filename) => {
		try {
			let UrlPath = preUrl + filename;
			let newFile = `${filePath}/${filename}`;
			ImageDeal.dealImages(newFile);
			res.send(resultMessage.success(UrlPath));
		} catch (error) {
			fs.exists(`${filePath}/${filename}`, () => {
				fs.unlinkSync(`${filePath}/${filename}`);
			});
			return res.send(resultMessage.errorMsg("上传文件图片错误!"));
		}
	},

	// 新增商品
	add: async (req, res, filename) => {
		try {
			let body = req.body;
			let params = {
				name: body.name,
				title: body.title,
				desc: body.desc,
				price: body.price,
				package_cost: body.package_cost,
				today: body.today,
				sort: body.sort,
				shopid: body.shopid,
				sales: body.sales,
				position: body.position,
				specification: body.specification
			};
			// 检测是否有同名商品
			let likeGoods = await GoodsModel.findOne({
				where: {
					shopid: body.shopid,
					name: body.name
				}
			});
			if(likeGoods) {
				return res.send(resultMessage.errorMsg("商品名称重复！"));
			}
			filename ? params.url = preUrl + filename : null;
			await GoodsModel.create(params);
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

	// 修改商品
	update: async (req, res, filename) => {
		try {
			let body = req.body;
			let params = {
				name: body.name,
				title: body.title,
				desc: body.desc,
				price: body.price,
				package_cost: body.package_cost,
				today: body.today,
				sort: body.sort,
				shopid: body.shopid,
				sales: body.sales,
				specification: body.specification
			};
			// type == 1 不修改图片 2 修改图片
			body.type == 2 ? params.url = preUrl + filename : null;
			await GoodsModel.update(params, {
				where: {
					id: req.body.id
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

	// 删除商品
	delete: async (req, res) => {
		try {
			let id = req.body.id;
			let goods = await GoodsModel.findOne({
				where: {
					id: id
				}
			});
			let url = goods.url, descList = JSON.parse(goods.desc);
			let filename = url.split(preUrl)[1];
			let filePath = goodsImgFilePath + "/" + filename;
			if(fs.existsSync(goodsImgFilePath + "/" + filename)) fs.unlinkSync(filePath);
			descList.map(item => {
				let filename = item.split(preUrl)[1];
				let filePath = goodsImgFilePath + "/" + filename;
				if(fs.existsSync(goodsImgFilePath + "/" + filename)) fs.unlinkSync(filePath);
			});
			await GoodsModel.destroy({
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

	// 获取所有今日推荐商品
	getAllToday: async (req, res) => {
		try {
			let goods = await GoodsModel.findAll({
				where: {
					today: 1
				},
				include: [{
					model: ShopModel,
					as: "shopDetail",
				}],
				order: [
					["sort", "DESC"],
				]
			});
			let result = [];
			goods.map(item => {
				let obj = item.dataValues;
				if(item.shopDetail && item.shopDetail.campus == req.query.position) {
					result.push({
						id: obj.id,
						name: obj.name,
						shopid: obj.shopid,
						url: obj.url,
						shopName: obj.shopDetail.name
					});
				}

			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据id获取商品详情
	getById: async (req, res) => {
		let id = req.query.id;
		try {
			let goods = await GoodsModel.findOne({
				where: {
					id: id
				}
			});
			res.send(resultMessage.success(goods));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 商品上下架 updateShow
	updateShow: async (req, res) => {
		let params = req.body;
		try {
			await GoodsModel.update({show: params.show}, {
				where: {
					id: params.id
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 商品是否售罄  updateLeave
	updateLeave: async (req, res) => {
		let params = req.body;
		try {
			await GoodsModel.update({leave: params.leave}, {
				where: {
					id: params.id
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取所有商品，可通过商品名称搜索
	getAllGoodsByName: async (req, res) => {
		let name = req.query.name;
		let params = {
			order: [
				// will return `name`  DESC 降序  ASC 升序
				["sort", "DESC"],
			],
			include: [{
				model: ShopModel,
				as: "shopDetail",
			}],
		};
		name ? params.where = {
			name: {
				[Op.like]: "%" + name + "%"
			}
		} : null;
		try {
			let goods = await GoodsModel.findAll(params);
			let result = [];
			goods.map(item => {
				if(item.shopDetail && item.shopDetail.campus == req.query.position) {
					result.push({
						id: item.id,
						name: item.name,
						shopName: item.shopDetail.name,
						title: item.title,
						url: item.url,
						desc: item.desc,
						sales: item.sales,
						price: item.price,
						shopid: item.shopid,
						specification: item.specification,
						package_cost: item.package_cost,
						today: item.today,
						sort: item.sort,
						leave: item.leave,
						show: item.show
					});
				}
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
