// 操作数据api
class API{
    // 添加记录
    //modelName: 模型//o: 写入数据  t:事务对象 （，不传就是undefined不会影响之前的使用createData方法的其他操作的对象形式）
    createData(modelName, o,t) {
        return Model[modelName].create(o,{transaction:t});
    }

    //删除数据
    destroyData(modelName, condition) {
      //modelName: 模型名称, 类型string
      //condition: 条件， 类型object
      return Model[modelName].destroy(
        {
          where: condition
        }
      );
    }

    // 查询
    //modelName：模型  condition: 查询条件  attributes: 查询字段
    findData(modelName, condition, attributes) {
        return Model[modelName].findAll({
            where:condition, //condition: 查询条件 object
            attributes //attributes: 查询字段  array
        });
    }

    // 更新数据
    //modelName: 模型名称/attributeValues：修改属性值，类型object
    // condition: 条件， 类型object  /t: 事务处理对象
    updateData(modelName,attributeValues,condition,t){
        return Model[modelName].update(attributeValues, {
            where: condition
        },{transaction:t});
    }

    
    //分页查询符合条件的所有记录数并记录数据  
    findPaginationData(modelName, condition, offset, limit) {
        //modelName: 模型名称/condition: 查询条件
        //offset: 偏移到第几条数据开始查询,必须为number的数字/limit: 查询记录数量, 必须为number的数字
        return Model[modelName].findAndCountAll({
            where: condition,
            offset,
            limit
        })
    }

    //查询记录数量
    countData(modelName, condition) {
        return Model[modelName].count({
          where: condition
        });
    }

    // 原始数据查询
    queryData(sql,o){
        return sequelize.query(sql,{
            bind: o,
            type: sequelize.QueryTypes.SELECT
        })
    }

    // 事务处理：多条sql语句一个集合，只要有一条sql执行失败，整个事务都是失败的，失败时事务会进行回滚
    // (恢复所有数据的上一状态)，只有所有sql语句全部执行成功，该事务才是成功
    // 当执行两条sql语句或者两条以上，可能需要用到事务处理（添加数据、更改数据、删除数据）
    transaction(fn){
        return sequelize.transaction(fn);
    }

}
module.exports = new API();