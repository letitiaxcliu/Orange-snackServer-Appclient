// 4整合所有表模型

// 导入所有模型
let baseUrl = __basename + '/db/model' //抽出公共部分

let Business = require(baseUrl + '/business.js'); //商家用户表模型
let Protype = require(baseUrl + '/protype.js');//商品类型模型
let Products = require(baseUrl + '/products.js'); //导入商品数据

let User = require(baseUrl + '/user.js'); //导入商品数据
let Shopcart = require(baseUrl + '/shopcart.js'); //导入商品数据
let Orders = require(baseUrl + '/orders.js'); //提交订单数据


// 导出所有模型
module.exports = {
    Business,
    Protype,
    Products,
    User,
    Shopcart,
    Orders
}