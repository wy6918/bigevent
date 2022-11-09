$(function(){
    getUserInfo()
    // 点击按钮 退出
    let layer = layui.layer
    $('#btnLogin').on('click',function(){
        // console.log('ok');
        // 提示用户是否退出
        layer.confirm('是否退出登录', {icon: 3, title:'提示'}, function(index){
            // 清空locolstroage里的token
            localStorage.removeItem('token')
            // 跳转回登录页面
            location.href='./login.html'
            // 关闭提示框
            layer.close(index);
          });
    })
})
   // 获取用户的基本信息
   function getUserInfo(){
    $.ajax({
        method:"GET",
        url:"/my/userinfo",
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
        // console.log(res);
        if(res.status !== 0){
            return layer.msg('获取用户信息失败')
        }
        // 获取用户头像的信息
        renderAvatar(res.data)
        },
        // 防止有人直接跳过登录，进入后台页面
        //无论成功or失败都会调用complete
        // complete:function(res){
        //     // console.log(res);
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转回登录页面
        //         location.href='./login.html'
        //     }
        // }
    })
 
}
        // 获取用户头像的信息
function renderAvatar(data){
    // 获取用户名
let name = data.nickname || data.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 按需渲染用户头像
    if(data.user_pic !== null){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',data.user_pic).show()
        $('.text-avatar').hide()
    }else{
        // 渲染文字头像
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}