//需要token的白名单
module.exports = {
    code: {
        key: 'code',
        title: '验证码的token验证',
        url: ['/register', '/modifyPwd', '/appRegister','/appLogin']
    },

    //默认为登录验证
    default:{
        key:'login',
        title:'登录的token验证',
        url: ['/business','/uploadProductData','/findProductData','/disabledProData','/findShopcartData','/appaddShopcart','/modifyShopcartProCount','/delShopcartPro','/delAllshopcartPros','/user']
    }
}
    // 修改register.js中注册获取验证码之后判断验证码的token验证result.data.key = 'code';