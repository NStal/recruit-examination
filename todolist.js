
    // 叉hover动态
    $('#content').on('mouseenter mouseleave','.content_list',
      function(){
      $(this).children('i').toggleClass('showV');
    })

    // 点击X 删除事项
    $('#content').on('click','.content_list>i',function(){
      $(this).closest('.content_list').remove();
      num=$('.content_list').length;
      console.log(num);
    })

    // 打钩部分
    $('#content').on('click','.circle',
      function(){
        if($(this).find('i').hasClass('showV')){
          $(this).find('i').removeClass('showV');
          $(this).closest('.content_list').removeClass('done');
          $(this).siblings('.content_text').removeClass('fontDel');
        }else{
          $(this).find('i').addClass('showV');
          $(this).closest('.content_list').addClass('done');
          $(this).siblings('.content_text').addClass('fontDel');
        }
    })

    // 首部展示收缩事情
    $('#container_input span').on('click',function(){
      $('#content').toggleClass('active');
      $('.content_list').removeClass('hide');
      if($('#content').hasClass('active')){
        $('.btn_do').addClass('selected');
        $('.btn_do').siblings().removeClass('selected');

      }else{
        $('.btn_do').removeClass('selected');
        $('.btn_do').siblings().removeClass('selected');
      }
    })

    // 底部展示全部事项
    $('.btn_do').on('click',function(){
      $('#content').addClass('active');
      $('.content_list').removeClass('hide');
      $(this).addClass('selected');
      $(this).siblings().removeClass('selected');
    });

    // 底部展示全部事项
    $('.btn_done').on('click',function(){
      $(this).addClass('selected');
      $(this).siblings().removeClass('selected');
      $('.content_list').each(function(){
        if(!$(this).hasClass('done')){
          $(this).addClass('hide');
        }
      })
    })

    // 底部删除完成事项
    $('.btn_clear').on('click',function(){
      $('.content_list').each(function(){
        console.log($(this));
        if($(this).hasClass('done')){
          $(this).remove();
          num=$('.content_list').length;
          console.log(num);
        }
      });
    });

    // 添加事项
    $(document).ready(function(){
      $('.input_box').on('keyup',function(e){
          var val_text=$(this).val();
          if(e.keyCode==13&&(val_text!=='')){
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
            $('.btn_do').siblings().removeClass('selected');
            num=$('.content_list').length;
            console.log(num);
            localStorage.setItem('things',val_text)
            // document.write(localStorage.things);
          }
        })
      })
      // // 待办事项数字计算
      // $(document).on('click keyup',function(e){
      //   if(e.keyCode==13&&(val_text!=='')){
      //     num=$('.content_list').length;
      //   }
      //


      //
      // })

      var num;
