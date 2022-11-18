$(function(){
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    // 获取文章分类列表

    function initArtCateList(){
      $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                // console.log(res);
               let htmlStr = template('tpl_table',res)
               $('tbody').html(htmlStr)
            }
        })
    }

// 为添加类别按钮注册事件
let indexAdd = null
$('#addBtn').on('click',function(){
    // console.log(11);
    indexAdd = layer.open({
        type:1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#artdialog-add').html()
      });   
})

// 因form_add是动态生成的，故不能用一般的绑定 得用事件委托（代理）
$('body').on('submit','#form-add',function(e){
    e.preventDefault()
    // console.log(11);
$.ajax({
    method:'post',
    url:'/my/article/addcates',
    data:$(this).serialize(),
    success:function(res){
        if(res.status !== 0){
            return '添加失败'
        }
        initArtCateList()
        layer.msg('添加成功')
        // 每一种弹层调用方式，都会返回一个index把获得的index，轻轻地赋予layer.close即可
        layer.close(indexAdd)
    }

})
})

// 同样通过委托的形式，给编辑弹窗绑定事件
let indexEdit = null
$('tbody').on('click','#btn-edit',function(){
    // console.log(11);
    indexEdit = layer.open({
        type:1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#artdialog-edit').html()
      });   
      

      let id = $(this).attr('data-id')
    //   console.log(id);
    $.ajax({
        method:'GET',
        url:'/my/article/cates/'+id,
        success:function(res){
            // console.log(res);
            form.val('form-edit',res.data)
        }
    })


})

    // 代理绑定编辑按钮
    $('body').on('click','#form-edit',function(){
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新表单信息失败')
                }
                // console.log(res);
                layer.msg('更新表单信息成功')
                layer.close(indexEdit)
                initArtCateList()
              
            }
        })
    })

    // 代理绑定删除按钮
    $('body').on('click','.btn-delete',function(){
        // console.log(22);
        let id = $(this).attr('data-id')
        // console.log(id);
        // 跳出询问弹窗
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
           $.ajax({
            method:'GET',
            url:'/my/article/deletecate/'+id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('删除文章分类失败')
                }
                layer.msg('删除文章分类成功')
                layer.close(index)
                initArtCateList()
            }
           })    
          });
    })
})
