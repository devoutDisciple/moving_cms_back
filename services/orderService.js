const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const order = require('../models/order');
const orderModel = order(sequelize);

const bill = require('../models/bill');
const billModel = bill(sequelize);

const cabinet = require('../models/cabinet');
const cabinetModel = cabinet(sequelize);

const user = require('../models/user');
const UserModel = user(sequelize);
orderModel.belongsTo(UserModel, { foreignKey: 'userid', targetKey: 'id', as: 'userDetail' });

const shop = require('../models/shop');
const ShopModel = shop(sequelize);
orderModel.belongsTo(ShopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

const responseUtil = require('../util/responseUtil');
const CountUtil = require('../util/CountUtil');

module.exports = {
	// 获取分页订单 所有订单
	getAll: async (req, res) => {
		try {
			let { current, pagesize, order_type, shopid, code } = req.query,
				condition = {};
			if (order_type && order_type != -1) condition.order_type = order_type;
			if (shopid && shopid != -1) condition.shopid = shopid;
			if (code)
				condition.code = {
					[Op.like]: '%' + code + '%',
				};
			let offset = CountUtil.getInt((Number(current) - 1) * pagesize);
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
				limit: Number(pagesize),
				offset: Number(offset),
				where: condition,
			});
			let result = responseUtil.renderFieldsAll(orders, [
				'id',
				'code',
				'shopid',
				'userid',
				'money',
				'status',
				'is_sure',
				'desc',
				'order_type',
				'intergral_num',
				'create_time',
			]);
			result.map((item, index) => {
				item.username = orders[index].userDetail ? orders[index].userDetail.username : '';
				item.member = orders[index].userDetail ? orders[index].userDetail.member : '';
				item.phone = orders[index].userDetail ? orders[index].userDetail.phone : '';
				item.shop = orders[index].shopDetail ? orders[index].shopDetail.name : '';
			});
			let total = await orderModel.count({ where: condition });
			res.send(resultMessage.success({ dataSource: result, total }));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 订单数据汇总
	getDataNum: async (req, res) => {
		try {
			// 订单总量
			let totalOrderNum = await orderModel.count();
			// 今天订单总量
			let todayOrderNum = await sequelize.query('select count(id) as count from `order` where to_days(create_time) = to_days(now())', {
				type: sequelize.QueryTypes.SELECT,
			});
			// 全部收入
			let totalMoney = await billModel.sum('money');
			// 今天收入
			let todayMoney = await sequelize.query('select sum(money) as count from `bill` where to_days(create_time) = to_days(now())', {
				type: sequelize.QueryTypes.SELECT,
			});
			// 会员数量
			let totalUserNum = await UserModel.count();
			// 今天收入
			let todayUserNum = await sequelize.query('select count(id) as count from `user` where to_days(create_time) = to_days(now())', {
				type: sequelize.QueryTypes.SELECT,
			});
			// 总的柜子数量
			let totalCabinetNum = await cabinetModel.count();
			// 总格口数
			let totalCabinetCellNum = (Number(totalCabinetNum) * 29).toFixed(0);
			// 已经使用过的格口数组
			let usedCabinetCellArr = await cabinetModel.findAll({ attributes: ['used'] });
			console.log(usedCabinetCellArr, 999);
			let usedCabinetCellNum = 0,
				abledCabinetCellNum = 0;
			usedCabinetCellArr.forEach((item) => {
				console.log(item.used, 8888);
				let used = JSON.parse(item.used);
				usedCabinetCellNum += used.length;
			});
			abledCabinetCellNum = totalCabinetCellNum - usedCabinetCellNum;
			todayOrderNum = Number(todayOrderNum[0].count);
			totalMoney = Number(totalMoney).toFixed(2);
			todayMoney = Number(todayMoney[0].count).toFixed(2);
			todayUserNum = Number(todayUserNum[0].count);
			console.log(totalOrderNum, todayOrderNum, totalMoney, todayMoney, totalUserNum, todayUserNum, totalCabinetCellNum, abledCabinetCellNum, 222);
			res.send(
				resultMessage.success({
					totalOrderNum,
					todayOrderNum,
					totalMoney,
					todayMoney,
					totalUserNum,
					todayUserNum,
					totalCabinetCellNum,
					abledCabinetCellNum,
				}),
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
