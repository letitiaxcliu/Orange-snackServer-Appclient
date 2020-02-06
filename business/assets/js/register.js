$(function(){

    // let requestUrl = 'http://192.168.53.78:10008';
    let requestUrl = 'http://127.0.0.1:10008';

    //注册验证配置
    let configValid = {
        username:{
            required: true,
            reg: /^[\w\u4e00-\u9fa5]{3,8}$/,
            errMsg:'汉字字母数字下划线组合且长度为3-8个字符'
        },

        email:{
            required:true,
            reg:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            errMsg:'邮箱格式不正确'
        },

        pwd:{
            required:true,
            reg: /^(?=.*[a-z])\w{6,16}$/,
            errMsg:'6-16至少含有一个小写字母以及数字'
        },

        repwd:{
            isEqual: true, //是否验证两值相等
            value: '',
            required:true,
            // reg: /^(?=.*[a-z])\w{6,16}$/,
            errMsg:'两次密码不一致'
        },
    }

    // 获取验证码
    let time = 30; //30秒后重新获取
    $('#getcode').on('click',function(){

        let self = this;
        // 获取邮箱
        let email = $('#email').val();

        // 获取文本内容
        $(this).text(time + 's').prop('disabled',true);
        let timer = setInterval(function(){
            time --;
            if(time < 0){
                clearInterval(timer);
                timer = null;
                $(self).text('获取验证码').prop('disabled',false);
                time = 30;
                return;
            }
            $(self).text(time + 's');
        },1000)
        
        // 请求服务器发送邮件
        $.ajax({
          type: 'POST',
          url: requestUrl + '/sendEmail',
          data: {
            email: email
          },
          success: function (data) {
            // console.log('data ==> ', data);

            // 修改了页面获取登录跳转到首页，并将首页的用户名替换为登录邮箱用户，之后设置token时间
            if(data.status = 4000){ //res.send({msg: '邮箱验证码已发送至您的邮箱', status: 4000, __ctk: cod
                //发送成功
                //设置cookie过期时间
                let expires = new Date().getTime() + data.time * 1000; //设置cookie过期时间
                     
                expires = new Date(expires).toUTCString(); //将时间转换为格林威治时间
    
                // 将token保存在cookie中 (拼凑)
                document.cookie = data.__ctk.key + '=' + data.__ctk.ctk + ';expires=' + expires;
                // Application中的Cookies下查看是否存在 Yes  在server的index.js跨域请求配置中设置    
                //该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可
                // res.header('Access-Control-Allow-Credentials', true);  
                // 前端的注册页面发起ajax请求

            }else{
                // console.log(data.msg); //res.send({msg: '获取验证码失败', status: 4001});的msg
            }
          }
        })
    })

    // 注册
    $('#register').on('click',function(){

        let pwd = $('#pwd').val();
        // let code = 255812; 

        configValid.repwd.value = pwd;
        // configValid.code.value = code;

        // 调用validForm.js下的validForm.valid方法
        let result = validForm.valid(configValid);
        // console.log('result=>',result);

        // 发起post请求（注册）
        if(result.isValid){
            // 发起post请求（注册）
            delete result.data.repwd;
            
            // 拦截之后操作code
            //获取用户输入的验证码
            result.data.code = $('#code').val(); 
           
            //判断验证码的token验证
            result.data.key = 'code'; // 到路由控制下的token验证

            $.ajax({
                type: 'POST',
                url: requestUrl + '/register',
                data: result.data,

                // 前端的注册页面发起ajax请求  修改list.js中请求
                // 跨域携带cookie 
                xhrFields: {
                    withCredentials: true
                },

                success: function (data) {
                    // console.log('register data ==> ', data);

                    if(data.status == 1000){ //res.send({msg: '注册成功', status: 1000});的status
                        // console.log(data.msg);
                        // 发送成功之后注册页成功就跳转login页面
                        location.href = '/login';   //'/login'对应好路由route.js路径
                    }else if(data.status == 1001 || data.status == 1002){
                        // console.log(data.msg);
                    }
                }
            })
        }
    })

    // vliadToken(req, res, next){部分结束 ？？？？（所以为什么要把验证配置中的验证码处处理掉？？）：当验证码过去时，点击注册没有报错和显示验证码不对之类的信息， }
})