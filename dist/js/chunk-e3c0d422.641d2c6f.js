(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e3c0d422"],{"101e":function(t,i,a){t.exports=a.p+"img/bg2.cbaca807.jpg"},"26d9":function(t,i,a){t.exports=a.p+"img/limited2.0e8252ff.png"},3132:function(t,i,a){var s=a("d68d"),e=a("a8c9"),c=a("57c4"),r=c("species");t.exports=function(t,i){var a;return e(t)&&(a=t.constructor,"function"!=typeof a||a!==Array&&!e(a.prototype)?s(a)&&(a=a[r],null===a&&(a=void 0)):a=void 0),new(void 0===a?Array:a)(0===i?0:i)}},"3d3d":function(t,i,a){t.exports=a.p+"img/bg4.2a73b329.jpg"},6674:function(t,i,a){t.exports=a.p+"img/bg3.dfbd779a.jpg"},"6a34":function(t,i,a){},"7ae7":function(t,i,a){"use strict";var s=a("91fe"),e=a("f30e"),c=a("a8c9"),r=a("d68d"),n=a("ee6f"),l=a("684e"),o=a("01d7"),d=a("3132"),p=a("b1a1"),u=a("57c4"),f=a("bf98"),m=u("isConcatSpreadable"),v=9007199254740991,g="Maximum allowed index exceeded",C=f>=51||!e((function(){var t=[];return t[m]=!1,t.concat()[0]!==t})),h=p("concat"),_=function(t){if(!r(t))return!1;var i=t[m];return void 0!==i?!!i:c(t)},x=!C||!h;s({target:"Array",proto:!0,forced:x},{concat:function(t){var i,a,s,e,c,r=n(this),p=d(r,0),u=0;for(i=-1,s=arguments.length;i<s;i++)if(c=-1===i?r:arguments[i],_(c)){if(e=l(c.length),u+e>v)throw TypeError(g);for(a=0;a<e;a++,u++)a in c&&o(p,u,c[a])}else{if(u>=v)throw TypeError(g);o(p,u++,c)}return p.length=u,p}})},"7b56":function(t,i,a){t.exports=a.p+"img/limited3.39aa8d99.png"},9970:function(t,i,a){t.exports=a.p+"img/bg1.3a1a830a.jpg"},b975:function(t,i,a){t.exports=a.p+"img/limited4.1205eceb.png"},bb51:function(t,i,a){"use strict";a.r(i);var s=function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"home"},[s("header",[s("van-search",{attrs:{shape:"round",placeholder:"请输入店铺或零食名称"}})],1),s("div",{staticClass:"homebox"},[s("div",{staticClass:"slide"},[s("van-swipe",{attrs:{autoplay:3e3,"indicator-color":"white"}},[s("van-swipe-item",[s("div",[s("img",{staticClass:"autoimg",attrs:{src:a("101e"),alt:""}})])]),s("van-swipe-item",[s("div",[s("img",{staticClass:"autoimg",attrs:{src:a("3d3d"),alt:""}})])]),s("van-swipe-item",[s("div",[s("img",{staticClass:"autoimg",attrs:{src:a("6674"),alt:""}})])]),s("van-swipe-item",[s("div",[s("img",{staticClass:"autoimg",attrs:{src:a("9970"),alt:""}})])])],1)],1),t._m(0),s("div",{staticClass:"homelist"},[s("div",{staticClass:"limited"},[t._m(1),s("div",{staticClass:"list"},[s("div",{staticClass:"limitedlist clearfix"},t._l(t.limitedData,(function(i,a){return s("div",{key:a,staticClass:"item fl",on:{click:function(a){return t.previewProDetail(i.pid)}}},[s("div",[s("img",{staticClass:"autoimg",attrs:{src:i.img,alt:""}})]),s("div",{staticClass:"two-txt pro-title"},[t._v(t._s(i.title))]),s("div",{staticClass:"price"},[t._v("¥"+t._s(i.price))])])})),0)])]),s("div",{staticClass:"recommend clearfix"},[t._m(2),s("div",{staticClass:"list clearfix"},t._l(t.proDatas,(function(i,a){return s("div",{key:a,staticClass:"col-box fl",on:{click:function(a){return t.previewProDetail(i.pid)}}},[s("div",{staticClass:"col-item"},[s("div",{staticClass:"img"},[s("img",{staticClass:"autoimg",attrs:{src:t.imgBaseUrl+i.pimg,alt:""}})]),s("div",{staticClass:"two-txt pro-title"},[t._v(t._s(i.pname))]),s("div",{staticClass:"price"},[t._v("¥"+t._s(i.pPrice))])])])})),0)])])])])},e=[function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("nav",[a("ul",{staticClass:"clearfix"},[a("li",[a("div",{staticClass:"icon"},[a("i",{staticClass:"new"})]),a("span",[t._v("每日上新")])]),a("li",[a("div",{staticClass:"icon"},[a("i",{staticClass:"hot"})]),a("span",[t._v("人气推荐")])]),a("li",[a("div",{staticClass:"icon"},[a("i",{staticClass:"market"})]),a("span",[t._v("橙子超市")])]),a("li",[a("div",{staticClass:"icon"},[a("i",{staticClass:"fruit"})]),a("span",[t._v("水果")])])])])},function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"title clearfix"},[a("span",{staticClass:"fl"},[t._v("限时特购")]),a("span",{staticClass:"fr"},[t._v("更多 "),a("i")])])},function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"title clearfix"},[a("span",{staticClass:"fl"},[t._v("精选推荐")]),a("span",{staticClass:"fr"},[t._v("更多 "),a("i")])])}],c=(a("7ae7"),{name:"home",data:function(){return{proDatas:[],imgBaseUrl:"http://127.0.0.1:10008/assets/",limitedData:[{title:"百颗全蔬360g】综合果蔬菜脆 水果干混合装网红零食",img:a("d700"),price:59,pid:"cmXmNM1580568554258"},{title:"风干牛肉干50g】内蒙古特产年货手撕牛肉休闲小吃",img:a("26d9"),price:29,pid:"gDrCK71580568687579"},{title:"德芙礼盒装丝滑牛奶纯黑白夹心3碗排块送女友小零食喜糖果",img:a("7b56"),price:14,pid:"ISLoDB1580568785381"},{title:"雪芙蕾蛋糕1000g整箱】营养早餐网红糕点小面包",img:a("b975"),price:16,pid:"mhYFMQ1580568838312"},{title:"猪肉脯100g】麻辣零食熟食风干靖江特产小吃肉干",img:a("f052"),price:9,pid:"URDHHr1580568898228"}]}},created:function(){var t=this;this.axios({method:"GET",url:"/appProduct"}).then((function(i){4e3==i.data.status&&(t.proDatas=i.data.data.rows.concat())})).catch((function(t){}))},methods:{previewProDetail:function(t){this.$router.push({name:"detail",params:{id:t}})}}}),r=c,n=(a("d2f3"),a("5511")),l=Object(n["a"])(r,s,e,!1,null,"0fc7990d",null);i["default"]=l.exports},d2f3:function(t,i,a){"use strict";var s=a("6a34"),e=a.n(s);e.a},d700:function(t,i,a){t.exports=a.p+"img/limited1.8f81d0b0.png"},f052:function(t,i,a){t.exports=a.p+"img/limited5.3870b0ed.png"}}]);
//# sourceMappingURL=chunk-e3c0d422.641d2c6f.js.map