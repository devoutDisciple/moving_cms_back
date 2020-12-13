const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const order = require('../models/order');
const orderModel = order(sequelize);
const user = require('../models/user');
const UserModel = user(sequelize);
orderModel.belongsTo(UserModel, { foreignKey: 'user_id', targetKey: 'id', as: 'userDetail' });
const shop = require('../models/shop');
const ShopModel = shop(sequelize);
orderModel.belongsTo(ShopModel, { foreignKey: 'shop_id', targetKey: 'id', as: 'shopDetail' });
const objUtil = require('../util/ObjectUtil');
const Sequelize = require('sequelize');
const responseUtil = require('../util/responseUtil');

const Op = Sequelize.Op;

module.exports = {
	// 获取订单 所有订单
	getAll: async (req, res) => {
		try {
			let orders = await orderModel.findAll({
				include: [
					{
						model: UserModel,
						as: 'userDetail',
					},
					{
						model: ShopModel,
						as: 'shopDetail',
					},
				],
				order: [['create_time', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(orders, [
				'id',
				'shop_id',
				'user_id',
				'goods',
				'money',
				'send_people',
				'send_money',
				'desc',
				'create_time',
				'modify_time',
			]);
			result.map((item, index) => {
				item.username = orders[index].userDetail ? orders[index].userDetail.username : '';
				item.member = orders[index].userDetail ? orders[index].userDetail.member : '';
				item.phone = orders[index].userDetail ? orders[index].userDetail.phone : '';
				item.member = orders[index].userDetail ? orders[index].userDetail.member : '';
				item.shop = orders[index].shopDetail ? orders[index].shopDetail.name : '';
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// // 根据用户查询所有消费金额
	sumMoney: async (req, res) => {
		try {
			let openid = req.query.openid;
			let money = await orderModel.sum('total_price', {
				where: {
					openid,
					status: [1, 2, 3, 5, 8],
				},
			});
			if (!money) money = 0;
			money = money.toFixed(2);
			return res.send(resultMessage.success(money));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},


	// 更改订单的状态
	updateStatus: async (req, res) => {
		let body = req.body;
		try {
			await orderModel.update(
				{ status: body.status },
				{
					where: {
						id: body.id,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 批量更改订单状态
	updateMoreStatus: async (req, res) => {
		let body = req.body;
		let data = body.data;
		try {
			await orderModel.bulkCreate(data, { updateOnDuplicate: ['status'], ignoreDuplicates: true });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 批量更改订单打印状态
	updateMorePrint: async (req, res) => {
		let body = req.body;
		let data = body.data;
		try {
			await orderModel.bulkCreate(data, { updateOnDuplicate: ['print'] });
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},


	// 获取全部的数据汇总
	getData: async (req, res) => {
		try {
			// 订单总量
			let orderNum = await orderModel.count();
			let orderPrice = await orderModel.sum('total_price');
			orderPrice = Number(orderPrice).toFixed(2);
			// 今天订单数据汇总
			let todayNum = await sequelize.query(
				'select count(id) as count from `order` where to_days(order_time) = to_days(now()) and status != 4 and status != 6 and status != 7',
				{ type: sequelize.QueryTypes.SELECT },
			);
			let todayMoney = await sequelize.query(
				'select sum(total_price) as count from `order` where to_days(order_time) = to_days(now()) and status != 4 and status != 6 and status != 7',
				{ type: sequelize.QueryTypes.SELECT },
			);
			todayMoney = Number(todayMoney).toFixed(2);
			orderNum = Number(orderNum).toFixed(2);
			orderPrice = Number(orderPrice).toFixed(2);
			todayNum = Number(todayNum).toFixed(2);
			todayMoney = Number(todayMoney).toFixed(2);
			res.send(resultMessage.success({ orderNum, orderPrice, todayNum, todayMoney }));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取全部商店销售数量的汇总
	getSales: async (req, res) => {
		let type = req.query.type;
		// type可能为 1-本周数据 2-本月数据 3-全部数据
		let str = '';
		// 查询过去七天，以天为单位
		if (type == 1) {
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, count(id) count from `order` where status != 4 and status != 6 and status != 7 and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(order_time) group by days order by days DESC;";
		}
		// 查询过去一个月，以天为单位
		if (type == 2) {
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, count(id) count from `order` WHERE status != 4 and status != 6 and status != 7 and DATE_FORMAT(order_time, '%Y%m' ) = DATE_FORMAT(CURDATE( ),'%Y%m') group by days order by days DESC;";
		}
		// 查询全部数据
		if (type == 3) str = "select DATE_FORMAT(order_time,'%Y-%m-%d') days, count(id) count from `order` group by days order by days DESC;";
		try {
			sequelize.query(str, { type: sequelize.QueryTypes.SELECT }).then(function (projects) {
				res.send(resultMessage.success(projects));
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取全部的销售额的数据汇总
	getMoney: async (req, res) => {
		let type = req.query.type;
		// type可能为 1-本周数据 2-本月数据 3-全部数据
		let str = '';
		// 查询过去七天，以天为单位
		if (type == 1) {
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, sum(total_price) as money from `order` where status != 4 and status != 6 and status != 7 and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(order_time) group by days order by days DESC;";
		}
		// 查询过去一个月，以天为单位
		if (type == 2) {
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, sum(total_price) as money from `order` WHERE status != 4 and status != 6 and status != 7 and DATE_FORMAT(order_time, '%Y%m' ) = DATE_FORMAT(CURDATE( ),'%Y%m') group by days order by days DESC;";
		}
		// 查询全部数据
		if (type == 3) str = "select DATE_FORMAT(order_time,'%Y-%m-%d') days, sum(total_price) as money from `order` group by days order by days DESC;";
		try {
			sequelize.query(str, { type: sequelize.QueryTypes.SELECT }).then(function (projects) {
				if (projects && projects.length != 0) {
					projects.map((item) => {
						item.money = Number(item.money).toFixed(2);
					});
				}
				res.send(resultMessage.success(projects));
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取商店销售额的数据汇总
	getMoneyByShopid: async (req, res) => {
		let shopid = req.query.shopid;
		let type = req.query.type;
		// type可能为 1-本周数据 2-本月数据 3-全部数据
		let str = '';
		// 查询过去七天，以天为单位
		if (type == 1) {
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, sum(total_price) as money from `order` where  and status != 4 and status != 6 and status != 7 and DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(order_time) and shopid=? group by days order by days DESC;";
		}
		// 查询过去一个月，以天为单位
		if (type == 2) {
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, sum(total_price) as money from `order` WHERE  and status != 4 and status != 6 and status != 7 and DATE_FORMAT(order_time, '%Y%m' ) = DATE_FORMAT(CURDATE( ),'%Y%m') and shopid=? group by days order by days DESC;";
		}
		// 查询全部数据
		if (type == 3)
			str =
				"select DATE_FORMAT(order_time,'%Y-%m-%d') days, sum(total_price) as money from `order` where  and status != 4 and status != 6 and status != 7 and shopid = ? group by days order by days DESC;";
		try {
			sequelize.query(str, { replacements: [shopid], type: sequelize.QueryTypes.SELECT }).then(function (projects) {
				res.send(resultMessage.success(projects));
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据订单位置，状态，名称，用户名称，编号，筛选订单位置
	getOrderByStatusAndPosition: async (req, res) => {
		let body = req.body;
		let where = {
			print: body.print == 'all' ? null : body.print,
			status: body.sendtab,
			people: body.people,
			id: body.id,
			shopid: body.shopid,
			// start_time: body.start_time,
			// end_time: body.end_time
		};
		if (body.sendtab == 3) {
			where.status = [3, 5, 8];
		}
		if (body.sendtab == 4) {
			where.status = [4, 7];
		}
		if (body.start_time && body.end_time) {
			where.order_time = {
				[Op.between]: [body.start_time, body.end_time],
			};
		}
		body.phone
			? (where.phone = {
					[Op.like]: '%' + body.phone + '%',
			  })
			: null;
		objUtil.deleteEmptyObject(where, true);
		body.campus && body.campus != 'all'
			? (where.address = {
					[Op.like]: '%' + body.campus + '%',
			  })
			: null;
		body.name
			? (where.order_list = {
					[Op.like]: '%' + body.name + '%',
			  })
			: null;
		let params = {
			include: [
				{
					model: UserModel,
					as: 'userDetail',
				},
			],
			order: [['order_time', 'DESC']],
		};
		objUtil.isEmpty(where) ? null : (params.where = where);
		try {
			let list = await orderModel.findAll(params);
			let result = [];
			list.map((item) => {
				let obj = {
					id: item.id,
					total_price: item.total_price,
					discount_price: item.discount_price,
					order_time: item.order_time,
					status: item.status,
					username: item.userDetail ? item.userDetail.username : '',
					people: item.people,
					phone: item.phone,
					address: item.address,
					desc: item.desc,
					userPhone: item.userDetail ? item.userDetail.phone : '',
					orderList: item.order_list,
					evaluate: item.evaluateDetail ? item.evaluateDetail.desc : '',
				};
				result.push(obj);
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 查看是否有未派送和退款中订单
	getOrderByStatusForSendAndPay: async (req, res) => {
		let shopid = req.query.id;
		try {
			let sendNum = await orderModel.count({
				where: {
					shopid: shopid,
					status: 1,
				},
			});
			let payNum = await orderModel.count({
				where: {
					shopid: shopid,
					status: 6,
				},
			});
			sendNum = Number(sendNum).toFixed(0);
			payNum = Number(payNum).toFixed(0);
			res.send(
				resultMessage.success({
					sendNum,
					payNum,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},

	// 查看是否有新的订单
	getNewOrderByShopId: async (req, res) => {
		let shopid = req.query.id;
		try {
			let newOrderNum = await orderModel.count({
				where: {
					shopid: shopid,
					status: 1,
				},
			});
			newOrderNum = Number(newOrderNum).toFixed(0);
			res.send(
				resultMessage.success({
					newOrderNum,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error({}));
		}
	},
};