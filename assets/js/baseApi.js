//每次调用$.get/$.post/$.ajax的时候，都会先调用该函数
$.ajaxPrefilter(function(options){
    // 再该函数里，我们可以拿到给ajax配置的对象
    // console.log(opt.url);
    // 统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url);
})