module.exports = {
	// 200 成功
	// 500 系统错误
	// 400 指定错误
	// 401 没有登录 或者 登录超时
	success: (data) => {
		return {
			code: 200,
			success: true,
			data: data,
		};
	},
	error: (err) => {
		return {
			code: 500,
			success: false,
			message: err.message,
		};
	},
	errorMsg: (data) => {
		return {
			code: 400,
			success: false,
			message: data,
		};
	},
	loginError: (data) => {
		return {
			code: 401,
			success: false,
			message: data || '请重新登录!',
		};
	},
	specilError: (code, data) => {
		return {
			code: code,
			success: false,
			message: data,
		};
	},
};
