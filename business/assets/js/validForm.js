let validForm = {
    query:function(selector){
        return document.querySelector(selector);
    },

    addErrMsg:function(element,errMsg){
        element.classList.add('is-invalid');
        let node = element.nextSibling;

        //如果下一个节点是文本节点 
        if(node.nodeType == 3){
            node = node.nextSibling;
        }
        // console.log('node=>',node); //node=> #text
        node.textContent = errMsg;
    },

    // 验证表单方法 验证通过true反之false
    valid: function(o){

        let data = {}; //声明一个对象用于返回后台需要的数据
        for(let key in o){
            // console.log('key=>',key);

            // 验证控件元素
            let element = this.query('[name="' + key + '"]');
            // console.log('element=>',element);

            let value = element.value;
            // console.log('value=>',value);

            if(element.nodeName == 'SELECT' && value == 'default'){
                this.addErrMsg(element,o[key].errMsg);
                continue;
            }

            // 数值为空
            if(o[key].required){
                if(value == ''){
                    // console.log('空 ==> ', o[key].errMsg);
                    this.addErrMsg(element,o[key].errMsg);
                    continue;
                }
            }

            // 验证注册页面两次密码是否一致
            if(o[key].isEqual){
                if(value != o[key].value){
                    this.addErrMsg(element,o[key].errMsg);
                    continue;
                }
            }

            //如果存在正则，需要使用正则验证
            if(o[key].reg){
                //如果验证不通过
                if (!o[key].reg.test(value) && value != '') {
                    // console.log('正则 ==> ', o[key].errMsg);
                    this.addErrMsg(element,o[key].errMsg);
                    continue;
                }
            }
            
            data[key] = value;
            
            element.classList.remove('is-invalid'); //如果当前表单控件通过 移除类名
        }

        // 获取含有is-invalid类名的元素
        let isInValid = this.query('.is-invalid');
        if(isInValid){
            return {isValid: false};
        }
        return{
            isValid: true,
            data
        }
    }
}
