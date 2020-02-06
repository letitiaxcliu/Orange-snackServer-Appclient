// 和Protype是一样的结构，内容字段一部样而已ctrl+c

let Sequelize = require('sequelize'); //导入sequelize

let Model = Sequelize.Model; // 定义模型 (类似表结构)

// 定义商家数据表的结构
class Protype extends Model {} //继承与Model

// 初始化  定义表结构
// !!!!!!!!!要是需要添加其他内容，需要将数据库工具中的表删除之后重新生成，否则不起作用，要是其他模块使用到了这样就会
// 导致报错！！！！！！！！！！
Protype.init({
    // 定义id字段
    id:{
        type: Sequelize.INTEGER.UNSIGNED, //字段类型
        allowNull: false,  //是否为空
        autoIncrement: true, //紫东递增
        primaryKey: true, //主键
        comment:'表主键id' //注释
    },

    //商品类型名称
    protypeName:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue: '', //默认值
        comment: '商品类型名称'
    },

    //商品类型标题
    protypeTitle: {
      type:Sequelize.STRING(30), //STRING: 字符类型, 40个字符
      allowNull: false,
      defaultValue:'', //默认值
      comment: '商品类型标题'
    },

    //商品类型id，用于关联商品
    protypeId: {
        type: Sequelize.STRING(18),
        allowNull: false,
        defaultValue: '',
        comment: '商品类型id'
     },

}, {

    modelName: 'protype',  //模型名称
    tableName: 'protype',//表的名称, 如果没有定义表名称，则使用模型名称命名为表名称
    underscored: true,
    //多个单词组合字段以_分隔命名

    timestamps:true,  //添加时间戳
    sequelize  //连接实例
});

//创建Protype表结构
//force: true, 如果数据表存在，则先删除，再创建
//force: false, 如果数据表不存在，则创建
//Protype.sync(): 创建表结构，该方法始终返回一个promise
// Protype.sync({force:false});
    
//初始化商品类型表数据  —— model.js中导入 —— 在配置config.js里配置好商品类型
Protype.sync({force: true}).then(a => {
    // console.log('a=>',a); 
    // console.log('this=>',this);

    //配置好商品数据类型  如果表存在，不会录入数据，如果不存在，只会首次录入数据
    config.protypeOptions.forEach(v =>{
        // sequelize 创建表的方法 
       
        Protype.create({ //（不需要理会会自增的 那个id会自动写入）
            protypeName: v.protypeName,
            protypeTitle: v.protypeTitle,
            protypeId: v.protypeId
        })
        // 要先把之前的表删除再生成这个表否则可能不能生成
        // ！！！！创建表有且只有一次，所以需要创建表的时候记得关掉生成的表
    })  
})

module.exports = Protype; //导出模型