(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0e897cc6"],{"34f4":function(t,e,s){"use strict";s.d(e,"a",(function(){return o}));var n=s("5e1d"),a=s("db4b"),i=function(){function t(){Object(n["a"])(this,t),this.phoneReg=/^1[3456789]\d{9}$/,this.pwdReg=/^(?=.*[a-z])\w{6,16}$/}return Object(a["a"])(t,[{key:"isPhone",value:function(t){return this.phoneReg.test(t)}},{key:"isPwd",value:function(t){return this.pwdReg.test(t)}}]),t}(),o=new i},"4e18":function(t,e,s){},9652:function(t,e,s){"use strict";var n=s("4e18"),a=s.n(n);a.a},a55b:function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"login"},[s("header",[s("div",{staticClass:"register",on:{click:function(e){return t.changepage({name:"register"})}}},[t._v("注册")])]),s("div",{staticClass:"loginbox"},[s("div",{staticClass:"title"},[t._v("快捷登录")]),s("div",{staticClass:"form-box"},[s("div",{staticClass:"input phoneinp"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.user.phone,expression:"user.phone"}],staticClass:"inptext",attrs:{type:"text",placeholder:"请输入手机号码"},domProps:{value:t.user.phone},on:{input:function(e){e.target.composing||t.$set(t.user,"phone",e.target.value)}}})]),s("div",{staticClass:"codeinp clearfix"},[s("div",{staticClass:"fl input code-input"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.user.code,expression:"user.code"}],staticClass:"inptext",attrs:{type:"text",placeholder:"验证码"},domProps:{value:t.user.code},on:{input:function(e){e.target.composing||t.$set(t.user,"code",e.target.value)}}})]),s("div",{staticClass:"fl code-btn",on:{click:t.getCode}},[t._v(t._s(t.codeContent.txt))])]),s("div",{staticClass:"login-btn",on:{click:t.login}},[t._v("登录")]),s("div",{staticClass:"subtitle",on:{click:function(e){return t.changepage({name:"pwdlogin"})}}},[t._v("密码登录")])]),t._m(0)])])},a=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"third-part"},[s("div",{staticClass:"subtitle"},[t._v(" ——————— 第三方登录 ———————")]),s("div",{staticClass:"icon clearfix"},[s("span",[s("i",{staticClass:"wechat"})]),s("span",[s("i",{staticClass:"weibo"})]),s("span",[s("i",{staticClass:"qq"})])])])}],i=s("34f4"),o={name:"login",data:function(){return{user:{phone:"",code:""},codeContent:{txt:"获取验证码",time:5}}},methods:{getCode:function(){var t=this;if(i["a"].isPhone(this.user.phone)){this.codeContent.txt=this.codeContent.time+"s后重新获取";var e=setInterval((function(){t.codeContent.time--,-1==t.codeContent.time?(clearInterval(e),e=null,t.codeContent.txt="获取验证码",t.codeContent.time=5):t.codeContent.txt=t.codeContent.time+"s后重新获取"}),1e3);this.axios({method:"GET",url:"/getMessageCode",params:{phone:this.user.phone}}).then((function(e){2e4==e.data.status&&t.$cookies.set(e.data.__ctk.key,e.data.__ctk.ctk,e.data.time)})).catch((function(t){}))}else this.$notify({type:"warning",message:"手机号码格式不正确"})},login:function(){var t=this;this.$toast({duration:0,message:"登录中..."}),this.axios({method:"POST",url:"/appLogin",data:{phone:this.user.phone,key:"code",code:this.user.code,loginType:0}}).then((function(e){t.$toast.clear(),2e3==e.data.status&&t.$cookies.set(e.data.__utk.key,e.data.__utk.utk,24*e.data.time*60*60),t.$notify({type:2e3==e.data.status?"success":"warning",message:e.data.msg,onClose:function(){2e3==e.data.status&&t.$router.push({name:"home"})}})})).catch((function(e){t.$toast.clear()}))},changepage:function(t){this.$router.push(t)}}},c=o,u=(s("9652"),s("5511")),r=Object(u["a"])(c,n,a,!1,null,"4deed4cd",null);e["default"]=r.exports}}]);
//# sourceMappingURL=chunk-0e897cc6.2a4b36d8.js.map