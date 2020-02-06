let utils = require(__basename + '/utils/utils.js'); // 导入工具库

let api = require(__basename + '/api/api.js'); // 导入操作数据api

// let jsonwebtoken = require('jsonwebtoken'); //导入jsonwebtoken模块

let list = require(__basename + '/list/list.js'); // 导入白名单

//导入文件系统模块
let fs = require('fs'); //不需要安装  上传图片设置好接口后， 然后在本页商家上传数据写入

// 3路由控制层
class RouteController{

    // token验证  token拦截
    // 在前端进行请求，需要在后台拦截和设置token白名单放list.js里
    vliadToken(req, res, next){
        console.log('req.headers.cookie token验证 qqqqqqqqqqqqqqqq==> ', req.headers.cookie);

        // console.log('req.method ==> ', req.method); //了解请求的类型GET 或POST

        // 除了GET是query获取其他都是body
        let requestType = req.method == 'GET' ? 'query' : 'body';

        let params = req[requestType];
        console.log('params ==> ', params);

        // 不同的请求方式拿到的可能不一样
        // if(req.method == 'POST'){
        //     console.log('req.body=>',req.body);
        // }else if(req.method == 'GET'){
        //     console.log('req.query=>',req.query);
        // }
        // return res.send('暂时先阻止底部的运行');

        // console.log('req.url=>',req.url); // /sendEmail
        // console.log('req.body=>',req.body); 

        // 输出为： （接下就是验证这里的code是否和解析的）cookieData=> {ctk。。。相等
        // req.body=> [Object: null prototype] {username: 'qwer',email: 'qwer@qq.com',pwd: 'a111111',code: '255812'}

        // console.log('list[params.key] ==> ', list[params.key]);//list[params.key]=> { key: 'code', title: '验证码的token验证', url: [ '/register' ] }

        // 如果不需要验证
        if (!params.key) {
            return next();
        }

        console.log('req.url ==> ', req.url);

        //处理请求路径,去除?后面的查询参数  （get）
        let url = req.url.split('?')[0];// 条件修改为这个哦 indexOf(url) 才能获取路径 /findProductData
        // console.log('url ==> ', url);

        // 修改为：区别登录验证与验证码验证   !!!!!!!!!!!!!要是没有达到想要达到的效果，请试着刷新所以保存过的cookie数据等
        if (list[params.key].url.indexOf(url) > -1) {

            console.log('req.headers.cookie token验证 ==> ', req.headers.cookie);
            // 获取cookie
            let cookieData = utils.transformCookieObject(req.headers.cookie);
            console.log('cookieData ==> ', cookieData);

            if (!cookieData) {
                //如果cookie不存在
                if (list[params.key].key == 'code') {
                //  return res.send({msg: '验证码输入不正确', status: 3001});
                    return res.send({msg: config.sceneValues.validCode.fail.msg, status: config.sceneValues.validCode.fail.code});

                } else {
                //  return res.send({msg: '用户未登录', status: 2001});
                    return res.send({msg: config.sceneValues.login.unlogin.msg, status: config.sceneValues.login.unlogin.code});

                }
            }

            //token名称   （在区别两个验证之后）
            let tkName = list[params.key].key == 'code' ? 'ctk' : 'utk';
            console.log('tkName=>',tkName);
            console.log('cookieData[tkName] ==> ', cookieData[tkName]);

            //token加盐方式
            let salt = list[params.key].key == 'code' ? config.saltOptions.codeSalt : config.saltOptions.userLoginSalt;
            
            // 验证token
            utils.validToken(cookieData[tkName], salt, (err, decode) => {
                //token验证失败
                if(err){
                    // res.send({msg:'验证码输入错误 ',status:3001});  //验证码的token验证
                    if (list[params.key].key == 'code') {
                      
                        // res.send({msg:'qqqqqqqqqqq验证码输入错误 ',status:3001});  //验证码的token验证
                        res.send({msg: config.sceneValues.validCode.fail.msg, status: config.sceneValues.validCode.fail.code});
                    } else { 
                    //    res.send({msg: '用户未登录', status: 2001}); //登录token验证
                        res.send({msg: config.sceneValues.login.unlogin.msg, status: config.sceneValues.login.unlogin.code});
                    }
                }else{
                    console.log('decode=>',decode);

                    if (list[params.key].key == 'code') {
                        if (decode.data == params.code) {

                            // 验证通过
                            console.log('验证码验证通过');
                            next();  //next可以匹配其他路由（res.send服务器已经把数据响应，所以要用next把数据响应）
                        }else{
                            // res.send({msg:'2222222222222验证码输入不正确',status:3001});
                            res.send({msg: config.sceneValues.validCode.fail.msg, status: config.sceneValues.validCode.fail.code});

                        }
                    }else{
                        //登录token验证
                        // return res.send({msg: '登录验证拦截', status: 2001});

                        console.log('登录通过');
                        //为请求对象的query对象添加一个email属性
                        req.query.email = decode.data; //为了拿到邮件前的用户名显示在页面上用户
                        next(); //就会去匹配下一个路由business方法
                    }
                }
            })
        }else{
            next(); //不需要验证，直接通过
        }
        // 拦截成进入前端注册页面将code的配置取消掉，在注册方法中获取code信息
        
    }  

