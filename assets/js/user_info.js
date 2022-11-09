$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称字符必须在0~6之间'
            }
        }
    })
    // 初始化用户的基本信息
    initUserInfo()


    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
             // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功');
                // 在提交的同时改变index中的文本头像
                // iframes的子页面和index的页面隔了一个iframes页面
                // window在这表示iframes所代表的这个窗口
                // window.parent说明 window.parent能获取一个框架的父窗口或父框架。顶层窗口的parent引用的是它本身. 
                window.parent.getUserInfo()
            }
        })
    })
})