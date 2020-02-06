let Sequelize = require('sequelize'); //导入sequelize

let Model = Sequelize.Model; // 定义模型 (类似表结构)

// 定义商家数据表的结构
class Business extends Model {} //继承与Model

// 初始化  定义表结构
// !!!!!!!!!要是需要添加其他内容，需要将数据库工具中的表删除之后重新生成，否则不起作用，要是其他模块使用到了这样就会
// 导致报错！！！！！！！！！！
Business.init({
    // 定义id字段
    id:{
        type: Sequelize.INTEGER.UNSIGNED, //字段类型
        allowNull: false,  //是否为空
        autoIncrement: true, //紫东递增
        primaryKey: true, //主键
        comment:'表主键id' //注释
    },

    //定义email字段
    userEmail: {
      type: Sequelize.STRING(40), //STRING: 字符类型, 40个字符
      allowNull: false,
      defaultValue:'', //默认值
      comment: '用户邮箱'
    },

    // 用户名
    userName:{
        type:Sequelize.STRING(40),
        allowNull:false,
        defaultValue: '', //默认值
        comment: '用户名'
    },

    // 密码
    password:{
        type:Sequelize.STRING(32),
        allowNull:false,
        defaultValue: '', //默认值
        comment: '用户密码'
    },

    // 用户id
    userId: {
        type: Sequelize.STRING(18),
        allowNull: false,
        defaultValue: '',
        comment: '用户唯一id'
     },

    // 用户手机号
    phone:{
        type:Sequelize.STRING(11),
        allowNull:true,
        comment: '手机号'
    },

    // 身份证号码
    idCard:{
        type:Sequelize.STRING(18),
        allowNull:true,
        comment: '身份证'
    }
}, {

    modelName: 'business',  //模型名称
    tableName: 'business',//表的名称, 如果没有定义表名称，则使用模型名称命名为表名称
    underscored: true,
    //多个单词组合字段以_分隔命名

    timestamps:true,  //添加时间戳
    
    sequelize  //连接实例
});

//创建business表结构
//force: true, 如果数据表存在，则先删除，再创建
//force: false, 如果数据表不存在，则创建
//Business.sync(): 创建表结构，该方法始终返回一个promise
Business.sync({force:false});

module.exports = Business; //导出