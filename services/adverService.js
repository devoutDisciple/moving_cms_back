const fs = require('fs');
const resultMessage = require('../util/resultMessage');
const AppConfig = require('../config/AppConfig');

const filePath = AppConfig.adverImgFilePath;
const ImageDeal = require('../util/ImagesDeal');

module.exports = {
	// 更新轮播图
	update: async (req, res, filename) => {
		try {
			res.send(resultMessage.success('success'));
			ImageDeal.dealImages(`${filePath}/${filename}`);
			fs.exists(`${filePath}/${filename}`, () => {
				fs.copyFileSync(`${filePath}/${filename}`, `${filePath}/advertisement.png`);
			});
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
