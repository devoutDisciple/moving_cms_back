const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');
const Sequelize = require('sequelize');
const request = require('request');
const AppConfig = require('../util/AppConfig');
const Op = Sequelize.Op;
const sequelize = require('../dataSource/MysqlPoolClass');
const shop = require('../models/shop');
const ShopModel = shop(sequelize);
const account = require('../models/account');
const AccountModel = account(sequelize);
const fs = require('fs');
const appConfig = require('../config/AppConfig');

module.exports = {
	// 获取所有店铺信息
	getAll: async (req, res) => {
		try {
			let name = req.query.name;
			let where = {
				is_delete: { [Op.not]: ['2'] },
			};
			name
				? (where.name = {
						[Op.like]: '%' + name + '%',
				  })
				: null;
			let shops = await ShopModel.findAll({
				where: where,
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(shops, ['id', 'name', 'manager', 'phone', 'address', 'sort', 'desc']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取店铺信息
	getShopDetailById: async (req, res) => {
		try {
			let shopid = req.query.shopid;
			let shop = await ShopModel.findOne({
				where: {
					id: shopid,
				},
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsObj(shop, ['id', 'name', 'manager', 'phone', 'address', 'longitude', 'latitude', 'sort', 'desc']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},

	// 更改店铺位置信息
	updateShopSite: async (req, res) => {
		try {
			let { shopid, longitude, latitude, address } = req.body;
			console.log(shopid, longitude, latitude, address);
			await ShopModel.update(
				{ longitude, latitude, address },
				{
					where: { id: shopid },
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},

	// 增加店铺
	addShop: async (req, res) => {
		try {
			let body = req.body;
			let { username, password } = body;
			let account = await AccountModel.findOne({
				where: {
					username: username,
				},
			});
			if (account) return res.send(resultMessage.errorMsg('已有该用户'));
			// 检测同区域是否有相同的店铺名称
			let likeShop = await ShopModel.findOne({
				where: {
					name: body.name,
				},
			});
			if (likeShop) {
				return res.send(resultMessage.errorMsg('店铺名称不能重复'));
			}
			let shop = await ShopModel.create(body);
			await AccountModel.create({ username, password, shopid: shop.id, role: 2 });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取店铺的账号密码
	getAccountByShopId: async (req, res) => {
		try {
			let shopid = req.query.shopid;
			let account = await AccountModel.findOne({
				where: {
					shopid: shopid,
				},
			});
			let result = responseUtil.renderFieldsObj(account, ['id', 'username', 'password']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除店铺
	deleteShop: async (req, res) => {
		try {
			let id = req.body.shopid;
			await AccountModel.destroy({
				where: {
					shopid: id,
				},
			});
			await ShopModel.destroy({
				where: {
					id: id,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 开启或者关闭自动打印
	startAutoPrint: async (req, res) => {
		try {
			let id = req.body.id;
			let shop = await ShopModel.findOne({
				where: {
					id: id,
				},
			});
			if (!shop.sn || !shop.key) {
				return res.send(resultMessage.success('请录入打印机'));
			}
			await ShopModel.update(
				{
					auto_print: req.body.auto_print,
				},
				{
					where: {
						id: id,
					},
				},
			);
			res.send(resultMessage.success('操作成功'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 修改店铺
	updateShop: async (req, res) => {
		try {
			let body = req.body;
			await ShopModel.update(body, {
				where: {
					id: body.shopid,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 开店或者关店
	closeOrOpen: async (req, res) => {
		try {
			let id = req.body.id,
				status = req.body.status;
			await ShopModel.update(
				{ status: status },
				{
					where: { id: id },
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取小程序二维码
	getAccessCode: async (req, res) => {
		try {
			let shopid = req.query.id;
			let timestamp = new Date().getTime();
			let name = shopid + '-' + timestamp;
			// 获取token
			request.get(
				`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppConfig.appid}&secret=${AppConfig.AppSecret}`,
				function (error, response, body) {
					console.log(body, 111);
					body = JSON.parse(body);
					let access_token = body.access_token;
					console.log(access_token);
					let params = `/pages/shop/shop?id=${shopid}`;
					// 获取二维码
					request(
						{
							url: `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`,
							method: 'POST',
							json: true,
							headers: {
								'content-type': 'application/json',
							},
							body: {
								path: params,
							},
						},
						function () {
							console.log(name, 22);
							return res.send(resultMessage.success(`http://www.bws666.com/${name}.png`));
						},
					).pipe(fs.createWriteStream(`${appConfig.swiperImgFilePath}/${name}.png`));
				},
			);
			// res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
