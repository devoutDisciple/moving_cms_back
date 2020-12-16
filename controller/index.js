const swiperController = require('./swiperController');
const cabinetController = require('./cabinetController');
const shopController = require('./shopController');
const orderController = require('./orderController');
const accoutController = require('./accoutController');
const areaController = require('./areaController');
const intergralController = require('./intergralController');
const clothingController = require('./clothingController');
const userController = require('./userController');
const addressController = require('./addressController');
const billController = require('./billController');
const optionController = require('./optionController');
const exceptionController = require('./exceptionController');
const adverController = require('./adverController');

const testController = require('./testController');

const router = (app) => {
    // 商店相关
    app.use('/shop', shopController);
    // 角色
    app.use('/account', accoutController);
    // 轮播图
    app.use('/swiper', swiperController);
    // 订单相关
    app.use('/order', orderController);
    // 快递柜相关
    app.use('/cabinet', cabinetController);
    // 区域相关
    app.use('/area', areaController);
    // 积分兑换管理
    app.use('/intergral', intergralController);
    // 商店衣物
    app.use('/clothing', clothingController);
    // 会员相关
    app.use('/user', userController);
    // 地址相关
    app.use('/address', addressController);
    // 消费记录相关
    app.use('/bill', billController);
    // 意见反馈相关 optionController
    app.use('/option', optionController);
    // 洗衣柜打开记录
    app.use('/exception', exceptionController);
    // 广告图片 adverController
    app.use('/adver', adverController);

    // 测试相关
    app.use('/test', testController);
};
module.exports = router;
