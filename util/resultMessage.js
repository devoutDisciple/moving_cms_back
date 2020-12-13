module.exports = {
    // 200 成功
    // 500 系统错误
    // 400 指定错误
    // 401 没有登录 或者 登录超时
    success: (data) => ({
        code: 200,
        success: true,
        data,
    }),
    error: (err) => ({
        code: 500,
        success: false,
        message: err.message,
    }),
    errorMsg: (data) => ({
        code: 400,
        success: false,
        message: data,
    }),
    loginError: (data) => ({
        code: 401,
        success: false,
        message: data || '请重新登录!',
    }),
    specilError: (code, data) => ({
        code,
        success: false,
        message: data,
    }),
};
