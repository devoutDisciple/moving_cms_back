const resultMessage = require('../util/resultMessage');
const request = require('request');
const md5 = require('md5');
const moment = require('moment');

module.exports = {
	// 登录
	login: async (req, res) => {
		const url = 'http://boxserver.zmkmdz.com/web/users/login';
		try {
			request(
				{
					url: url,
					method: 'POST',
					form: { userid: 'xiyigui', password: '123123' },
				},
				function (error, response, body) {
					console.log(body);
					res.send(resultMessage.success(body));
				},
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
	// 查看柜体状态
	getState: async (req, res) => {
		try {
			const url = 'http://boxserver.zmkmdz.com/box/getboxinfo';
			const parmas = {
				mtype: 'ipc',
				boxid: 'xiyiguitest001',
				mtoken: 'f54605cb5ef64880b958f002dc37b487',
				time: moment().format('yyyy-MM-dd HH:mm:ss'),
			};
			const str = md5(parmas.mtype + parmas.boxid + parmas.mtoken + parmas.time).toLowerCase();
			parmas.sign = str;
			request(
				{
					url: url,
					method: 'POST',
					headers: parmas,
					form: { boxid: 'xiyiguitest001' },
				},
				function (error, response, body) {
					console.log(body);
					res.send(resultMessage.success(body));
				},
			);
		} catch (error) {
			console.log(error);
			return res.send(resultMessage.error([]));
		}
	},
};
