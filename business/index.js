// 导入模块
let express = require('express');

// 导入处理路径模块
let path = require('path');

// 实例化
let app = express();

// console.log('_dirname文件绝对路径=》',__dirname);

// 设置静态文件目录
app.use(express.static('assets'))
// app.use('/zyxc',express.static('assets')) //更为严格，类加密文件

// 设置视图目录
// app.set('views',path.resolve(__dirname + '/views'));
app.set('views',path.resolve(__dirname,'views')); //写法二

// 设置视图引擎
app.set('view engine','ejs');

// 路由
app.get('/',(req,res) =>{

// req请求对象， res响应对象
// 智能返回任何数据类型
// res.send({status:200,msg:'成功'}); //响应数据

// 响应并渲染模板 index.ejs
// res.render(模板路径，模板关联数据)  模板关联数据类似vue的data
// res.render('index1',{name:'张艺兴',age:'28'});
res.render('index');
})

app.get('/register', (req, res) => {
    res.render('register');
})
  
app.get('/login', (req, res) => {
    res.render('login');
})
  
app.get('/forgetpwd', (req, res) => {
    res.render('forgetpwd');
})

// 监听端口
app.listen(10002,() =>{
    console.log('服务器开启成功');
})
