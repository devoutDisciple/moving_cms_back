const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const clothing = require('../models/clothing');
const shop = require('../models/shop');
const responseUtil = require('../util/responseUtil');

const ShopModel = shop(sequelize);
const clothingModel = clothing(sequelize);
clothingModel.belongsTo(ShopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

module.exports = {
	// 增加衣物
	add: async (req, res) => {
		let body = req.body;
		try {
			await clothingModel.create(body);
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 删除衣物
	deleteById: async (req, res) => {
		try {
			await clothingModel.destroy({
				where: {
					id: req.body.id,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 获取衣物根据shopid
	getByShopid: async (req, res) => {
		try {
			let { shopid } = req.query,
				where = {};
			shopid && shopid != -1 ? (where.shopid = shopid) : null;
			let clothings = await clothingModel.findAll({
				where: where,
				include: [
					{
						model: ShopModel,
						as: 'shopDetail',
					},
				],
				order: [['sort', 'DESC']],
			});
			let result = responseUtil.renderFieldsAll(clothings, ['id', 'shopid', 'name', 'price', 'sort', 'create_time']);
			result.forEach((item, index) => {
				item.shopName = clothings[index]['shopDetail']['name'] || '';
			});
			res.send(resultMessage.success(result));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},

	// 更新衣物
	update: async (req, res) => {
		try {
			let body = req.body;
			await clothingModel.update(body, {
				where: {
					id: body.id,
				},
			});
			res.send(resultMessage.success('success'));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
