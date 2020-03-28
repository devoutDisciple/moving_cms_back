const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const user = require("../models/user");
const userModel = user(sequelize);
const order = require("../models/order");
const orderModel = order(sequelize);
const shop = require("../models/shop");
const shopModel = shop(sequelize);

module.exports = {
	// 获取会员总量, 销售额，订单，商铺量
	getCount: async (req, res) => {
		try {
			// 获取用户数量
			let users = await userModel.count({
				where: {
					is_delete: {
						[Op.not]: ["2"]
					},
				}
			});
			let orders = await orderModel.count({
				where: {
					is_delete: {
						[Op.not]: ["2"]
					},
				}
			});
			let orderMoney = await orderModel.sum("total_price" ,{
				where: {
					is_delete: {
						[Op.not]: ["2"]
					},
				}
			});
			let shops = await shopModel.count({
				where: {
					is_delete: {
						[Op.not]: ["2"]
					},
				}
			});
			res.send(resultMessage.success({
				userNum: users,
				orders: orders,
				orderMoney: orderMoney,
				shops: shops
			}));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},
	// 获取会员总量
	getUsers: async (req, res) => {
		try {
			// 获取用户数量
			// let users = sequelize.query("SELECT * FROM user", { model: userModel }).then(function(userModel){
			// 	// 每条记录都是一个Project 实例
			// 	res.send(resultMessage.success(users));
			// select * from `user` where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time);
			// select * from `user` where DATE_SUB(CURDATE(), INTERVAL 1 MONTH) <= date(create_time);
			sequelize.query("SELECT * FROM `user` where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time);", { type: sequelize.QueryTypes.SELECT})
				.then(function(users) {
					// 并不需要在这spread 展开结果，因为所返回的只有所查询的结果
					res.send(resultMessage.success(users));
				});

		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},

};
