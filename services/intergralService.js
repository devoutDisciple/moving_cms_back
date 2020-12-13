const Sequelize = require('sequelize');
const fs = require('fs');
const resultMessage = require('../util/resultMessage');

const { Op } = Sequelize;
const sequelize = require('../dataSource/MysqlPoolClass');
const intergral = require('../models/intergral_goods');

const intergralModel = intergral(sequelize);
const responseUtil = require('../util/responseUtil');
const shop = require('../models/shop');
const AppConfig = require('../config/AppConfig');

const preUrl = AppConfig.intergralPreUrl;

const filePath = AppConfig.intergralImgFilePath;
const ImageDeal = require('../util/ImagesDeal');

const shopModel = shop(sequelize);
intergralModel.belongsTo(shopModel, { foreignKey: 'shopid', targetKey: 'id', as: 'shopDetail' });

module.exports = {
    // 根据商店id获取积分列表
    getByShopId: async (req, res) => {
        try {
            const { shopid } = req.query;
            const where = {
                is_delete: {
                    [Op.not]: ['2'],
                },
            };
            if (shopid && Number(shopid) !== -1)where.shopid = shopid;
            const swiper = await intergralModel.findAll({
                where,
                include: [
                    {
                        model: shopModel,
                        as: 'shopDetail',
                    },
                ],
                order: [['sort', 'DESC']],
            });
            const result = responseUtil.renderFieldsAll(swiper, ['id', 'shopid', 'name', 'desc', 'url', 'intergral', 'sort', 'create_time']);
            result.forEach((item, index) => {
                item.shopName = swiper[index].shopDetail.name || '';
            });
            res.send(resultMessage.success(result));
        } catch (error) {
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

    // 增加积分列表
    add: async (req, res, filename) => {
        try {
            const { body } = req;
            const params = {
                shopid: body.shopid,
                name: body.name,
                intergral: body.intergral,
                desc: body.desc,
                sort: body.sort,
                create_time: body.create_time,
            };
            if (filename)params.url = preUrl + filename;
            await intergralModel.create(params);
            res.send(resultMessage.success('success'));
            ImageDeal.dealImages(`${filePath}/${filename}`);
        } catch (error) {
            fs.exists(`${filePath}/${filename}`, () => {
                fs.unlinkSync(`${filePath}/${filename}`);
            });
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

    // 更新
    update: async (req, res, filename) => {
        try {
            const { body } = req;
            const params = {
                shopid: body.shopid,
                name: body.name,
                intergral: body.intergral,
                desc: body.desc,
                sort: body.sort,
            };
            if (filename && body.update !== 'no') params.url = preUrl + filename;
            await intergralModel.update(params, {
                where: {
                    id: body.id,
                },
            });
            res.send(resultMessage.success('success'));
            ImageDeal.dealImages(`${filePath}/${filename}`);
        } catch (error) {
            fs.exists(`${filePath}/${filename}`, () => {
                fs.unlinkSync(`${filePath}/${filename}`);
            });
            console.log(error);
            return res.send(resultMessage.error([]));
        }
    },

    delete: async (req, res) => {
        try {
            await intergralModel.destroy({
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
};
