$(function(){
    let layer = layui.layer

      // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    // aspectRatio的值表示裁剪框的形状 1表示正方形
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)
  $('#fileBtn').hide()
//   监听上传图片事件
$('#btnChooseImage').on('click',function(){
    $('#fileBtn').click()
})

// 获取用户需要上传的照片
$('#fileBtn').on('change',function(e){
    // console.log(e);
    // console.log(11);
    if(e.target.files.length === 0){
        return layer.msg('请选择照片')
    }

    // 拿到用户选择的文件
    let file = e.target.files[0]
    // 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file)
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})

// 确认按钮事件
$('#sureBtn').on('click',function(){
// 拿到用户选择的照片
let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
// 渲染到图片上
$.ajax({
    method:'POST',
    url:'/my/update/avatar',
    data:{
        avatar:dataURL
    },
    success:function(res){
        if(res.status !== 0){
            return layer.msg('更新头像失败')
        }
        layer.msg("更新头像成功")
        window.parent.getUserInfo()
    }
})
})
})