const resultMessage = require("../util/resultMessage");
const sequelize = require("../dataSource/MysqlPoolClass");
const rate = require("../models/rate");
const rateModel = rate(sequelize);

module.exports = {

	// 获取提现费率
	getAll: async (req, res) => {
		try {
			let data = await rateModel.findAll();
			res.send(resultMessage.success(data));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 修改提现数据
	modify: async (req, res) => {
		try {
			let body = req.body;
			let params = {
				shop_rate: body.shop_rate,
				other_rate: body.other_rate,
			};
			await rateModel.update(params, {
				where: {
					id: body.id
				}
			});
			res.send(resultMessage.success("success"));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
