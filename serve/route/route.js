// 2路由层

// 导入路由控制器层
let routeController = require(__basename + '/route_controller/route_controller.js'); //global.__basename = __dirname;

// 导出函数 导出方式二  module。exports.route = function(app){}等同于箭头函数module.exports.route = app =>{}
module.exports = app =>{

    app.use(routeController.vliadToken);   //token拦截

    app.post('/register', routeController.register);   //注册

    app.post('/sendEmail', routeController.sendEmail); //发邮件

    app.post('/login', routeController.login); //登录（2）

    // '/login'这些路径都可以随意命名与routeController.login方法没有关系
    
    app.post('/business', routeController.business); //商家进入后台

    app.post('/forgetPwd', routeController.forgetPwd); //忘记密码

    app.post('/modifyPwd', routeController.modifyPwd); //修改密码

    app.post('/uploadProductData', routeController.uploadProductData); //上传商品数据
    
    app.get('/protype', routeController.getProtype); // 商品数据类型 
    // 这里要是 get请求，前端也要用get来请求

    app.get('/findProductData', routeController.findProductData); //查询商家的商品数据型 
       
    app.post('/disabledProData', routeController.disabledProData); //禁用商品 isUse = 0

    app.post('/delProductData', routeController.delProductData); //禁用商品 isUse = 0

    //client
    app.get('/getMessageCode', routeController.getMessageCode); //获取短信验证码
    
    app.post('/appRegister', routeController.appRegister); //客户端注册

    app.post('/appLogin', routeController.appLogin); //客户端登录

    app.get('/appProduct', routeController.appProduct); //客户端首页数据

    app.get('/appProDetail', routeController.appProDetail); //客户端详情
      
    app.get('/apptypePro', routeController.apptypePro); //根据商品类型获取商品
    
    app.get('/findShopcartData', routeController.findShopcartData); // 查询客户端用户购物车数据
    
    app.post('/appaddShopcart', routeController.appaddShopcart); //加入购物车

    app.post('/modifyShopcartProCount', routeController.modifyShopcartProCount); //修改购物未付款商品的数量
    
    app.post('/delShopcartPro', routeController.delShopcartPro); //删除购物车单个商品

    app.post('/delAllshopcartPros', routeController.delAllshopcartPros); //清空购物车

    app.post('/submitOrders', routeController.submitOrders); //客户端 提交订单
    
    app.post('/apppwdLogin', routeController.apppwdLogin); //客户端密码登录

    app.get('/user', routeController.user); //客户端登录

}