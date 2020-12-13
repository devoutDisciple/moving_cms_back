const moment = require('moment');
const Sequelize = require('sequelize');
const resultMessage = require('../util/resultMessage');
const sequelize = require('../dataSource/MysqlPoolClass');
const MoneyUtil = require('../util/MoneyUtil');

const { Op } = Sequelize;
const order = require('../models/order');

const orderModel = order(sequelize);

const bill = require('../models/bill');

const billModel = bill(sequelize);

const cabinet = require('../models/cabinet');

const cabinetModel = cabinet(sequelize);

const ept = require('../models/exception');

const exceptionModel = ept(sequelize);

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
            const {
                current, pagesize, order_type, shopid, code,
            } = req.query;
            const condition = {};
            if (order_type && order_type !== -1) condition.order_type = order_type;
            if (shopid && shopid !== -1) condition.shopid = shopid;
            if (code) {
                condition.code = {
                    [Op.like]: `%${code}%`,
                };
            }
            const offset = CountUtil.getInt((Number(current) - 1) * pagesize);
            const orders = await orderModel.findAll({
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
            const result = responseUtil.renderFieldsAll(orders, [
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
            result.forEach((item, index) => {
                item.username = orders[index].userDetail ? orders[index].userDetail.username : '';
                item.member = orders[index].userDetail ? orders[index].userDetail.member : '';
                item.phone = orders[index].userDetail ? orders[index].userDetail.phone : '';
                item.shop = orders[index].shopDetail ? orders[index].shopDetail.name : '';
            });
            const total = await orderModel.count({ where: condition });
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
            const totalOrderNum = await orderModel.count();
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
            const totalUserNum = await UserModel.count();
            // 今日新增
            let todayUserNum = await sequelize.query('select count(id) as count from `user` where to_days(create_time) = to_days(now())', {
                type: sequelize.QueryTypes.SELECT,
            });
            // 总的柜子数量
            const totalCabinetNum = await cabinetModel.count();
            // 总格口数
            const totalCabinetCellNum = (Number(totalCabinetNum) * 29).toFixed(0);
            // 已经使用过的格口数组
            const usedCabinetCellArr = await cabinetModel.findAll({ attributes: ['used'] });
            // 格口操作次数
            const cabinetUseTimes = await exceptionModel.count();
            // 格口操作失败次数
            const cabinetUseErrorTimes = await exceptionModel.count({ where: { success: 2 } });

            let usedCabinetCellNum = 0;
            let abledCabinetCellNum = 0;
            usedCabinetCellArr.forEach((item) => {
                const used = JSON.parse(item.used);
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
                    cabinetUseTimes,
                    cabinetUseErrorTimes,
                }),
            );
        } catch (error) {
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

    // 获取订单量统计 根据 周 月 年
    getSalesByTime: async (req, res) => {
        const { type } = req.query;
        // type可能为 1-本周数据 2-本月数据 3-全部数据
        let str = '';
        // 查询过去七天，以天为单位
        if (type === 1) {
            str = 'select DATE_FORMAT(create_time,\'%Y-%m-%d\') days, count(id) count from `order` where  DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) group by days order by days DESC;';
        }
        // 查询过去一个月，以天为单位
        if (type === 2) {
            str = 'select DATE_FORMAT(create_time,\'%Y-%m-%d\') days, count(id) count from `order` where  DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(create_time) group by days order by days DESC;';
        }
        // 查询全部数据
        if (type === 3) str = 'select DATE_FORMAT(create_time,\'%Y-%m-%d\') days, count(id) count from `order` group by days order by days DESC;';
        try {
            sequelize.query(str, { type: sequelize.QueryTypes.SELECT }).then((projects) => {
                res.send(resultMessage.success(projects));
            });
        } catch (error) {
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

    // 获取订单种类数量
    getOrderTypeNum: async (req, res) => {
        try {
            const result = {};
            result.orderType1 = await orderModel.count({ where: { order_type: 1 } });
            result.orderType2 = await orderModel.count({ where: { order_type: 2 } });
            result.orderType3 = await orderModel.count({ where: { order_type: 3 } });
            result.orderType4 = await orderModel.count({ where: { order_type: 4 } });
            res.send(resultMessage.success(result));
        } catch (error) {
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

    // 根据用户id获取全部订单 getAllListByUserId
    getAllListByUserId: async (req, res) => {
        try {
            const { userid } = req.query;
            const orders = await orderModel.findAll({ where: { id: userid } });
            const result = responseUtil.renderFieldsObj(order, [
                'id',
                'code',
                'shopid',
                'goods',
                'discount',
                'origin_money',
                'money',
                'pre_pay',
                'send_money',
                'desc',
                'urgency',
                'status',
                'order_type',
                'send_status',
                'send_home',
                'cabinetId',
                'cellid',
                'is_sure',
                'create_time',
            ]);
            result.forEach((item, index) => {
                item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
                item.shopName = orders[index].shopDetail ? orders[index].shopDetail.name || '' : '';
                item.cabinetUrl = orders[index].cabinetDetail ? orders[index].cabinetDetail.url || '' : '';
                item.cabinetName = orders[index].cabinetDetail ? orders[index].cabinetDetail.name || '' : '';
                item.cabinetAdderss = orders[index].cabinetDetail ? orders[index].cabinetDetail.address || '' : '';
                item.send_stattus = orders[index] ? orders[index].send_stattus || '' : '';
                MoneyUtil.countMoney(item);
                // 上门取衣
                if (item.order_type === 2) {
                    item.home_address = orders[index] ? orders[index].home_address || '' : '';
                    item.home_username = orders[index] ? orders[index].home_username || '' : '';
                    item.home_phone = orders[index] ? orders[index].home_phone || '' : '';
                    item.home_time = orders[index] ? moment(orders[index].home_time).format('YYYY-MM-DD HH:mm:ss') || '' : '';
                }
                // 积分兑换
                if (item.order_type === 3) {
                    item.intergral_address = orders[index] ? orders[index].intergral_address || '' : '';
                    item.intergral_phone = orders[index] ? orders[index].intergral_phone || '' : '';
                    item.intergral_username = orders[index] ? orders[index].intergral_username || '' : '';
                    item.intergral_num = orders[index] ? orders[index].intergral_num || '' : '';
                }
            });
            res.send(resultMessage.success(result));
        } catch (error) {
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

};
