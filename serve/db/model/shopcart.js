// 同理赋值shopcart.js数据再做修改
let Sequelize = require('sequelize'); //导入sequelize

let Model = Sequelize.Model; // 定义模型 (类似表结构)

// 定义商家数据表的结构
class Shopcart extends Model {} //继承与Model

// 初始化  定义表结构
// 刺眼还会涉及到删除等其他操作，使用逻辑外键
Shopcart.init({
    // 定义id字段
    id:{
        type: Sequelize.INTEGER.UNSIGNED, //字段类型
        allowNull: false,  //是否为空
        autoIncrement: true, //紫东递增
        primaryKey: true, //主键
        comment:'表主键id' //注释
    },

    //商品id字段
    pid: {
        type: Sequelize.STRING(20), //STRING: 字符类型, 40个字符
        allowNull: false,
        defaultValue:'', //默认值字符串
        comment: '商品id'
    },

    //商品名称
    pname: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',   
        comment: '商品名称'
    },

    //商品价格
    pPrice:{
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0, //数值默认值定为0
        comment: '商品价格' 
    },

    //vip价格
    vipPrice:{
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '商品vip价格'
    },

    //商品图片
    pimg:{
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '商品图片'
    },

    //用户唯一id
    userId: {
      type: Sequelize.STRING(18),
      allowNull: false,
      defaultValue: '',
      comment: '用户唯一id'
    },
    
    // 商家id  同用户id（身份证等）
    uid:{
        type: Sequelize.STRING(18), //STRING: 字符类型, 40个字符
        allowNull: false,
        defaultValue:'', //默认值字符串
        comment: '商家id唯一'
    },

    //购买数量
    count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '购买数量'
    },

    //购买状态
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
      comment: '购买状态0未付款,1待发货,2待收货,3已收货'
    },

}, {

    modelName: 'shopcart',  //模型名称
    tableName: 'shopcart',//表的名称, 如果没有定义表名称，则使用模型名称命名为表名称
    underscored: true,
    //多个单词组合字段以_分隔命名

    timestamps:true,  //添加时间戳
    
    sequelize  //连接实例
});

//创建shopcart表结构
//force: true, 如果数据表存在，则先删除，再创建
//force: false, 如果数据表不存在，则创建
//Shopcart.sync(): 创建表结构，该方法始终返回一个promise
Shopcart.sync({force: false});

module.exports = Shopcart; //导出