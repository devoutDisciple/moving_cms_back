const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');

const except = require('../models/exception');

const exceptionModel = except(sequelize);

const cabinet = require('../models/cabinet');

const cabinetModel = cabinet(sequelize);
exceptionModel.belongsTo(cabinetModel, { foreignKey: 'cabinetid', targetKey: 'id', as: 'cabinetDetail' });

const responseUtil = require('../util/responseUtil');
const CountUtil = require('../util/CountUtil');

module.exports = {
	// 获取分页订单 所有订单
	getAllByPagesize: async (req, res) => {
		try {
			const { current, pagesize, order_type, success, cabinetid } = req.query;
			const condition = {};
			if (order_type && Number(order_type) !== -1) condition.order_type = order_type;
			if (cabinetid && Number(cabinetid) !== -1) condition.cabinetid = cabinetid;
			if (success && Number(success) !== -1) condition.success = success;
			// if (code)
			// 	condition.code = {
			// 		[Op.like]: '%' + code + '%',
			// 	};
			const offset = CountUtil.getInt((Number(current) - 1) * pagesize);
			const records = await exceptionModel.findAll({
				include: [
					{
						model: cabinetModel,
						as: 'cabinetDetail',
					},
				],
				order: [['create_time', 'DESC']],
				limit: Number(pagesize),
				offset: Number(offset),
				where: condition,
			});
			const result = responseUtil.renderFieldsAll(records, [
				'id',
				'success',
				'result',
				'optid',
				'user_type',
				'cabinetid',
				'boxid',
				'cellid',
				'create_time',
			]);
			result.forEach((item, index) => {
				item.cabinetName = records[index].cabinetDetail ? records[index].cabinetDetail.name : '';
				item.cabinetAddress = records[index].cabinetDetail ? records[index].cabinetDetail.address : '';
				item.cabinetUrl = records[index].cabinetDetail ? records[index].cabinetDetail.url : '';
			});
			const total = await exceptionModel.count({ where: condition });
			res.send(resultMessage.success({ dataSource: result, total }));
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
