$(function(){

    // let requestUrl = 'http://192.168.53.78:10008';
    let requestUrl = 'http://127.0.0.1:10008';

    // 后台登录成功跳转进来首页，会携带cookie
    //登录身份验证
    // 将cookie转为普通对象  (同server后台的utils中的方法)
    function transformCookieObject(value){
        if(value){
            let cookieObject = {};
            value = value.split(/; /);

            for(let i = 0; i < value.length; i++){
                let v = value[i].split('='); //按照等号切割
                cookieObject[v[0]] = v[1];
            }
            return cookieObject;
        }
        return null;
    }

    //获取cookie的token
    let cookieData = transformCookieObject(document.cookie);
    // console.log('cookieData ==> ', cookieData);

    //进行身份验证
    $.ajax({
        type:'POST',
        url: requestUrl + '/business',
        data:{
            key: 'default'
        },

        //跨域携带cookie
        xhrFields:{
            withCredentials:true
        },
        success:function(data){
            // console.log('data=>',data);
            // business(req,res){ }查询数据后到ejs给页面用户名一个id标记id="user_name"
            
            if(data.status == 4000){
                $('#user_name').text(data.data.userName); 
            }else{
                location.href = '/login';
            }
        }
    })


    let eleName = ''; //标记
    let count = 2; //每页查询的数据的条目
    let currentPageCode = 0; //设置当前页码默认是0

    $('#list-group').on('click','li',function(){
        
        if ($(this).hasClass('active')) {
            return;
        }
        $(this).addClass('active').siblings().removeClass('active');

        let title = $(this).parent().data('title');
        let subtitle = $(this).data('subtitle');    

        let lis = $('#breadcrumb').find('li');
        // 只保留一个如果对于两个就删除最后一个（不能重复点击已经实现）
        if(lis.length>=2){
            lis.last().remove();
        }
        lis.eq(0).text(title).end().end().append('<li class="breadcrumb-item">' + subtitle + '</li>');

        if(eleName !=''){
            $('.' + eleName).hide();
        } 

        eleName = $(this).attr('name');

        // 商家上传数据表生成之后要在每个小副标题小区分是点击哪个，因为商品列表页需要生成表格 —— 确定了再显示
        // 利用eleName = $(this).attr('name');标记来确定选择了哪一个 （拿取类名）
        if(eleName == 'addproducts'){

            // 添加商品  —— 回到后台路由控制器与路由写接口
            $.ajax({
                type:'GET', //商品数据一般用GET请求
                url: requestUrl + '/protype',
                data:{
                    key:'default' //需要验证登录所以要用key来标记
                },
                xhrFields:{
                    withCredentials:true
                },
                success:function(data){
                    // console.log('addproducts 商家上传data=>',data);

                    // 绑定数据 —— ejs页面的选择商品类型数据可以删除 —— 通过遍历id#addpro_type来生成
                    if(data.status == 4000){
                        
                        // 每次点击两个切换要把之前的清除掉否则会叠加  找到不含有option标签下value="default"]删除记录
                        //将其他分类的option删除
                        $('#addpro_type').find('option:not([value="default"])').remove();

                        data.data.forEach(v => {
                            let option = $(`<option value="${v.protypeId}">${v.protypeTitle}</option>`); //es6生成方式
                            $('#addpro_type').append(option); //追加到#addpro_type里面去
                        });
                    }else{
                        // console.log(data.msg);
                    }
                    // 利用商品protypeId就能知道获取商品信息 —— 先不要每次上传都保存数据，到路由控制下拦截uploadProductData
                }
            })
        }else if(eleName == 'editproducts'){
            // 路由控制器与路由写接口 —— 编辑商品  —— 路由控制器与路由继续写方法
            getPaginationData(0,1); //传个0先  (0,1) = (偏移，当前页)
        }

        $('.' + eleName).show();
    })

    // 分页查询 封装方法
    // 分页查询 请求
    function getPaginationData(offset,pageCode){
        // 分页查询
        $.ajax({
            type:'GET', //商品数据一般用GET请求
            url: requestUrl + '/findProductData',
            data:{
                key:'default', //需要验证登录所以要用key来标记
                offset //就是查询的起始值
            },
            xhrFields:{
                withCredentials:true
            },
            success:function(data){
                // console.log('editproducts商家商品data=>',data); 
                // 绑定数据 —— ejs页面的选择商品类型数据可以删除 —— 通过遍历id#addpro_type来生成
            
                if(data.status == 4000){
                    $('tbody').html(''); //进来清空不叠加
                    // 查询总页数
                    let pageCount = Math.ceil(data.data.count / count); //分多少页 页数向上取整
                    $('#pagecount').text(pageCount); // 放进页展示总页数
                
                    //设置页码
                    $('#page').text(pageCode);
                    currentPageCode = pageCode;

                    //生成商品数据 (ctrl + c)
                    for(let i = 0; i < data.data.result.length; i++){
                        let d = data.data.result[i];
                        let $tr = $(`<tr>
                        <td><input type="checkbox"></td>
                        <td>${i+1}</td>
                        <td>
                          <div class="img-box">
                            <img class="autoimg" src="${requestUrl + '/assets/' + d.pimg}" alt="">
                          </div>
                        </td>
                        <td>${d.pid}</td>
                        <td>${d.pname}</td>
                        <td>${d.p_price}</td>
                        <td>${d.vip_price}</td>
                        <td>${d.is_vip == 0 ? 'No' : 'Yes'}</td>
                        <td>${d.protype_title}</td>
                        <td>${d.pcount}</td>
                        <td>${d.created_at}</td>
                        <td>
                          <button data-id="${d.pid}" type="button" class="btn btn-success btn-sm">查看</button>
                          <button data-id="${d.pid}" type="button" class="btn btn-dark btn-sm">编辑</button>
                          <button data-id="${d.pid}" type="button" class="btn disableBtn btn-warning btn-sm ${d.is_use == 0 ? 'hide' : ''}">禁用</button>
                          <button data-id="${d.pid}" type="button" class="btn enableBtn btn-info btn-sm ${d.is_use == 1 ? 'hide' : ''}">启用</button>
                          <button data-id="${d.pid}" type="button" class="btn delBtn btn-danger btn-sm">删除</button>
                        </td>
                      </tr>
                        `);
                        // 添加类名hide在css上，用于警用和启用两个按钮的显示与隐藏
                        $('tbody').append($tr);
                    }
                }else{
                    // console.log(data.msg);
                }
            }
        })
    }

    // 分页查询 绑定
    $('.pli').on('click',function(){
        // 只给上下页给图书类pli做绑定事件
        // 获取当前的li的id
        let id = $(this).attr('id');

        // 获取总页数
        let pageCount = $('#pagecount').text();
        // console.log('pageCount=>',pageCount);

        // 上一页
        if(id == 'prev'){
            if(currentPageCode == 1){
                return; //拦截
            }
            getPaginationData((currentPageCode - 2) * count, --currentPageCode);

        }else{
            // 下一页
            if(currentPageCode == pageCount){
                return; //最会一页拦截
            }
            // let code = currentPageCode;
            // currentPageCode ++; // 累加页码
            getPaginationData(currentPageCode * count, ++currentPageCode);
        }
        // console.log('currentPageCode=>',currentPageCode);

    })


    // let configValid = {正则判断} 
    let configValid = {
        // addpro_name表单控件name名
        
        'addpro_type':{
            // required:true, //声明 必填
            // reg: /^((0)|([1-9]\d*))$/, //正则表达式
            errMsg:'请选择商品类型',
        },

        'addpro_name':{
                required:true, //声明 必填
                reg:/^(?!.*[<>]).{1,30}$/, //正则表达式
                errMsg:'商品必填不能含有<>且字符长度为1-30', //验证不通过显示提示
        },

        'addpro_price':{
                required:true, //声明必填
                reg:/^([1-9]\d*|0)(\.(\d{2}))?$/, //保留两位小数正整数   
                errMsg:'数字且允许至多2位小数', 
        },

        'addpro_vipprice':{
            required:false, //声明必填
            reg:/^([1-9]\d*|0)(\.(\d{2}))?$/, //保留两位小数正整数   
            errMsg:'数字且允许至多2位小数', 
        },

        'addpro_detail':{
                required:true, //声明 必填
                reg:/^(?!.*[<>]).{1,180}$/, //正则表达式
                errMsg:'商品必填不能含有<>且字符长度为1-180',
        },

        'addpro_count':{
                required:true, //声明 必填
                reg: /^((0)|([1-9]\d*))$/, //正则表达式
                errMsg:'库存量请输入整数',
        },

        'addpro_img':{
            required:true, //声明 必填
            // reg: /^((0)|([1-9]\d*))$/, //正则表达式
            errMsg:'请上传商品图片',
        }
       
    }


    // 提交上传数据
    // 发送ajax请求
    
    //声明一个变量用来保存图片类型
    let imgType = '';  //用来关联后台，获取数据 图片上传时imgType = type; //记录图片类型 并发送ajax前也标记好

    let serverBase64Img = ''; //后台服务器写入图片的base64码
    $('#commit').on('click',function(){
        let result = validForm.valid(configValid);
        // console.log('result=>',result);
        
        if(result.isValid){
            // console.log('商品-请求ajax');

            //不需要传入的数据在之前delete掉就不会发送过去
            delete result.data['addpro_img'];
            result.data.serverBase64Img = serverBase64Img; //后台显示长度太大，先暂时关闭
            // console.log('result.data ==> ', result.data);
             
            result.data.key = 'default';  //后台验证登录验证标识  请求ajax测试成功 给一个标记查 看是登录验证 ，并在list里添加/uploadProductData路径
            
            result.data.imgType = imgType; //图片类型
            result.data['product-vip'] = result.data['addpro_vipprice'] == '' ? 0:1; // 是否开启VIP价格
            
            // 继续添加其他数据要求
            result.data['addpro_vipprice'] = Number( result.data['addpro_vipprice']).toFixed(2);
            result.data['addpro_price'] = Number( result.data['addpro_price']).toFixed(2);
            result.data['addpro_count'] = Number( result.data['addpro_count']);

            // console.log('result.data ==> ', result.data);

            // 后台uploadProductData搭建好之后，请求ajax测试是否输出结果
            // 发起ajax post 请求
            $.ajax({
                type: 'POST',
                url: requestUrl + '/uploadProductData',
                data: result.data,
                // 携带cookie
                xhrFields: { 
                    withCredentials: true
                },
                success: function (data) {
                    // console.log('data ==> ', data);
                    
                    //未登录
                    if(data.status == 2001) {
                      location.href = '/login';
                    }
                }
            })
            // 提交成功，重新控制上传图片的大小
        }

        // else{
        // console.log('表单验证不通过');
        // }
    })

    // 开启会员价格
    $('#open_vip').on('change',function(){
        let isChecked = $(this).prop('checked');//监听选框状态
        $('#addpro_vipprice').prop('disabled', !isChecked); //状态取反

        configValid['addpro_vipprice'].required = isChecked;

        if(!isChecked){
            $('#addpro_vipprice').val(''); //false就让会员价格为空
        }

    })

    // 图片上传
    $('#upload').on('change',function(){
        let file = $(this)[0].files[0]; //获取一张图片信息
        // console.log('file=>',file);

        // 图片转为base64
        // 图片类型jpg,jpeg,png,webp
        let types = ['jpg','jpeg','png','webp','gif'];
        let type = file.type.split('/')[1]; //根据获取到的图片的数据格式切割所需部分
        
        // 上传图片符合类型，>-1找到这个类型
        if(types.indexOf(type) > -1){
            // 图片大小限制
            let size = 1000 *1024;
            if(file.size >size){
                // console.log('上传图片大小不能超过1M');
                return;
            }

            // !!!!
            //创建读取对象文件对象
            let reader = new FileReader();

            // 读取文件
            reader.readAsDataURL(file);
            reader.onload = function(e){
                //获取读取图片base64码
                let base64 = e.target.result;
                // console.log('base64=>',base64);

                //保存后台服务器 
                serverBase64Img = base64.replace(/^data:image\/[A-Za-z]+;base64,/, ''); //不要部分替换为空
                // console.log('serverBase64Img=>',serverBase64Img); 

                //创建图片对象
                let image = $(`<img class="autoimg" src="${base64}" />`);
                
                // 图片没有加载完成不会显示所以 (要绑定事件，以及放入放前面 ，不然拿不到图片宽高就有0,0出现)
                $('#preview_img').html('').append(image); //放入之前想让.html('')为空

                // 当图片加载完成时
                image.on('load',function(){
                    // 将登录注册忘记密码首页打通， 上传图片与服务
                    // console.log('image=>',image[0]); //base64
                    // 获取图片的原始尺寸naturalWidth/naturalHeigh 属性
                    let naturalW =   image[0].naturalWidth;
                    let naturalH = image[0].naturalHeight;
                    // console.log('naturalW,naturalH=>',naturalW,naturalH); //base64

                    // 控制图片的宽高 —— 图片必须宽高大于400px
                    if(naturalH == naturalW && naturalW >=300){
                    
                        $('.previewbox').show();

                        imgType = type; //记录图片类型
                    }else{
                        // console.log('图片尺寸不合适');
                        //清空上传文件控件的值
                        $('#upload').val('');
                        $('#preview_img').html('');
                    }

                    // 去路由控制器设置商家接口
                })
            }
        }else{
            $(this).val('');
        }
    })

    // 退出 (设置cookie时间位于当前时间之前就可以删除cookie)
    $('#signout').on('click',function(){
        // console.log('退出');
        let expires = new Date('1970-01-01 00:00:00').toUTCString(); //格林威治 
        
        //删除登录凭证
        document.cookie = 'utk=;expires=' + expires;
        location.href = '/login';
    })

    // 禁用编辑商品 （因为是创建的元素需要 为未来节点绑定事件） —— 添加类名 disableBtn 和 enableBtn
    $('tbody').on('click','.disableBtn',function(){
        // console.log('点击禁用启用');

        let self = this;

        let pid = $(this).data('id'); //获取商品id 给一个data-id="${d.pid}"
        $.ajax({
            type: 'POST',
            url: requestUrl + '/disabledProData',
            data: {
              key: 'default',
              pid
            },
            xhrFields: {
                withCredentials: true
            },
            success:function(data){
                if (data.status == 9000) {
                    $(self).hide();
                    $(self).parents('tr').find('.enableBtn').show();
                    // console.log('禁用商品_data=>',data);

                } else {
                    // console.log('禁用商品_data=>',data);
                }
            }
        })
    })

    $('tbody').on('click','.delBtn',function(){
        // console.log('点击删除');
        let pid = $(this).data('id'); //获取商品id 给一个data-id="${d.pid}"
        $.ajax({
            type: 'POST',
            url: requestUrl + '/delProductData',
            data: {
              key: 'default',
              pid
            },
            xhrFields: {
                withCredentials: true
            },
            success:function(data){
                // console.log('删除商品_data=>',data);
            }
        })
    })
})