const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const options = require("../models/options");
const OptionsModel = options(sequelize);
const user = require("../models/user");
const userModel = user(sequelize);
OptionsModel.belongsTo(userModel, { foreignKey: "openid", targetKey: "openid", as: "userDetail",});

module.exports = {

	// 获取全部意见
	all: async (req, res) => {
		try {
			let result = await OptionsModel.findAll({
				order: [
					// will return `name`  DESC 降序  ASC 升序
					["create_time", "DESC"],
				],
				include: [{
					model: userModel,
					as: "userDetail",
				}],
			});
			let list = [];
			result.map(item => {
				list.push({
					username: item.userDetail ? item.userDetail.username : "--",
					avatarUrl: item.userDetail ? item.userDetail.avatarUrl : "--",
					phone: item.userDetail ? item.userDetail.phone : "--",
					text: item.text,
					create_time: item.create_time
				});
			});

			res.send(resultMessage.success(list));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},


};
