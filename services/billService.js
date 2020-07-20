const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const responseUtil = require('../util/responseUtil');
const bill = require('../models/bill');
const billModel = bill(sequelize);

module.exports = {
	// 获取用户所有消费记录
	getAllByUserid: async (req, res) => {
		try {
			let { userid } = req.query;
			let list = await billModel.findAll({
				where: { userid: userid },
				order: [['create_time', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(list, ['id', 'code', 'userid', 'orderid', 'money', 'send', 'pay_type', 'type', 'create_time']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取充值消费记录 通过时间
	getMoneyNumByTime: async (req, res) => {
		let { type } = req.query;
		// type可能为 1-本周数据 2-本月数据 3-全部数据
		let str = '';
		// 查询过去七天，以天为单位
		if (type == 1) {
			str =
				"select DATE_FORMAT(create_time,'%Y-%m-%d') days, sum(money) money from `bill` where  DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) group by days order by days DESC;";
		}
		// 查询过去一个月，以天为单位
		if (type == 2) {
			str =
				"select DATE_FORMAT(create_time,'%Y-%m-%d') days, sum(money) money from `bill` where  DATE_FORMAT(create_time, '%Y%m' ) = DATE_FORMAT(CURDATE( ),'%Y%m') group by days order by days DESC;";
		}
		// 查询全部数据
		if (type == 3) str = "select DATE_FORMAT(create_time,'%Y-%m-%d') days, sum(money) money from `bill` group by days order by days DESC;";
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
