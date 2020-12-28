const express = require('express');

const app = express();
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const sessionParser = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const controller = require('./controller/index');
const loginMiddleware = require('./middleware/loginMiddleware');
const config = require('./config/AppConfig');
const ChangeLog = require('./middleware/ChangeLog');
const LogMiddleware = require('./middleware/LogMiddleware');
const Env = require('./config/Env');

// 解析cookie和session还有body
app.use(cookieParser(config.cookieSign)); // 挂载中间件，可以理解为实例化
app.use(
	sessionParser({
		secret: 'ruidoc', // 签名，与上文中cookie设置的签名字符串一致，
		cookie: {
			maxAge: 90000,
		},
		name: 'session_id', // 在浏览器中生成cookie的名称key，默认是connect.sid
		resave: false,
		saveUninitialized: true,
	}),
);
app.use(express.static(Env.env ? '/root/asserts' : path.join(__dirname, './public')));
app.use('/moving', express.static(path.join(__dirname, './public')));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 打印日志

// 改变默认的log
ChangeLog.changeLog();

// 改变默认的info
ChangeLog.changeInfo();

// 改变默认的error
ChangeLog.changeError();

// 自定义日志
app.use(LogMiddleware);

app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Credentials', true); // 可以带cookies
	res.header('X-Powered-By', '3.2.1');
	if (req.method === 'OPTIONS') {
		res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
	} else {
		next();
	}
});

// 判断用户是否登录
app.use(loginMiddleware);

// 路由 controller层
controller(app);

// 监听8080端口  线上
app.listen(8080, () => {
	console.log(chalk.yellow('server is listenning 8080'));
});
