$(function(){

    // let requestUrl = 'http://192.168.53.78:10008';
    let requestUrl = 'http://127.0.0.1:10008';
    

    // 登录验证配置
    let configValid = {
        // username:{
        //     required: true,
        //     reg: /^[\w\u4e00-\u9fa5]{3,8}$/,
        //     errMsg:'用户支持汉字字母数字下划线组合且长度为3-8个字符'
        // },

        email:{
            required:true,
            reg:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            errMsg:'邮箱格式不正确'
        },

        pwd:{
            required:true,
            reg: /^(?=.*[a-z])\w{6,16}$/,
            errMsg:'密码支持至少含有一个小写字母以及数字下划线组合长度为6-16个字符'
        },
    };

    // 搭通了register这里类似，就是调用方法，模块等等主要就是route_controller.js和route.js
    // 登录 
    $('#login').on('click',function(){
        let result = validForm.valid(configValid);
        // console.log('result=>',result);

        // 验证通过
        if(result.isValid){

            // 发起post请求（3） 请求用POST 一般查商品数据GET请求
            $.ajax({
                type:'POST',
                url: requestUrl + '/login',  //这里就要关联好route。js中的路径了
                data:result.data,
                success:function(data){
                    // console.log('login data =>',data);

                    // 修改密码成功修复登录bug  添加 验证条件将其设置cookie等放入
                    if (data.status == 2000) {
                    
                        // 后台验证登录成功保存token
                        //使用cookie保存token凭证，用于登录验证
                        let time = new Date().getTime() + data.time *24 *60 *60 *1000;//时间戳转为毫秒

                        time = new Date(time).toUTCString();
                        // console.log('time=>',time);

                        // 设置cookie
                        document.cookie = data.__utk.key + '=' + data.__utk.utk + ';expires=' + time;

                        location.href = '/'; // 登录成功跳转
                        
                        // !!!!!!不要试图不刷新就想不报一致报错的地方，记得数据库工具那里也要刷新
                    }else{
                        // console.log(data.msg);
                    }
                }
            })
        }
    })
})