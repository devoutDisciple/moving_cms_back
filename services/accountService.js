const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const account = require("../models/account");
const accountModel = account(sequelize);
const shop = require("../models/shop");
const shopModel = shop(sequelize);
accountModel.belongsTo(shopModel, { foreignKey: "shopid", targetKey: "id", as: "shopDetail",});

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
			let {username, password} = req.body;
			let user = await accountModel.findOne({
				where: {
					username: username
				},
				include: [{
					model: shopModel,
					as: "shopDetail",
				}],
			});
			if(!user || password != user.password) return res.send(resultMessage.specilError(400, "用户名或密码错误!"));
			let value = `${username}_#$%^%$#_${password}`;
			res.cookie(
				"userinfo", value, {
					expires: new Date(Date.now() + 10000 * 60 * 60 * 2),
					signed: true,
					httpOnly: true
				}
			);  //signed 表示对cookie加密
			let campus = user.shopDetail ? user.shopDetail.campus : "";
			res.send(resultMessage.success({
				username: user.username,
				shopid: user.shopid,
				role: user.role,
				campus: campus
			}));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 用户退出登录
	logout: async (req, res) => {
		try {
			res.clearCookie("userinfo");
			res.send(resultMessage.success([]));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 查看商店的用户名称和密码
	getAccount: async (req, res) => {
		try {
			let data = await accountModel.findOne({
				where: {
					shopid: req.query.id
				}
			});
			res.send(resultMessage.success(data));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 修改商店的用户名称和密码
	modifyAccount: async (req, res) => {
		try {
			await accountModel.update({
				password: req.body.password
			}, {
				where: {
					shopid: req.body.id
				}
			});
			let type = req.body.type;
			type != 1 ? res.clearCookie("userinfo") : null;
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

};