    // 注册方法
    register(req,res){

        // 查询该有是否被注册
        api.findData('Business', {
            userEmail:req.body.email
        },['userEmail']).then(result =>{

            if(result[0]){
                //用户存在
                // res.send({msg:'该邮箱已被注册',status:1002});
                res.send({msg: config.sceneValues.register.info.msg, status: config.sceneValues.register.info.code});

            }else{
                // 生成用户id
                let userId = config.saltOptions.userIdSalt + new Date().getTime();

                // 加密
                let password = utils.encodeString(req.body.pwd);
                // console.log('password=>',password);

                let o = {
                    userEmail: req.body.email,
                    userName: req.body.username,
                    password,
                    userId
                };

                console.log('o ==> ', o);

                //在商家用户表business添加记录
                api.createData('Business',o)
                .then(result =>{
                    // console.log('result=>',result);
                    // res.send({msg: '注册成功', status: 1000});
                    res.send({msg: config.sceneValues.register.success.msg, status: config.sceneValues.register.success.code});

                }).catch(err=>{
                    console.log('err=>',err);
                    // res.send({msg: '注册失败', status: 1001});
                    res.send({msg: config.sceneValues.register.fail.msg, status: config.sceneValues.register.fail.code});
                })
            }
        })
        .catch(err =>{
            res.send({msg: '查询出错'});
        })
    }

    // 发送邮件方法
    sendEmail(req,res){
        console.log('req.body ==> ', req.body);

        //随机生成6位验证码
        let randomCode = utils.getValidCode();
        console.log('randomCode=> ', randomCode);

        // 抽离发邮件方法
        // 安装 npm i jsonwebtoken 之后设置签名
        //data: 生成token的数据  /expiresIn: 过期时间  /config.saltOptions.codeSalt: token加盐

        // 抽离token 
        //token过期时间
        let time = 60 * 5;
        let codeToken = utils.getToken(randomCode, config.saltOptions.codeSalt,time)
        // 商家注册成功进入register.js在获取验证码下进行token保存在cookie等设置
        
        // 发送邮件已成功暂时关闭发送邮件  测试时不要发送邮件
        return res.send({
            msg: '邮箱验证码已发至您的邮箱', 
            status: 4000, 
             __ctk:{
                key: 'ctk',
                ctk: codeToken //命名可随意
            },time});

        //发送邮件
        utils.sendEmail([req.body.email], randomCode, (err, info) => {

            if(err){
                // res.send({msg: '获取验证码失败', status: 4001});
                res.send({msg: config.sceneValues.validCode.warn.msg, status: config.sceneValues.validCode.warn.code});

            }else{
                console.log('info ==> ', info);
                
                //对验证码进行签名
                let codeToken = utils.getToken(validCode, config.saltOptions.codeSalt, time)
                res.send({
                    msg: config.sceneValues.validCode.info.msg, 
                    status: config.sceneValues.validCode.info.code,   
                    __ctk: {
                      key: 'ctk',
                      ctk: codeToken
                    },
                    time
                });
            }
        });

    }
 
    // 登录方法
    // 登录 （登录不用token验证）（1）
    login(req,res){
        console.log('req.body=>',req.body); //req.body=> [Object: null prototype] { email: 'qwert@126.com', pwd: 'a111111' }
        
        // 查询当前用户是否合法 （调用api.js中的查询方法） 同理本页注册方法
        api.findData('Business',{
            userEmail:req.body.email
        },['userEmail','userName','password','userId'])
        .then(result => {
            console.log('login result =>',result);

            if(result.length == 0){
                // res.send({msg:'该用户不存在', status:2002});
                res.send({msg: config.sceneValues.login.info.msg, status: config.sceneValues.login.info.code});

            }else{
                //匹配密码/获取查询密码
                let password = result[0].dataValues.password;

                // 验证密码是否一致
                let pwd = utils.encodeString(req.body.pwd);
                //前端使用正确的邮箱和密码换取一个唯一凭证，用于其他验证用户登录
                if(password == pwd){
                    // 生成token凭证  '7d' 7天的意思
                    let __utk = utils.getToken(req.body.email, config.saltOptions.userLoginSalt, '7d');

                    // res.send({msg: '登录成功', status: 2000, __utk: {key: 'utk', utk: __utk}, time: 7});
                    res.send({msg: config.sceneValues.login.success.msg, status: config.sceneValues.login.success.code, __utk: {key: 'utk', utk: __utk}, time: 7});
                   
                    // let __utk = utils.getToken(req.body.email,config.saltOptions.userLoginSalt,'7d');
                    // res.send({msg:'登录成功',status:2000,__utk:{key:'utk',utk:__utk},time:7}); //测试请求是否接通 (res.send的数据返回给前端，在页面查看，不返回的在后台输出就在后台看，前端就前端看)
                }else{
                    // res.send({msg:'邮箱或者密码不正确',status:2003}); //或 增加安全性
                    res.send({msg: config.sceneValues.login.warn.msg, status: config.sceneValues.login.warn.code});
                }
            }
        }).catch(err =>{
            // res.send({msg:'登录失败',status:2001}) //一个控制里只能一个res.send
            res.send({msg: config.sceneValues.login.fail.msg, status: config.sceneValues.login.fail.code});

        })
        // 登录成功就到login.js下保存token
        // res.send({msg:'登录成功',status:2000}); //测试请求是否接通 (res.send的数据返回给前端，在页面查看，不返回的在后台输出就在后台看，前端就前端看)
    }

