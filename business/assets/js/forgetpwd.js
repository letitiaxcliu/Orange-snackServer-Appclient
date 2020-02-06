$(function(){
    // 基础路径
    let requestUrl = 'http://127.0.0.1:10008'; //安全退出之后

    //注册验证配置
    let configValid = {
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

        repwd:{
            isEqual: true, //是否验证两值相等
            value: '',
            required:true,
            // reg: /^(?=.*[a-z])\w{6,16}$/,
            errMsg:'两次密码不一致'
        },
        // code:{
        //     isEqual: true,
        //     value: '',
        //     required: true,
        //     errMsg: '验证不正确'
        // }
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
        
        // 请求服务器发送邮件 (忘记密码去到server控制器层修改密码获取邮箱验证码)
        $.ajax({
          type: 'POST',
          url: requestUrl + '/forgetPwd',
          data: {
            email: email
          },
          success: function (data) {
            // console.log('data ==> ', data);

            if (data.status = 4000) { //res.send({msg: '邮箱验证码已发送至您的邮箱', status: 4000, __ctk: cod
                //发送成功

                let expires = new Date().getTime() + data.time * 1000; //设置cookie过期时间
                
                expires = new Date(expires).toUTCString(); //将时间转换为格林威治时间
      
                // 将token保存在cookie中 (拼凑)
                document.cookie = data.__ctk.key + '=' + data.__ctk.ctk + ';expires=' + expires;
      
              } else if (data.status == 1003 || data.status == 4001) {
                // console.log(data.msg);  //res.send({msg: '获取验证码失败', status: 4001});的msg
              }
            }
        })
    })

    // 提交注册
    $('#commit').on('click',function(){

        let pwd = $('#pwd').val();
        let code = 255812; 

        configValid.repwd.value = pwd;

        // 调用validForm.js下的validForm.valid方法
        let result = validForm.valid(configValid);
        // console.log('result ==> ', result);

        if (result.isValid) {
            delete result.data.repwd;

            result.data.key = 'code';
            result.data.code = $('#code').val();

            $.ajax({
                type: 'POST',
                url: requestUrl + '/modifyPwd',
                data: result.data,
                xhrFields: {
                  withCredentials: true
                },
                success: function (data) {
                  // console.log('data ==> ', data);
                  // 并在在list里添加路径   _ 上传图片服务器
                }
            })
        }
    })
})