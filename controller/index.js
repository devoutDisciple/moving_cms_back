const userController = require('./userController');
const swiperController = require('./swiperController');
const positionController = require('./positionController');
const cabinetController = require('./cabinetController');
const shopController = require('./shopController');
const goodsController = require('./goodsController');
const payController = require('./payController');
const orderController = require('./orderController');
const evaluateController = require('./evaluateController');
const carController = require('./carController');
const collectionController = require('./collectionController');
const accoutController = require('./accoutController');
const countController = require('./countController');
const billController = require('./billController');
const adverController = require('./adverController');
const rateCountroller = require('./rateCountroller');
const printController = require('./printController');
const optionController = require('./optionController');
const areaController = require('./areaController');
const intergralController = require('./intergralController');
const clothingController = require('./clothingController');

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

	// 数据汇总
	app.use('/count', countController);
	// 费率
	app.use('/rate', rateCountroller);
	// 用户
	app.use('/user', userController);
	// 广告
	app.use('/adver', adverController);
	// 位置信息
	app.use('/position', positionController);
	// 购物车
	app.use('/car', carController);
	// 收藏
	app.use('/collection', collectionController);
	// 商品相关
	app.use('/goods', goodsController);
	// 支付相关
	app.use('/pay', payController);
	// 提现相关
	app.use('/bill', billController);
	// 评价相关
	app.use('/evaluate', evaluateController);
	// 打印机
	app.use('/print', printController);
	// 意见反馈
	app.use('/option', optionController);

	// 测试相关
	app.use('/test', testController);
};
module.exports = router;
