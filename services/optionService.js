const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const options = require('../models/options');
const OptionsModel = options(sequelize);
const user = require('../models/user');
const userModel = user(sequelize);
const responseUtil = require('../util/responseUtil');
OptionsModel.belongsTo(userModel, { foreignKey: 'userid', targetKey: 'id', as: 'userDetail' });

module.exports = {
	// 获取全部意见
	all: async (req, res) => {
		try {
			let status = req.query.status,
				where = {};
			if (status != 9) {
				where.status = status;
			}
			let result = await OptionsModel.findAll({
				where: where,
				order: [['create_time', 'DESC']],
				include: [
					{
						model: userModel,
						as: 'userDetail',
					},
				],
			});
			let list = responseUtil.renderFieldsAll(result, ['id', 'userid', 'desc', 'option', 'create_time', 'status']);
			result.forEach((item, index) => {
				list[index]['username'] = item.userDetail ? item.userDetail.username : '';
				list[index]['phone'] = item.userDetail ? item.userDetail.phone : '';
				list[index]['photo'] = item.userDetail ? item.userDetail.photo : '';
				list[index]['age'] = item.userDetail ? item.userDetail.age : '';
				list[index]['member'] = item.userDetail ? item.userDetail.member : '';
				list[index]['sex'] = item.userDetail ? item.userDetail.sex : '';
			});
			res.send(resultMessage.success(list));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 更改意见状态
	updateStatus: async (req, res) => {
		try {
			await OptionsModel.update(
				{ status: 2 },
				{
					where: {
						id: req.body.id,
					},
				},
			);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
