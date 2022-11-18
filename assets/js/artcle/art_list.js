$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    // 美化时间格式
    // 注册了个过滤器dateFormat，其实就是为 template.defaults.imports添加相应的方法来处理我们的数据。
    template.defaults.imports.DataFormat = function (data) {
        const dt = new Date(data)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //   补零
    function padZero(n) {
        return n > 9 ? n : '0' + n

    }
    // 定义一个查询的参数对象，将来请求数据时，需要将请求参数发送给server
    let p = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据，默认2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }


    initTable()
    initCate()

    // 获取文章列表的数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
               
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 获取筛选区中下拉菜单里的数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 将数据使用模板引擎渲染到下拉菜单栏中
                // console.log(res);
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // select内容为空值的原因
                // 1.在页面默认状态下select为空，等加载layui.js第三方插件，layui会自动渲染页面，此时select的内容为空
                // 2.模板引擎动态插入的数据并没有被layui监听到，因此页面数据依然为空
                // 解决方法 调用formd的render告诉layui重新渲染
                form.render()
            }
        })
    }

    // 为筛选表单绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取select里的值
        let cate_id = $("[name=cate_id]").val()
        let state = $("[name=state]").val()
        // 将值赋值给查询参数对象p的对应属性
        p.cate_id = cate_id
        p.state = state
        // 根据晒选的数据重新渲染table
        initTable()
    })

    // 渲染分页模块
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号           
            count: total, //数据总数，从服务端得到
            limit: p.pagesize,//每页显示的条数。
            curr: p.pagenum,//起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版
            limits: [2, 3, 5, 10],//每页条数的选择项
            // 分页发生切换时，触发jump回调
            jump: function (obj, frist) {
                // 触发jump的两个原因：
                // 1.点击时页面值时触发 此时first状态为undefined
                // 2.只有调用了renderPage(),就会触发 此时first状态为true

                // 将最新的页码值给参数对象p对应的属性
                // console.log(obj.curr);
                // console.log(frist);
                p.pagenum = obj.curr
                // console.log(obj.limit); //得到每页显示的条数
                // 将最新的页码条数给参数对象p对应的属性
                p.pagesize = obj.limit
                // 重新渲染表格
                // initTable() 直接调用会造成死循环
                // 解决方法 只要在触发jump第二种情况时，不调用initTale()即可
                if (!frist) {
                    initTable()
                }
            }
        });
    }

//    代理绑定删除按钮
$('body').on('click','.btn-delete',function(){
    // 利用删除按钮的个数来判断页码值pagenum是否该往上一层跳
    let len = $(this).length
    layer.confirm('确认是否删除?',{icon: 3, title:'提示'}, function(index){
       $.ajax({
        method:'GET',
        url:'/my/article/delete/'+id,
        success:function(res){
            if(res.status !== 0){
                return layer.msg('删除失败！')
            }
            layer.msg("删除成功！")
        //   只有当删除按钮个数为1时，才算删除页面中的数据 此时页码值-1
        if(len === 1){
            p.pagenum = p.pagenum = 1 ? 1 : p.pagenum-1
        }
            initCate()
        }
       })
        
        layer.close(index);
      });    
})

// 代理绑定编辑按钮
$('body').on('click','.btn-edit',function(){
    location.href='/artcle/art_update.html'
})
})