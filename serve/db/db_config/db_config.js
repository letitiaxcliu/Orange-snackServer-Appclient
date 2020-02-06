// 导入sequelize模块
let Sequelize = require('sequelize');

// 创建数据库连接
//server: 数据库名称
//root: 连接数据库名称
//lxc1803647254: 连接数据库密码
// let sequelize = new Sequelize('server','root','lxc1803647254',{

module.exports = new Sequelize(config.mysqlOptions.database,config.mysqlOptions.user,config.mysqlOptions.password,{
    
    host:config.mysqlOptions.host, // 数据库地址
    dialect:config.mysqlOptions.dialect  //连接数据库类型
})