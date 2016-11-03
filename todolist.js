
    // 叉hover动态
    $('#content').on('mouseenter mouseleave','.content_list',
      function(){
      $(this).children('i').toggleClass('showV');
    })

    // 打钩部分
    $('#content').on('click','.circle',
      function(){
        if($(this).find('i').hasClass('showV')){
          $(this).find('i').removeClass('showV done');
          $(this).siblings('.content_text').removeClass('fontDel');

        }else{
          $(this).find('i').addClass('showV done');
          $(this).siblings('.content_text').addClass('fontDel');
        }
    })

    // 首部展示收缩事情
    $('#container_input span').on('click',function(){
      $('#content').toggleClass('active');
      if($('#content').hasClass('active')){
        $('.btn_do').addClass('selected');
      }else{
        $('.btn_do').removeClass('selected');
      }
    })

    // 底部展示全部事项
    $('.btn_do').on('click',function(){
      $('#content').addClass('active');
      $(this).addClass('selected');
      $(this).siblings().removeClass('selected');
    })

    // 添加事项
    $(document).ready(function(){
      $('.input_box').on('keyup',function(e){
          if(e.keyCode==13){
            var val_text=$(this).val();
            var newList='',
                $nodes;
            newList += '<div class="content_list">';
            newList += '<div class="circle">';
            newList += '<i class="iconfont icon-gou"></i>';
            newList += '</div>' ;
            newList += '<div class="content_text">'+ val_text +'</div>';
            newList += '<i class="iconfont icon-cha"></i>';
            newList += '</div>';
            $nodes=$(newList);
            $('#content').append($nodes);
            $('.input_box').val('');
            $('#content').addClass('active');
            $('.btn_do').addClass('selected');
          }
        })
      })

      // 待办事项数字计算
