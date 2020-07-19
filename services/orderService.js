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
const responseUtil = require('../util/responseUtil');

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
};
