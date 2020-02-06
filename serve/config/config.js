// 1配置层

let Sequelize = require('sequelize'); // 导入sequelize
exports.Op = Sequelize.Op; // sequelize条件操作

// 服务器配置
exports.serverOptions = {
    // host:'http//192.168.53.78', //域名
    host:'http://127.0.0.1',
    port:10008, //端口
}

// 数据库配置(一个文件多个exports只能一个module.exports)
exports.mysqlOptions = {
    database:'server',// 数据库名称
    user:'root', // 登录用户名
    password:'lxc1803647254', //登录密码

    host:'localhost', // 连接地址
    dialect:'mysql',// 连接类型
}

// 加盐配置
exports.saltOptions = {
    userIdSalt:'lay_l', //用户id
    pwdSalt:'lay_x', //密码加盐    
    codeSalt: 'lay_code', //验证码加盐

    userLoginSalt:'lay_login',  //用户名登录加盐

    orderSalt: 'lay_order'  //用户名登录加盐
    
}

// 发邮件配置
exports.emailOptions = {

    // host:'smtp.163.com', //主机
    // port:25,   //端口
    // user:'letitialiu1112@163.com', // 发邮件地址
    // pass:'lxc1112102' //授权码

    host: 'smtp.126.com',
    //端口
    port: 25,
    //发邮件地址
    user: 'hoiping_557@126.com',
    //授权码
    pass: '5571234567aa'
  
    // user: 'kangliuyong@126.com',
    // pass: 'action2019'
}

//商品类型配置
exports.protypeOptions = [
    // 配置好和那边的名字一样就行
    {
        protypeName: 'nut',
        protypeTitle: '坚果',
        protypeId: 'nut'
    },

    {
        protypeName: 'chocolate',
        protypeTitle: '巧克力',
        protypeId: 'chocolate'
    },

    {
        protypeName: 'bread',
        protypeTitle: '面包',
        protypeId: 'bread'
    },
    
    {
        protypeName: 'other',
        protypeTitle: '其他',
        protypeId: 'other'
    }
]

// 场景值配置 (使用1000以上值，不会和http的冲突)
exports.sceneValues = {
    
    //注册场景值
    register:{
        //注册成功
        success: {
            code: 1000,
            msg: '注册成功'
        },
        
        //注册失败
        fail: {
            code: 1001,
            msg: '注册失败'
        },

        //邮箱已经被注册
        info: {
            code: 1002,
            msg: '该邮箱已经被注册'
        },

        //手机号已经被注册
        warn: {
            code: 1003,
            msg: '该手机号已经被注册'
        }
    },

    //登录场景值
    login:{
        //登录成功
        success: {
            code: 2000,
            msg: '登录成功'
        },
        
        //登录失败
        fail: {
            code: 2001,
            msg: '登录失败'
        },

        //该用户不存在
        info: {
            code: 2002,
            msg: '该用户不存在'
        },

        //用户名或密码不正确
        warn: {
            code: 2003,
            msg: '用户名或者密码不正确'
        },
      
        unlogin: {
            code: 2004,
            msg: '该用户未登录'
        }
    },

    //验证码场景值
    validCode:{
        //验证码成功
        success: {
            code: 3000,
            msg: '验证码成功'
        },
        
        //验证码失败
        fail: {
            code: 3001,
            msg: '验证码失败'
        },

        info: {
            code: 3002,
            msg: '邮箱验证码已发至您的邮箱'
        },

        warn: {
            code: 3003,
            msg: '获取邮箱验证失败'
        }
      
    },

    //查询数据场景值
    findData: {
        success: {
            msg: '查询数据成功',
            code: 4000
        },

        fail: {
            msg: '查询数据失败',
            code: 4001
        }
    },

    //修改密码场景值
    modifyPwd: {
        success: {
            msg: '修改密码成功',
            code: 5000
        },

        fail: {
            msg: '修改密码失败',
            code: 5001
        }
    },

    //文件上传
    uploadFile: {
        success: {
            msg: '文件上传成功',
            code: 6000
        },

        fail: {
            msg: '文件上传失败',
            code: 6001
        }
    },

    //添加商品
    addProduct: {
        success: {
            msg: '添加商品成功',
            code: 8000
        },
        fail: {
            msg: '添加商品失败',
            code: 8001
        }
    },

    //禁用商品
    disablePro: {
        success: {
            msg: '禁用商品成功',
            code: 9000
        },
        fail: {
            msg: '禁用商品失败',
            code: 9001
        }
    },

    // 跨域
    origin:{
        fail: {
            msg: '跨域请求不合法',
            code: 10001
        }
    },

    //发短信场景
    sendMessage: {
        success: {
          msg: '短信验证码已发送至您的手机，请查收',
          code: 20000
        },
        fail: {
          msg: '获取短信验证码失败',
          code: 20001
        }
    },

    //添加商品进购物车
    shopcart: {
        success: {
          msg: '添加商品进购物车成功',
          code: 30000
        },
        fail: {
          msg: '添加商品进购物车失败',
          code: 30001
        },
        info: {
            msg: '更新购物车商品数量成功',
            code: 30002
        },
        warn: {
            msg: '更新购物车商品数量失败',
            code: 30003
        },
        delSuccess: {
            msg: '删除购物车商品成功',
            code: 30004
        },
        delFail: {
            msg: '删除购物车商品失败',
            code: 30005
        }
    },

    //事务处理场景
    transaction: {
        success: {
          msg: '事务处理成功！',
          code: 40000
        },
        fail: {
          msg: '事务处理失败',
          code: 40001
        }
    }
}

//分页配置
exports.paginationOptions = {
    count: 2  //每次查询2条数据, 一页展示的数据
}

// 阿里短信配置(阿里云里注册购买使用)
exports.messageOptions = {
    // （注册安装好阿里短信模块）_导入发短信模块 _config中短信配置 _ utils发短信方法

    accessKeyId:'LTAI4Fwq1p9wBdLx7T8NBMW4', //密钥id
    secretAccessKey:'e6IAdaRwMJf6gbVZka7PWNw1oZmAaM',   //加密密钥
    templateCode:'SMS_181550625',   //模板号
    signName: '晓橙子LiuApp'  //签名
}
 
// 允许请求域跨域的白名单  (允许跨域)
exports.originListOptions = [
    'http://127.0.0.1:10002', //后台
    'http://127.0.0.1:8080'//client

    // 'http://192.168.53.78:8080' //client
    //'http://192.168.43.250:8080' //游客能够网络不一样这里的路径与域名不一样，按照cmb打开的路径修改进白名单即可
    
]
