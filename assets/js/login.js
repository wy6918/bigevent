$(function(){
    // 点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.reg-box').show()
        $('.login-box').hide()
    })
//    点击去登录的链接
$('#link-login').on('click',function(){
    $('.reg-box').hide()
    $('.login-box').show()
})
// 从layui中获取form对象
const form = layui.form
const layer = layui.layer
// 通过form.verify()函数自定义效验规则
form.verify({
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
  pwd: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ],
  //再次确认密码
  repwd:function(value){
// 通过形参value拿到再次确认密码框里的值
// 拿到密码框的值
let pwd = $('.reg-box [name=password]').val()
// 两次密码的对比
if(pwd !== value){
    return '两次密码不一致'
}
  }
})
// 注册表单提交信息
$('#form_reg').on('submit',function(e){
    e.preventDefault()
    // console.log(11);
    let data =  { 
        username: $('#form_reg [name=username]').val(), 
        password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser', data, function(res){
        if(res.status !== 0){
          // 注册失败 重置表单
          $("#form_reg")[0].reset();
        //   console.log(res.message); // 用户名被占用，请更换其他用户名！
           return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
    //   //    转到登录 模拟点击
     $('#link-login').click()
    })
})
// 登录 提交
$('#form-login').on('submit',function(e){
    e.preventDefault()
    const data = $(this).serialize()
    // $.post('http://www.liulongbin.top:3007/api/login',data,function(res){
    //     if(res.status !== 0){
    //         return layer.msg('登录失败')
    //     }
    //     console.log(res);
    //     layer.msg('登录成功')
    // })
    $.ajax({
        method:'POST',
        url:'/api/login',
        data:$(this).serialize(),
        success:function(res){
            if(res.status !== 0){
                 // 重置表单
            $("#form-login")[0].reset();
                return layer.msg('登录失败')
            }
            // console.log(res);
            layer.msg('登录成功')
            // 将token的值存储到localstorage
            localStorage.setItem('token',res.token)
          
            // 跳转到index.html页面
            location.href = './index.html'
           
        }
    })
})
})