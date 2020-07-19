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
};
