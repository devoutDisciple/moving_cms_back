const Sequelize = require('sequelize');
const request = require('request');
const fs = require('fs');
const resultMessage = require('../util/resultMessage');
const responseUtil = require('../util/responseUtil');
const AppConfig = require('../util/AppConfig');

const Op = Sequelize.Op;
const sequelize = require('../dataSource/MysqlPoolClass');
const shop = require('../models/shop');

const ShopModel = shop(sequelize);
const account = require('../models/account');

const AccountModel = account(sequelize);
const appConfig = require('../config/AppConfig');

module.exports = {
	// 获取所有店铺信息
	getAll: async (req, res) => {
		try {
			const name = req.query.name;
			const where = {
				is_delete: { [Op.not]: ['2'] },
			};
			if (name && String(name) !== '-1') where.name = { [Op.like]: `%${name}%` };
			const shops = await ShopModel.findAll({
				where,
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsAll(shops, ['id', 'name', 'manager', 'phone', 'address', 'sort', 'desc']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取店铺信息
	getShopDetailById: async (req, res) => {
		try {
			const shopid = req.query.shopid;
			const shopDetail = await ShopModel.findOne({
				where: {
					id: shopid,
				},
				order: [['sort', 'DESC']],
			});
			const result = responseUtil.renderFieldsObj(shopDetail, ['id', 'name', 'manager', 'phone', 'address', 'longitude', 'latitude', 'sort', 'desc']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},

	// 更改店铺位置信息
	updateShopSite: async (req, res) => {
		try {
			const { shopid, longitude, latitude, address } = req.body;
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
			const body = req.body;
			const { username, password, phone, manager } = body;
			const accountDetail = await AccountModel.findOne({
				where: {
					username,
				},
			});
			if (accountDetail) return res.send(resultMessage.errorMsg('已有该用户'));
			// 检测同区域是否有相同的店铺名称
			const likeShop = await ShopModel.findOne({
				where: {
					name: body.name,
				},
			});
			if (likeShop) {
				return res.send(resultMessage.errorMsg('店铺名称不能重复'));
			}
			const shopDetail = await ShopModel.create(body);
			await AccountModel.create({ username, password, shopid: shopDetail.id, role: 2, phone, name: manager });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取店铺的账号密码
	getAccountByShopId: async (req, res) => {
		try {
			const shopid = req.query.shopid;
			const accountDetail = await AccountModel.findOne({
				where: {
					shopid,
				},
			});
			const result = responseUtil.renderFieldsObj(accountDetail, ['id', 'username', 'password']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除店铺
	deleteShop: async (req, res) => {
		try {
			const id = req.body.shopid;
			await AccountModel.destroy({
				where: { shopid: id },
			});
			await ShopModel.destroy({
				where: { id },
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
			const id = req.body.id;
			const shopDetail = await ShopModel.findOne({
				where: {
					id,
				},
			});
			if (!shopDetail.sn || !shopDetail.key) {
				return res.send(resultMessage.success('请录入打印机'));
			}
			await ShopModel.update(
				{
					auto_print: req.body.auto_print,
				},
				{
					where: {
						id,
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
			const body = req.body;
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
			const id = req.body.id;
			const status = req.body.status;
			await ShopModel.update(
				{ status },
				{
					where: { id },
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
			const shopid = req.query.id;
			const timestamp = new Date().getTime();
			const name = `${shopid}-${timestamp}`;
			// 获取token
			request.get(
				`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppConfig.appid}&secret=${AppConfig.AppSecret}`,
				(error, response, body) => {
					body = JSON.parse(body);
					const access_token = body.access_token;
					const params = `/pages/shop/shop?id=${shopid}`;
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
						() => {
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
