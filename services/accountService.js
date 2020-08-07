const resultMessage = require('../util/resultMessage');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../dataSource/MysqlPoolClass');
const account = require('../models/account');
const accountModel = account(sequelize);
const shop = require('../models/shop');
const responseUtil = require('../util/responseUtil');
const shopModel = shop(sequelize);
accountModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

module.exports = {
	// 查看用户是否登录
	isLogin: async (req, res) => {
		try {
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 用户登录
	login: async (req, res) => {
		try {
			let { username, password } = req.body;
			let user = await accountModel.findOne({
				where: {
					username: username,
				},
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
				],
			});
			if (!user || password != user.password) return res.send(resultMessage.specilError(400, '用户名或密码错误!'));
			let value = `${username}_#$%^%$#_${password}`;
			res.cookie('userinfo', value, {
				expires: new Date(Date.now() + 10000 * 60 * 60 * 2),
				signed: true,
				httpOnly: true,
			}); //signed 表示对cookie加密
			res.send(
				resultMessage.success({
					username: user.username,
					shopid: user.shopid,
					role: user.role,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 用户退出登录
	logout: async (req, res) => {
		try {
			res.clearCookie('userinfo');
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 查看商店的用户名称和密码
	getAllAccount: async (req, res) => {
		try {
			let where = {
				role: {
					[Op.not]: [1],
				},
			};
			let { shopid } = req.query;
			if (shopid !== '-1') where = { shopid: shopid };
			let data = await accountModel.findAll({
				where: where,
				include: [
					{
						model: shopModel,
						as: 'shopDetail',
					},
				],
				order: [['id', 'ASC']],
			});
			let result = responseUtil.renderFieldsAll(data, ['id', 'name', 'phone', 'username', 'shopid', 'role', 'password']);
			if (Array.isArray(data)) {
				data.map((item, index) => {
					if (item.shopDetail) {
						result[index].shopName = item.shopDetail.name;
					}
					if (item.shopid == '-1') {
						result[index].shopName = '总管理员账户';
					}
				});
			}
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 增加账户
	addAccount: async (req, res) => {
		try {
			await accountModel.create(req.body);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除账户
	deleteById: async (req, res) => {
		try {
			let { id } = req.body;
			await accountModel.destroy({
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

	// 修改商店的用户名称和密码
	modifyAccount: async (req, res) => {
		try {
			let body = req.body;
			let { id } = body;
			await accountModel.update(
				{
					name: body.name,
					phone: body.phone,
					username: body.username,
					password: body.password,
					role: body.role,
				},
				{
					where: {
						id: id,
					},
				},
			);
			body.role == 1 ? res.clearCookie('userinfo') : null;
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
