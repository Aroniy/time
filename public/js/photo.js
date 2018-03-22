$(function(){

    // 图片缓加载
    $("img").each(function(){
        $(this).attr("src", $(this).attr("data-src"));
        $(this).on("load", function(){
            $(this).removeAttr("data-src");
        });
    });

    //上传
    $(".add-btn").click(function(){
        $(".main").addClass("main-blur");
        $(".form-con").show();
        if(typeof(FileReader)=="undefined"){
            $.alert("该换手机啦~")
        }
    })

    //关闭上传浮层
    $(".close-btn").click(function(){
        $(".main").removeClass("main-blur");
        $(".form-con").hide();
    })


    //照片预览
    $("#photo-file").on("change", function(){
        var file = $(this)[0].files[0];

        if(typeof(file)!="undefined"){
            if (!/image\/\w+/.test(file.type)) {
                $.alert("只能选择图片");
                return false;
            }
        }else return;

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
            $(".label-icon").attr("src", $(this)[0].result);
        }
    })


    //上传按钮
    var photo_input = $(".photo-file"),
        desc_input = $(".photo-desc");
    $(".upload-btn").click(function(){
        console.log(photo_input.val())
        if(photo_input.val()==""){
            $.alert("请选择照片~");
            return false;
        }else if(desc_input.val()==""){
            $.alert("请添加描述~")
            return false;
        }else{
            var form_data = new FormData();
            form_data.append("desc",desc_input.val());
            form_data.append("photo",photo_input[0].files[0]);


            $.ajax({
                type: "POST",
                url: "/save",
                data: form_data,
                contentType: false,
                processData: false,
                beforeSend: function(){
                    $.showLoading("上传中");
                },

                success: function(data){
                    $.hideLoading();
                    $.toast("上传成功");
                    $(".close-btn").click();
                    console.log(data);
                    appendItem(data);
                },
                error: function(){
                    $.hideLoading();
                    $.alert("上传失败");
                }
            });

        }
    })

    //添加
    function appendItem(data){
        var left_height = $(".left").height(),
            right_height = $(".right").height(),
            resData = JSON.parse(data);

        if(resData.code==0){
            $(".end").show();
            $(window).unbind("scroll");
            return;
        };

        var itemDom = $('<div class="item"><img src="static/img/uploads/' + resData.photoName + '" alt=""><div class="fonts"><p class="desc">' + resData.desc + '</p><p class="date">' + resData.date + '</p></div></div>');

        if(left_height>right_height){
            $(".right").append(itemDom);
        }else{
            $(".left").append(itemDom);
        }
    }


    var isLoading = false;
    $(window).on("scroll", function(){
        var awayBtm = $(document).height() - $(window).scrollTop() - $(window).height();
        if(awayBtm==0){
            $(".loading").show();
            if(!isLoading){
                isLoading = true;
                loadMore();
            }else return;
        }
    })

    var loadCurrent = {
        skip:0
    }

    function loadMore(){
        $.ajax({
            type: "POST",
            url: "/loadMore",
            data: loadCurrent,
            dataType:"json",
            beforeSend: function(){
                console.log(loadCurrent)
            },
            success: function(data){
                console.log(data);
                data.forEach(function(cr){
                    appendItem(cr);
                })
                loadCurrent.skip += data.length;
                isLoading = false;
                $(".loading").hide();
            }
        })
    }




})