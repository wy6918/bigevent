//每次调用$.get/$.post/$.ajax的时候，都会先调用该函数
$.ajaxPrefilter(function(options){
    // 再该函数里，我们可以拿到给ajax配置的对象
    // console.log(opt.url);
    // 统一拼接根路径
     // 'http://big-event-api-t.itheima.net' 备用接口
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url);
    // 统一为有限接口 设置headers请求头
    // 如果找到该字符，则为 value 的索引位置；否则如果未找到，则为 -1。
if(options.url.indexOf('/my') !== -1){
    options.headers = {
        Authorization:localStorage.getItem('token') || ''
    }
}
//全局统一挂载complete回调函数
options.complete = function(res){
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        // 强制清空token
        localStorage.removeItem('token')
        // 强制跳转回登录页面
        location.href='./login.html'
    }
}

})