// 同理赋值products.js数据再做修改
let Sequelize = require('sequelize'); //导入sequelize

let Model = Sequelize.Model; // 定义模型 (类似表结构)

// 定义商家数据表的结构
class Products extends Model {} //继承与Model

// 初始化  定义表结构
// 刺眼还会涉及到删除等其他操作，使用逻辑外键
Products.init({
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

    //商品类型
    ptype: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '商品类型'
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

    //是否为vip
    isVip:{
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: '是否为vip,0不是vip,1是vip'
    },

    //商品详情描述
    pdetail:{
        type: Sequelize.STRING, 
        allowNull: false,
        defaultValue: '',   
        comment: '商品描述'
    },

    //商品库存
    pcount:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '商品库存'
    },

    //商品图片
    pimg:{
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '商品图片'
    },

    // 添加两个字段（1227）并在后台关联 - 查询商家id与传递 商品是否禁用，商品栏禁用的时候不能上传数据（？？？不过一进来商品数据上传页面不上传数据要干什么？）
    // 商品0禁用，1启用
    isUse: {
        type:Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: '商品是否禁用'
      },

    // 商家id  同用户id（身份证等）
    uid:{
        type: Sequelize.STRING(18), //STRING: 字符类型, 40个字符
        allowNull: false,
        defaultValue:'', //默认值字符串
        comment: '商家id唯一'
    }

}, {

    modelName: 'products',  //模型名称
    tableName: 'products',//表的名称, 如果没有定义表名称，则使用模型名称命名为表名称
    underscored: true,
    //多个单词组合字段以_分隔命名

    timestamps:true,  //添加时间戳
    
    sequelize  //连接实例
});

//创建products表结构
//force: true, 如果数据表存在，则先删除，再创建
//force: false, 如果数据表不存在，则创建
//Products.sync(): 创建表结构，该方法始终返回一个promise
Products.sync({force: false});

module.exports = Products; //导出