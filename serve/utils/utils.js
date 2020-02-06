// 导入加密模块
let crypto = require('crypto');

let nodemailer = require('nodemailer'); //导入发邮件模块

let jsonwebtoken = require('jsonwebtoken'); //导入jsonwebtoken模块

// 导入阿里云发短信模块
let SMSClient = require('@alicloud/sms-sdk');

let moment = require('moment'); // 导入时间格式化模块

let smsClient = new SMSClient({
    accessKeyId: config.messageOptions.accessKeyId, 
    secretAccessKey: config.messageOptions.secretAccessKey
});

// 创建发邮件实例
let transporter = nodemailer.createTransport({
      
    host: config.emailOptions.host,
    // host: 'smtp.163.com',
    pass: config.emailOptions.pass,
    // port: 25, //发邮件端口

    //授权验证
    auth:{
        user: config.emailOptions.user, //授权用户邮箱地址
        pass: config.emailOptions.pass //授权码
    }
});

// 工具库
class Utils{
    
    //字符串加密
    encodeString(value){
        value = config.saltOptions.pwdSalt + value; //value: 被加密的字符串

        let md5 = crypto.createHash('md5'); //mds5加密方式
        
        md5.update(value); // 加密value

        return md5.digest('hex');
    }

    // 随机验证码
    getValidCode(){
        let codes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let codeString = '';

        for(let i = 0; i< 6; i++){
            let randomIndex = Math.floor(Math.random() * codes.length);
            codeString += codes[randomIndex];
        }
        return codeString;
    }
    
    //发送邮件
    //emails: 接收邮件地址列表，array
    sendEmail(emails,randomCode,fn){
    
        transporter.sendMail({
            from: config.emailOptions.user, //邮件发送地址
            to: emails.join(','), // 邮件接收地址
            
            subject: "邮件验证码", //主题
            text: `验证码：${randomCode}，一切向您索取验证码都是骗子`
        },fn);
    }

    // 生成token前将cookie转换为普通对象
    transformCookieObject(value){
        if(value){
            let cookieObject = {};
            value = value.split(/; /);  
            // !!!!!!  一直在cookieData[tkName] 出现报错和undefind，之星啊的是ctk为空，检查了一天了都，
            // 切割数组有问题split(/; /);要有一个空格，人家后台都输出ctk长得都不一样了，怎么能没有看出来呢，输出的都加引号了，我哪里给过引号
            
            for(let i = 0; i<value.length; i++){
                let v = value[i].split('='); //按照等号切割
                cookieObject[v[0]] = v[1];
            }
            return cookieObject;
        }
        return null;
    }

    //生成token
    getToken(value,salt,time){
        //data: 生成token的数据 /expiresIn: 过期时间 /salt: token加盐
        
        let codeToken = jsonwebtoken.sign({

            //签名数据
            data: value
      
        }, salt, { expiresIn: time });
      
        return codeToken;
    }

    //验证token
    validToken(token, salt, fn) {
        jsonwebtoken.verify(token, salt, fn);
    }

    // 手机发送短信验证码 _ 路由控制发短信
    sendMessage(phones,code){
        //p: 接收短信手机号，类型array

        // let code = this.getValidCode();
        let templateParam = JSON.stringify({code});
        // console.log('手机验证code => ', code);
        // console.log('templateParam => ', templateParam);

        // smsClient.sendSMS({
        //     PhoneNum:p.join(','),
        //     SignName:config.messageOptions.signName,
        //     templateCode:config.messageOptions.templateCode,
        //     templateParam:templateParam
        // })
        let params = {
            PhoneNumbers: phones.join(','),
            SignName: config.messageOptions.signName,
            TemplateCode: config.messageOptions.templateCode,
            TemplateParam: templateParam
          };
        return smsClient.sendSMS(params);
    }

    //在后台server下安装monentjs来格式化时间（各种格式） ——  导入时间格式化模块
    // 格式化时间
    formatDate(dateString, format) {
        return moment(dateString).format(format);
    }
}

module.exports = new Utils();