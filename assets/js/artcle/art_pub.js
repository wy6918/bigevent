$(function(){

    let layer = layui.layer
    let form = layui.form
    // 获取下列菜单的数据
    initCate()
// 初始化富文本编辑器
initEditor()
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类列表失败！')
                }
                // layer.msg('获取文章分类列表成功！')
                // 调用模板引擎，渲染下拉菜单
                let htmlStr = template('tpl-cate',res)
                $('[name = cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

      // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)

//   为封面按钮绑定事件
$('#btnChooseImage').on('click',function(){
    $("#coverFile").click()
})

// 监听coverFile的change事件，获取用户选择的文件列表
$("#coverFile").on('change',function(e){
    // 获取到文件的列表数组
    let file = e.target.files
    // 判断用户是否选择了文件
    if(file.length === 0){
        return
    }
    // 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file[0])
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})

// 定义文章的发布状态值
let art_state = '已发布'
// 为草稿按钮绑定事件，点击时改变文章发布状态
$("#btnSave2").on('click',function(){
    art_state = '草稿'
})

// 监听form表单事件
$("#form-pub").on('submit',function(e){
    e.preventDefault()
    // 基于form表单 创建FormData()对象
    let fd = new FormData($(this)[0])
    // 将文章的发布状态追加到fd
    fd.append('state',art_state)
    // 将裁剪后的图片，输出为文件
    $image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    // 将文件对象追加到fd
    fd.append('cover_img',blob)
    //   发起ajax请求
    publishArticle(fd)
  })
})

// 定义一个发布文章的方法
function publishArticle(fd){
$.ajax({
    method:'POST',
    url:'/my/article/add',
    data:fd,
    contentType:false,
    processData:false,
    success:function(res){
        if(res.status !== 0){
            return layer.msg('发布文章失败！')
        }
         layer.msg('发布文章成功！')
        location.href='/artcle/art_list.html'
    }
})
}
})