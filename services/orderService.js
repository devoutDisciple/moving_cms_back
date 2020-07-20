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
	getAllByPagesize: async (req, res) => {
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
			let usedCabinetCellNum = 0,
				abledCabinetCellNum = 0;
			usedCabinetCellArr.forEach((item) => {
				let used = JSON.parse(item.used);
				usedCabinetCellNum += used.length;
			});
			abledCabinetCellNum = totalCabinetCellNum - usedCabinetCellNum;
			todayOrderNum = Number(todayOrderNum[0].count);
			totalMoney = Number(totalMoney).toFixed(2);
			todayMoney = Number(todayMoney[0].count).toFixed(2);
			todayUserNum = Number(todayUserNum[0].count);
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

	// 获取订单量统计 根据 周 月 年
	getSalesByTime: async (req, res) => {
		let { type } = req.query;
		// type可能为 1-本周数据 2-本月数据 3-全部数据
		let str = '';
		// 查询过去七天，以天为单位
		if (type == 1) {
			str =
				"select DATE_FORMAT(create_time,'%Y-%m-%d') days, count(id) count from `order` where  DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) group by days order by days DESC;";
		}
		// 查询过去一个月，以天为单位
		if (type == 2) {
			str =
				"select DATE_FORMAT(create_time,'%Y-%m-%d') days, count(id) count from `order` where  DATE_FORMAT(create_time, '%Y%m' ) = DATE_FORMAT(CURDATE( ),'%Y%m') group by days order by days DESC;";
		}
		// 查询全部数据
		if (type == 3) str = "select DATE_FORMAT(create_time,'%Y-%m-%d') days, count(id) count from `order` group by days order by days DESC;";
		try {
			sequelize.query(str, { type: sequelize.QueryTypes.SELECT }).then(function (projects) {
				res.send(resultMessage.success(projects));
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