    // 商加进入后台 （如果登录验证通过，就会匹配该路径）
    business(req,res){ 
        // res.send({msg:'req.query.email'}); //在本页验证vliadToken(req, res, next){}下获取

        //查询用户数据 —— 回到前端index.js
        api.findData('Business',{
            userEmail: req.query.email
        },['userName'])
        .then(result =>{
            // res.send({msg:result[0].dataValues,status:5000});
            res.send({msg: config.sceneValues.findData.success.msg, status: config.sceneValues.findData.success.code, data: result[0].dataValues});

        })
        .catch(err =>{
            // res.send({msg:'用户数据查询失败',status:5001});
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});

        })
    }

    //忘记密码 - 获取邮箱验证码
    forgetPwd(req,res){
        // res.send('忘记密码-获取验证码');
        
        //查询修改密码的用户邮箱是否存在 (同理的方法 先查询再和注册那样生成)
        api.findData('Business',{
            userEmail:req.body.email
        },['userId'])
        .then(result =>{
            console.log('result=>',result);

            if(result.length == 0){
                // res.send({msg:'你没有注册该邮箱',status:1003}); //用户不存在
                res.send({msg: config.sceneValues.login.info.msg, status: config.sceneValues.login.info.code});

            }else{
                // 随机6位验证码
                let randomCode = utils.getValidCode();
                console.log('randomCode =>',randomCode);
                
                let time = 60 * 10; //token过期时间
                // 对验证码进行签名
                let codeToken = utils.getToken(randomCode, config.saltOptions.codeSalt, time)
                return res.send({
                    msg: config.sceneValues.validCode.info.msg, 
                    status: config.sceneValues.validCode.info.code,  
                         __ctk: {
                         key: 'ctk',
                         ctk: codeToken
                    }, 
                    time
                });

                //发送邮件
                utils.sendEmail([req.body.email], randomCode, (err, info) => {
                //如果发送失败
                if (err) {
                    // res.send({msg: '获取邮箱验证码失败', status: 4001});
                    res.send({msg: config.sceneValues.validCode.warn.msg, status: config.sceneValues.validCode.warn.code});
                
                } else {
                
                    //对验证码进行签名
                    let codeToken = utils.getToken(randomCode, config.saltOptions.codeSalt, time)
                    res.send({
                        msg: config.sceneValues.validCode.info.msg, 
                        status: config.sceneValues.validCode.info.code, 
                        status: 4000,  
                        __ctk: {
                            key: 'ctk',
                            ctk: codeToken
                        }, 
                    time});
                }
            })
            // res.send({msg:'验证码已发至您的邮箱',status:4000});
            }   
        }).catch(err=>{
            // res.send({msg: '获取验证码失败', status: 4001});
            res.send({msg: config.sceneValues.validCode.warn.msg, status: config.sceneValues.validCode.warn.code});

        })
    }

    // 修改密码
    modifyPwd(req, res) {
        //忘记密码页面提交按钮下验证发送请求
        res.send('提交修改密码');  

        // 查询用户数据
        api.findData('Business', {
            userEmail: req.body.email
          }, ['userId'])
          .then(result => {

            if (result.length == 0) {
                // res.send({msg: '修改密码失败', status: 5001}); 
                res.send({msg: config.sceneValues.modifyPwd.fail.msg, status: config.sceneValues.modifyPwd.fail.code});

            }else{
                // 对密码进行加密
                let password = utils.encodeString(req.body.pwd);    //调用api中加密encodeString(value){zifuc加密模块}
                
                //更新密码
                api.updateData('Business', {
                    password
                    // 底下{userEmail: req.body.email}是条件
                },{userEmail: req.body.email}).then(result =>{
                    console.log('result ==> ', result); //查看更新后数据
                    // res.send({msg: '修改密码成功', status: 5000})
                    res.send({msg: config.sceneValues.modifyPwd.success.msg, status: config.sceneValues.modifyPwd.success.code});

                })
                .catch(err=>{
                    // res.send({msg: '修改密码失败', status: 5001})
                    res.send({msg: config.sceneValues.modifyPwd.fail.msg, status: config.sceneValues.modifyPwd.fail.code});

                })

            }

          })
          .catch(err=>{
            // res.send({msg: '修改密码失败', status: 5001})
            res.send({msg: config.sceneValues.modifyPwd.fail.msg, status: config.sceneValues.modifyPwd.fail.code});

          })

        console.log('req.body ==> ', req.body)
    }

    //商家上传商品数据 _ 路由导入 - 商家端前端获取index.js完成按钮点击事件$('#commit').on('click',function(){获取ajax}
    uploadProductData(req,res){
        // res.send('商家上传商品数据');

        // console.log('req.body=>',req.body);
        // params=> [Object: null prototype] addpro_name: '22',/   addpro_price: '22',/   addpro_vipprice: '222',/   addpro_detail: '22',/   addpro_count: '22',/   addpro_type: '帽子',/   serverBase64Img: 
        
        // return res.send('暂时性锁住看商家上传商品数据效果');

        //将图片base64码转换为buffer
        // let buffer = new Buffer.from(req.body.serverBase64Img, 'base64');
        let buffer = new Buffer(req.body.serverBase64Img, 'base64');
        // console.log('buffer=>',buffer);
        
        //使用时间戳修改文件名称 (名字不重复 + 再加上6位验证码 + 时间戳，（都可以的，不一样就好)
        let filename = utils.getValidCode() + new Date().getTime() + '.' + req.body.imgType;
        console.log('filename=>,filename');

        // fs.writeFile(写入文件路径, 文件buffer, 处理函数)  —— 创建路径创建upload文件夹放上传的图片
        fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
            // 如果写入失败
            if(err){
                // res.send({msg:'上传图片失败', status:6001});
                res.send({msg: config.sceneValues.uploadFile.fail.msg, status:config.sceneValues.uploadFile.fail.code});

            }else{
                // res.send({msg: '上传图片成功', status: 6000});

                // 查询商家id
                api.findData('Business', {
                    userEmail: req.query.email
                }, ['userId']).then(result => {
                    // console.log('aaaaresult ==> ', result)
                    
                    let userId = result[0].dataValues.userId;
                    // console.log('userId ==> ', userId)
                    
                    // 创建商品product.js表之后  前端修改传入类型 - 将商品录入数据库
                    // 将商品录入数据库   (body后的名字就有意义与前端的部分用到的部分对应，这里写上的有声明定义☞效)
                    let data = {
                        pid: utils.getValidCode() + new Date().getTime(),
                        pname: req.body['addpro_name'],
                        pPrice:  req.body['addpro_price'],
                        ptype: req.body['addpro_type'],
                        vipPrice: req.body['addpro_vipprice'],
                        isVip: Number(req.body['product-vip']), //数值型result.data['product-vip-price'] == '' ? 0 : 1;
                        pdetail: req.body['addpro_detail'],
                        pcount: Number(req.body['addpro_count']),
                        pimg: filename,
                        uid: userId,
                        isUse: 1
                    };
                    console.log('data ==> ', data);     
                        // addpro_type: "mingchazhuanqu"/ addpro_name: "茉莉花茶"
                        // addpro_price: "111.00"/ addpro_vipprice: "11.00"/ addpro_detail: "111111111111"
                        // addpro_count: 111111/ serverBase64Img: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQ"
                        // key: "default" / imgType: "jpeg"/ product-vip: 1

                    // 调用api.createData('Products')  方法
                    // res.send({msg:'上传图片成功',status:6000});
                    api.createData('Products',data).then(result => {
                        console.log('result=>',result);
                        // res.send({msg:'商品数据上传成功',status:8000,result});
                        res.send({msg: config.sceneValues.addProduct.success.msg, status:config.sceneValues.addProduct.success.code});
                    
                    })
                    .catch(err =>{
                        console.log('err ==> ', err);
                        // res.send({msg:'商品数据上传失败',status:8001});
                        res.send({msg: config.sceneValues.addProduct.fail.msg, status:config.sceneValues.addProduct.fail.code});

                    }) 

                })
                .catch(err => {
                    // res.send({msg:'查询失败',status:4001});
                    res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});

                })
            }
        })
        // 图片以pRmJ6A1577358817377的命名格式保存在upload中 —— 创建商品类型表（db/model/protype.js）
    
    }

    //查询商品类型
    getProtype(req,res){

        // res.send('查询商品类型');

        //查询数据  （只传递一个模型名称能查询全部 'Protype'就是protype里的类哦）
        api.findData('Protype').then(result =>{

            // console.log('result=>',result); //有几个

            // 声明一个data空数组再遍历效果和给data:result一样
            let data = [];
            result.forEach(element => {
                data.push(element.dataValues);
            });
            
            // res.send({msg: '查询商品类型数据成功', status: 4000,data});
            res.send({msg: config.sceneValues.findData.success.msg, status: config.sceneValues.findData.success.code, data});

            // res.send({msg: '查询商品类型数据成功', status: 4000,data:result}); 
            //添加一个data直接页面查看数据
            // msg: "查询商品类型数据成功"/ status: 7000/ data: (3) [{我的三个配置的数据…}, {…}, {…}]

        }).catch(err=>{
            // res.send({msg: '查询商品类型数据失败', status: 4001});
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});

        })
        //查询好到前端绑定
    }

    //查询商家的商品数据
    findProductData(req, res) {
        // res.send('商家的商品数据');

        // return; //暂时性使用sql语句预处理查询数据 （原始查询）
        // console.log('req.query.email => ', req.query.email);
        // 查询商家id
        api.findData('Business', {
            userEmail: req.query.email
        }, ['userId']).then(result => {
            console.log('result_查询商家id => ', result);
            if(result.length == 0){
                return res.send({msg:config.sceneValues.login.unlogin.msg,status:config.sceneValues.login.unlogin.code});
            }

            // 获取商家id
            let userId = result[0].dataValues.userId;

            // 原始数据查询queryData(sql,o){}) ****可以实现所有表的查询**********  
            let sql = 'SELECT `p`.`pid`, `p`.`pname`, `p`.`p_price`, `p`.`vip_price`, `p`.`is_vip`, `p`.`pdetail`, `p`.`pcount`, `p`.`pimg`, `p`.`is_use`, `p`.`created_at`,`pro`.`protype_title`, `pro`.`protype_id` FROM `products` AS `p` INNER JOIN `protype` AS `pro` ON `p`.`ptype` = `pro`.`protype_id` AND `p`.`uid` = $uid LIMIT $offset, $limit';

            api.queryData(sql,{
                uid:userId, 
                limit:config.paginationOptions.count, 
                offset:Number(req.query.offset)
                // type是固定的不需再传

            }).then(result =>{
                console.log('result_原始数据查询=> ', result );
                // res.send('aaaa');

                // 分页查询，查询符合条件的所有商品记录数和记录数据
                api.countData('Products',{
                    uid:userId
                }).then(count =>{
                    console.log('count =>', count);
                    res.send({msg:config.sceneValues.findData.success.msg,status:config.sceneValues.findData.success.code, data:{count,result}});
                }).catch(err =>{
                    res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});
                })
                
            }).catch(err =>{
                // 查询出错
                res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});
            })

        /*
            sequelize.query('SELECT `p`.`pid`, `p`.`pname`, `p`.`p_price`, `p`.`vip_price`, `p`.`is_vip`, `p`.`pdetail`, `p`.`pcount`, `p`.`pimg`, `p`.`is_use`, `p`.`created_at`,`pro`.`protype_title`, `pro`.`protype_id` FROM `products` AS `p` INNER JOIN `protype` AS `pro` ON `p`.`ptype` = `pro`.`protype_id` AND `p`.`uid` = $uid LIMIT $offset, $limit',
                { bind: { uid:userId, limit:config.paginationOptions.count, offset:Number(req.query.offset)}, type: sequelize.QueryTypes.SELECT}
                ).then(v => {
                console.log('v ==> ', v);
                res.send('aaaa');

                }).catch(err => {
                res.send('出错');
            })
            // countData 查询所有满足条件的记录数量

            // return;
            let offset = Number(req.query.offset);// 底下的起始位置要先这样转换虽然之前值一样 ，但是有可能类型收到了什么影响
            // 分页查询，查询符合条件的所有商品记录数和记录数据
            api.findPaginationData('Products', {
                uid:userId
                //0偏移，3是数量
            // },0,3).then(result =>{
                // config下设置分页配置，设定count每次获取的数量的值
            },offset,config.paginationOptions.count).then(result =>{
                // res.send({rows:result.rows,count:result.count})
                res.send({msg: config.sceneValues.findData.success.msg,status: config.sceneValues.findData.success.code, rows: result.rows, count: result.count});
            }).catch(err =>{
                res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});
            }) 
        */

        }).catch(err =>{
            res.send({msg: config.sceneValues.login.unlogin.msg, status: config.sceneValues.login.unlogin.code});
        })
        // 由于get请求路径会有所不同，所以要在token验证下对路径进行处理leturl = req.url.split('?')[0];，否则这里无法查询和分页
    }

    //禁用商品 isUse = 0
    disabledProData(req,res){

        // res.send('禁用商品');
        api.updateData('Products', {
            isUse: 0 //修改的数据
        },{
            pid: req.body.pid
        }).then(result => {
          console.log('result ==> ', result);
            
            // config中添加场景值 disablePro{}
            // 数据更新成功 即isUSe修改为0
            if(result[0] == 1){
                res.send({msg: config.sceneValues.disablePro.success.msg, status: config.sceneValues.disablePro.success.code});
            }else{
                res.send({msg: config.sceneValues.disablePro.fail.msg, status: config.sceneValues.disablePro.fail.code});
            }
            
        }).catch(err => {
            //更新失败
            res.send({msg: config.sceneValues.disablePro.fail.msg, status: config.sceneValues.disablePro.fail.code});
        })

    }

    //删除商品-编辑商品
    delProductData(req,res){
        res.send('删除商品');
    }


    // client客户

    // 发短信（获取短信）
    getMessageCode(req,res){

        console.log('获取短信req.query=> ', req.query);
        // res.send('发送短信成功');

        //随机生成6位验证码 - 安装vue-cookies main.js中 导入
        let randomCode = utils.getValidCode();
        console.log('randomCode=>',randomCode);

        let time = 60 * 5;
        let codeToken = utils.getToken(randomCode,config.saltOptions.codeSalt, time);

        // 测试（上线重启发短信功能）
        return res.send({msg:config.sceneValues.sendMessage.success.msg, status:config.sceneValues.sendMessage.success.code,__ctk: {
            key:'ctk',
            ctk:codeToken
        },time});

        // 短信发送
        utils.sendMessage([req.query.phone], randomCode).then(data => {
            console.log('data=>',data);
            // res关联好了的， 输出的data可见
            if(data.Code === 'OK'){
                res.send({msg: config.sceneValues.sendMessage.success.msg, status: config.sceneValues.sendMessage.success.code});
            }
        }).catch(err =>{
            res.send({msg: config.sceneValues.sendMessage.fail.msg, status: config.sceneValues.sendMessage.fail.code});
        })
    }

    //客户端注册
    appRegister(req, res) {
        // console.log('req.body ==> ', req.body);
        // res.send('客户端注册');

        // console.log('req.headers.cookie ==> ', req.headers.cookie); 

        // 查找手机是否被注册
        api.findData('User',{
            phone:req.body.phone
        },['userId']).then(result =>{
            if (result.length == 0) {
                let userId = config.saltOptions.userIdSalt + new Date().getTime(); //生成用户id
                
                let password = utils.encodeString(req.body.pwd); //加密 密码登录
                // console.log('password=>',password);

                api.createData('User', {
                  userId,
                  phone: req.body.phone,
                  password,
                  nickname:req.body.nickname
                }).then(result => {

                    //生成登录验证token
                    let __utk = utils.getToken(req.body.phone, config.saltOptions.userLoginSalt, '7d')
                    
                    res.send({msg: config.sceneValues.register.success.msg, status: config.sceneValues.register.success.code,__utk:{key: 'utk', utk: __utk},time: 7});
                
                }).catch(err => {
                    res.send({msg: config.sceneValues.register.fail.msg, status: config.sceneValues.register.fail.code});
                })
              
            } else {
                    res.send({msg: config.sceneValues.register.warn.msg, status: config.sceneValues.register.warn.code});
            }
        }).catch(err => {
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});
        })      
    }

    //客户端登录
    appLogin(req,res){
        // res.send('客户端登录');
        console.log('req.body ==> ', req.body);
        
        //查找用户以及密码等
        api.findData('User',{
            phone:req.body.phone
        },['password','userId'])
        .then(result =>{
            console.log('appLogin result=>',result);

            if(result.length == 0){
                return res.send({msg:config.sceneValues.login.info.msg,status:config.sceneValues.login.info.code});
            }

            // 生成token验证
            let __utk = utils.getToken(req.body.phone, config.saltOptions.userLoginSalt,'7d')

            // 登录方式（账号密码或者手机验证码）
            let loginType = req.body.loginType;
            if(loginType == 0){
                // 手机+验证码
                res.send({msg:config.sceneValues.login.success.msg, status:config.sceneValues.login.success.code, __utk:{key:'utk',utk:__utk},time:7});
            }else if(loginType == 1){
                // 手机+密码
                res.send({msg:config.sceneValues.login.success.msg, status: config.sceneValues.login.success.code, __utk: {key: 'utk', utk: __utk}, time: 7});
            }
        })
    }

    // 密码登录
    apppwdLogin(req,res){
        // console.log('req.body=>',req.body); 
        
        //查找用户以及密码等
        api.findData('User',{
            phone:req.body.phone
        },['password','userId'])
        .then(result =>{
            console.log('apppwdLogin result=>',result);

            if(result.length == 0){
                // res.send({msg:'该用户不存在', status:2002});
                res.send({msg: config.sceneValues.login.info.msg, status: config.sceneValues.login.info.code});

            }else{
                //匹配密码/获取查询密码
                let password = result[0].dataValues.password;

                // 验证密码是否一致
                let pwd = utils.encodeString(req.body.pwd);
                //前端使用正确的邮箱和密码换取一个唯一凭证，用于其他验证用户登录
                if(password == pwd){
                    // 生成token凭证  '7d' 7天的意思
                    let __utk = utils.getToken(req.body.phone, config.saltOptions.userLoginSalt, '7d');

                    res.send({msg: config.sceneValues.login.success.msg, status: config.sceneValues.login.success.code, __utk: {key: 'utk', utk: __utk}, time: 7});
                }else{
                    res.send({msg: config.sceneValues.login.warn.msg, status: config.sceneValues.login.warn.code});
                }
            }
        }).catch(err =>{
            res.send({msg: config.sceneValues.login.fail.msg, status: config.sceneValues.login.fail.code});

        })
        // 登录成功就到login.js下保存token
        // res.send({msg:'登录成功',status:2000}); //测试请求是否接通 (res.send的数据返回给前端，在页面查看，不返回的在后台输出就在后台看，前端就前端看)
    }

    //客户端首页数据 - 查询商品(限制条数)
    appProduct(req,res){
        // res.send('客户端首页数据'); //send能返回各种类型
        api.findPaginationData('Products',undefined,4,20) //从4开始传20条
        .then(result =>{
            res.send({msg: config.sceneValues.findData.success.msg, status: config.sceneValues.findData.success.code, data: result});
        }).catch( err=>{
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});

        })
    }

    // 客户端详情
    appProDetail(req,res){
        // res.send('客户端详情');
        console.log('req.query客户端详情=>',req.query);
        api.findData('Products',{
            pid: req.query.id
        }).then( result =>{
            res.send({msg:config.sceneValues.findData.success.msg,status:config.sceneValues.findData.success.code,data: result});
        }).catch(err =>{
            res.send({msg:config.sceneValues.findData.fail.msg,status:config.sceneValues.findData.fail.code});
        })
    }

    // 根据商品类型获取商品(客户端)
    apptypePro(req,res){
        // res.send('根据商品类型获取商品(客户端)');
        api.findPaginationData('Products',{
            ptype:req.query.protypeId
        },0,20).then( result =>{
            res.send({msg:config.sceneValues.findData.success.msg,status:config.sceneValues.findData.success.code,data: result});
        }).catch(err =>{
            res.send({msg:config.sceneValues.findData.fail.msg,status:config.sceneValues.findData.fail.code});

        })
    }
    
    //查询客户端用户购物车数据
    findShopcartData(req,res){
        // console.log('查询客户端用户购物车数据req.query=>',req.query);
        // res.send('查询客户端用户购物车数据');

        //根据用户id和商品状态=0查询购物车数据
        let sql = 'SELECT `u`.`user_id`, `s`.`pid`, `s`.`pname`, `s`.`p_price`, `s`.`pimg`,`s`.`count`, `s`.`status`,`s`.`created_at` FROM `user` AS `u` INNER JOIN  `shopcart` AS `s` ON `u`.`user_id` = `s`.`user_id`AND `u`.`phone` = $phone AND `s`.`status` = 0';

        api.queryData(sql,{
            phone:req.query.email
        }).then( result =>{
            console.log('result=>',result);

            res.send({msg: config.sceneValues.findData.success.msg, status: config.sceneValues.findData.success.code, data: result});
        }).catch( err =>{
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code})
        })

    }

    //添加商品到购物车
    appaddShopcart(req, res) {
        console.log('req.body=>',req.body);
        // console.log('sssssssssssssssssreq.query=>',req.query);  //{ email: '19849042805' }

        // res.send('添加商品到购物车');
        // console.log('11111111req.query.email=>',req.query.email);

        //查询用户id和商品的价格、商品图片、商品名称
        let sql = 'SELECT `u`.`user_id`, `p`.`pid`, `p`.`pname`, `p`.`p_price`, `p`.`pimg` FROM `user` AS `u` INNER JOIN `products` AS `p` ON `u`.`phone` = $phone AND `p`.`pid` = $pid';

        // console.log('req.query.email,req.body.pid=>',req.body.pid,req.query.email);

        api.queryData(sql,{
            phone: req.query.email,
            pid: req.body.pid

        }).then(result =>{
            // console.log('添加商品到购物车result=>',result);

            //将数据添加购物车表
            if(result.length > 0){
                api.createData('Shopcart',{
                    count:req.body.count,
                    pid: result[0].pid,
                    pname: result[0].pname,
                    pPrice: result[0].p_price,
                    pimg: result[0].pimg,
                    userId: result[0].user_id
                }).then(result =>{
                    console.log('ssssssssssssssssssssssssssss=>',result);
                    res.send({msg: config.sceneValues.shopcart.success.msg, status: config.sceneValues.shopcart.success.code});

                })
                // .catch(err =>{
                //     res.send({msg: config.sceneValues.shopcart.fail.msg, status: config.sceneValues.shopcart.fail.code});

                // })
            }
            else{
                res.send({msg: config.sceneValues.shopcart.fail.msg, status: config.sceneValues.shopcart.fail.code});
                    
            }
        }).catch(err =>{
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});

        })

    }

    //修改购物未付款商品的数量
    modifyShopcartProCount(req, res) {
        console.log('购物车未付款商品的数量 req.body ==> ', req.body);
        // res.send('修改购物未付款商品的数量');

        // let date = utils.formatDate(req.body.date, 'YYYY-MM-DD hh:mm:ss'); //YYYY-MM-DD hh:mm:ss就是格式
        // console.log('date ==> ', date);  

        api.updateData('Shopcart',{
            // 修改的部分
            count:Number(req.body.count)
        },{
            // 条件
            pid: req.body.pid,
            userId: req.body.userId,
            createdAt: req.body.date //在后台server下安装monentjs来格式化时间（各种格式可选）
        }).then( result =>{
            if (result[0] == 0) {
              //没有更新
              res.send({msg: config.sceneValues.shopcart.warn.msg, status: config.sceneValues.shopcart.warn.code});
            } else {
              res.send({msg: config.sceneValues.shopcart.info.msg, status: config.sceneValues.shopcart.info.code, data: result});
            }
        }).catch( err=>{
            res.send({msg: config.sceneValues.shopcart.warn.msg, status: config.sceneValues.shopcart.warn.code});
        })
    }

    //删除购物车单个商品
     delShopcartPro(req, res) {
        console.log('req.body 删除单个商品 => ', req.body);
        //  res.send('删除购物车单个商品');
         
        //  config导入sequelize并sequelize条件操作 _ index中添加允许跨域

        let condition = {};
        //使用op操作 req.body.op = 1;

        //单个删除
        condition.pid = req.body.pid;
        condition.userId = req.body.userId;
        condition.createdAt = req.body.date;

        api.destroyData('Shopcart',condition).then( result =>{
            console.log('删除delShopcartPro result ==> ', result);

            if( result == 0){  //1删除成，0删除失败
                return res.send({msg: config.sceneValues.shopcart.delFail.msg, status: config.sceneValues.shopcart.delFail.code, data: result});
            }
            res.send({msg: config.sceneValues.shopcart.delSuccess.msg, status: config.sceneValues.shopcart.delSuccess.code, data: result});
        }).catch( err=>{
            res.send({msg: config.sceneValues.shopcart.delFail.msg, status: config.sceneValues.shopcart.delFail.code, data: result});

        })

     }

    //清空购物车
    delAllshopcartPros(req, res) {
        console.log('清空购物车req.body ==> ',req.body);
        // res.send('清空购物车');

        // 删除的商品需要变化为方法中需要的格式
        let proData = JSON.parse(req.body.proData);
        console.log('proData=>',proData);

        api.destroyData('Shopcart',{
            userId:req.body.userId,
            [config.Op.or]:proData
        }).then(result =>{
            console.log('清空购物车result=》',result);
            if(result == 0){
                res.send({msg: config.sceneValues.shopcart.delFail.msg, status: config.sceneValues.shopcart.delFail.code, data: result});
            }else{
                res.send({msg: config.sceneValues.shopcart.delSuccess.msg, status: config.sceneValues.shopcart.delSuccess.code, data: result});
            }
            res.send({msg: config.sceneValues.shopcart.delFail.msg, status: config.sceneValues.shopcart.delFail.code});
        })

    }

    //客户端 提交订单
    // 一个订单号可以对应多个商品
    submitOrders(req,res){
        console.log('提交订单req.body ==> ',req.body);
        // res.send('提交订单');

        //获取用户提交的商品数据（订单号等处理）
        let proData = JSON.parse(req.body.proData);
        console.log('提交订单proData=>',proData);

        //先更新购物车的status字段 status = 1，后创建订单数据()
        // 订单id生成  （订单id加盐orderSalt）
        let orderId = config.saltOptions.orderSalt + new Date().getTime();

        //事务处理
        api.transaction(t =>{
            let add = [];
            add.push(api.updateData('Shopcart',{status:1},{
                userId:req.body.userId,
                [config.Op.or]:proData
            },t))

            for(let i = 0; i< proData.length; i++){
                console.log('proData[i].pid ==> ', proData[i].pid);
                add.push((function(i){
                    api.createData('Orders',{
                        oid:orderId,
                        pid:proData[i].pid,
                        // pname:
                    },(t))
                })(i))
            }

            return Promise.all(add); // ***sequlize中transaction的使用方法
        }).then( v =>{
            console.log('事务处理 v=>',v);
            //事务处理成功 (config中添加配置)
            res.send({msg:config.sceneValues.transaction.success.msg, statue
            :config.sceneValues.transaction.success.code});
        }).catch(err=>{
            res.send({msg:config.sceneValues.transaction.fail.msg, statue
                :config.sceneValues.transaction.fail.code});
        })
    }

    // 客户端
    user(req,res){ 
        console.log('查询客户端用户req.query=>',req.query);

        // INNER JOIN 多表查询  (暂时先用购物车那边的数据来规定登录的用户，之后修改为购买商品成功的数据)
        let sql = 'SELECT `u`.`phone`, `u`.`nickname` FROM `user` AS `u` INNER JOIN  `shopcart` AS `s` ON `u`.`user_id` = `s`.`user_id`';

        api.queryData(sql,{
            phone:req.query.email
        
        }).then( result =>{

            res.send({msg: config.sceneValues.findData.success.msg, status: config.sceneValues.findData.success.code,data: result});
        })
        .catch(err =>{
            res.send({msg: config.sceneValues.findData.fail.msg, status: config.sceneValues.findData.fail.code});

        })
    }
    
}

// 导出实例
module.exports = new RouteController();