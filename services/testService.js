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
			const url = 'http://boxserver.zmkmdz.com/box/laundry/getbox_freecell';
			const params = {
				mtype: 'laundry',
				boxid: 'xiyiguitest001',
				mtoken: '79ace0a740e443fc8593605bd3152a1c',
				time: moment().format('YYYY-MM-DD HH:mm:ss'),
				skey: 'Smartbox',
			};
			const str = md5(params.boxid + params.time + params.skey).toLowerCase();
			params.sign = str;
			request(
				{
					url: url,
					method: 'POST',
					headers: params,
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

	// 开启格口
	open: async (req, res) => {
		try {
			const url = 'http://boxserver.zmkmdz.com/box/laundry/open_box_cell';
			const params = {
				mtype: 'laundry',
				boxid: 'xiyiguitest001',
				mtoken: 'a884f26a48a14da3a43cad49179c38a6',
				time: moment().format('YYYY-MM-DD HH:mm:ss'),
				skey: 'Smartbox',
				cellid: '119',
			};
			const str = md5(params.boxid + params.cellid + params.time + params.skey).toLowerCase();
			params.sign = str;
			request(
				{
					url: url,
					method: 'POST',
					headers: params,
					form: { boxid: 'xiyiguitest001', cellid: '119' },
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
