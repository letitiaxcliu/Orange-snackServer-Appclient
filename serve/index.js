// 设置基础路径基于index.js全局 (__dirname相对于index.js的绝对路径)
global.__basename = __dirname;

// 导入配置（要放前面，这样下面的才可以使用）全局
global.config = require(__dirname + '/config/config.js');


// 导入模块
let express = require('express');


// 导入解析post请求体模块
let bodyParser = require('body-parser');

// 导入路由文件
let route = require(__basename + '/route/route.js');

// 导入连接数据库
global.sequelize = require(__basename + '/db/db_config/db_config.js');


// 初始化所有表结构
global.Model = require(__basename + '/db/model/model.js');

let app = express(); //实例化


//设置静态目录，并且添加路径前缀,访问时需要忽略upload文件夹 (http://127.0.0.1:10002/assets/jvw12E1577464023249.jpeg???打不开图片)
app.use('/assets', express.static('upload')); 
// app.use(express.static('upload'));

// 解析post请求体
app.use(bodyParser.urlencoded({
    extended:false,

    limit: '1024kb' //允许post请求体最大大小为1024kb

})); 

// 跨域请求配置
// *: 任何路径, 任何请求路径都必须经过app.all中间件
// *: 任何域都可访问   next主要控制是否允许通过
app.all('*', (req, res, next) => {

    console.log('req.headers ==> ', req.headers);

    //动态绑定-客户前端登录注册方法
  if (config.originListOptions.indexOf(req.headers.origin) === -1) {
    console.log('a11111111111aaa');
    return res.send({msg: config.sceneValues.origin.fail.msg, status: config.sceneValues.origin.fail.code});
  }

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Origin","http://192.168.53.78:10002");
    // res.header("Access-Control-Allow-Origin"," http://127.0.0.1:10002");
    
    res.header("Access-Control-Allow-Origin", req.headers.origin); //替换为origin路径 —— 配置允许请求域跨域的白名单

    // 允许跨域
    //如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // 允许的请求类型PUT,POST,GET,DELETE,OPTIONS
    //该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    //该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可
    res.header('Access-Control-Allow-Credentials', true);

    //OPTIONS: 用于嗅探服务器接收哪些请求类型
    // if (req.method == 'OPTIONS') {
    //   console.log('aaa');
    //   return res.send(true);
    // }

    // 都改为POST或GET了

    next(); //允许通过
})


route(app); //执行路由

// 404处理
app.use((req,res) =>{
    res.status = 404;
    res.send('找不到资源');
})

// 500后台服务器
app.use((err,req,res) =>{
    res.status = 500;
    res.send({msg:'后台服务器程序出错',statusCode:500});
})

// 监听端口
app.listen(config.serverOptions.port,() =>{
    console.log(`the server running on ${config.serverOptions.host}:${config.serverOptions.port}`);
})