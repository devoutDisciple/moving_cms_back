const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const Sequelize = require('sequelize');
const responseUtil = require('../util/responseUtil');
const Op = Sequelize.Op;
const user = require('../models/user');
const UserModel = user(sequelize);

module.exports = {
	// 获取所有用户
	all: async (req, res) => {
		try {
			let list = await UserModel.findAll({
				order: [['create_time', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(list, ['id', 'photo', 'nickname', 'username', 'phone', 'member', 'balance', 'integral', 'create_time']);
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 根据搜索条件查询用户
	getByCondition: async (req, res) => {
		try {
			let { member, name, phone } = req.query,
				condition = {};
			if (member && member != 9) condition.member = member;
			if (name)
				condition.username = {
					[Op.like]: '%' + name + '%',
				};
			if (phone)
				condition.phone = {
					[Op.like]: '%' + phone + '%',
				};
			let list = await UserModel.findAll({
				where: condition,
				order: [['create_time', 'DESC']],
			});
			res.send(resultMessage.success(list));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
