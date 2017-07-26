window.onload = function(){

    var addBtn = document.getElementsByClassName('add-task')[0];
    var input = document.getElementsByClassName('task-input')[0];
    var detal = document.getElementsByClassName('detal')[0];
    var taskList = document.getElementsByClassName('task-list')[0];
    input.focus();
    input.addEventListener('keydown',function(e){
        if (e.keyCode == 13){
            addBtn.click()
        }
    })
    taskList.addEventListener('mousemove',function(e){
        console.log(123)
        console.log(e.clientX)
        detal.style.left = e.clientX+20+ 'px'
        detal.style.top = e.clientY+10 + 'px'
    })
 

    var taskJson;
    var itemJson;
    // 1初始化localstorage
    if(typeof(localStorage.task) == 'undefined'){
        taskJson = '{"item":[]}'
        window.localStorage.setItem('task',taskJson);
    }

    // 2根据localstorage更新DOM
    showTask()
     

    //  添加task事件
    addBtn.addEventListener('click',function(){
        var newText = input.value;
        var tip = document.getElementsByClassName('tip')[0];
        console.log(newText.length)
        if (newText.length == 0){
            console.log('空')
            tip.innerHTML = '提示：输入内容不能为空'
            return
        }
        tip.innerHTML = ''
        var taskStorage = localStorage.task;
        var itemArray = JSON.parse(taskStorage).item;
        var matter = document.getElementsByClassName('start')[0].selectedIndex;
        // 添加至localstorage
        var newItem = {'test':newText,'matter':matter,'state':false};
        var taskStorage = localStorage.task;
        var itemArray = JSON.parse(taskStorage).item;
        itemArray.unshift(newItem)
        itemJson = {'item':itemArray}
        window.localStorage.task = JSON.stringify(itemJson)
        // 添加至dom
        var newLi = createLi(newText,matter)

        taskList.insertBefore(newLi,taskList.childNodes[0])

        input.value = ''

    })
 

    function showTask(){
        var itemList = JSON.parse(localStorage.task).item;
        // taskList.innerHTML = '';
        for (var i = 0; i<itemList.length ; i++){
            var text = itemList[i].test;
            var state = itemList[i].state;
            var matter = itemList[i].matter;
            var li = createLi(text,matter,state)
            taskList.appendChild(li)
        }
    }

    // 根据参数创建li
    function createLi(text,matter,state){
        var newLi = document.createElement('li');
        newLi.setAttribute('class','task');
        var matterSpan = document.createElement('span');
        matterSpan.className = 'matter';
        switch(matter){
            case 0:
            matterSpan.innerHTML = '一般'
            break
            case 1:
            matterSpan.innerHTML = '重要'
            matterSpan.style.background = '#aaaaaa'
            break
            case 2:
            matterSpan.innerHTML = '紧急'
            matterSpan.style.background = '#888888'
            break
            default:
            matterSpan.innerHTML = '一般'
            break
        }
        var newIput = document.createElement('input');
        newIput.setAttribute('type','checkbox');
        if(state){
            newIput.checked = true;    
        };
        newIput.addEventListener('click',function(){
            var list = document.getElementsByClassName('task');
            var index = getIndex(list,this.parentNode);
            var taskStorage = localStorage.task;
            var itemArray = JSON.parse(taskStorage).item;
            itemArray[index].state = this.checked;
            itemJson = {'item':itemArray};
            localStorage.task = JSON.stringify(itemJson)
            juadeFull(newIput)
        })

        var newP = document.createElement('p')
        var newA = document.createElement('a');
        newA.setAttribute('href','#');
        newA.innerHTML = '删除';
        newA.setAttribute('class','delete');
        newA.addEventListener('click',function(){
            var list = document.getElementsByClassName('task');
            // 获取被删除li的下标
            var index = getIndex(list,this.parentNode)
            var taskStorage = localStorage.task;
            var itemArray = JSON.parse(taskStorage).item;
            itemArray.splice(index,1);
            itemJson = {'item':itemArray};
            localStorage.task = JSON.stringify(itemJson)     
            this.parentElement.remove();
        })
        newLi.appendChild(matterSpan)
        newLi.appendChild(newIput)
        newLi.appendChild(newP)
        newLi.appendChild(newA)
        newLi.getElementsByTagName('p')[0].innerHTML =  text;
        newLi.addEventListener('mouseenter',function(e){
            detal.innerHTML = newP.innerHTML;
        })
        newP.addEventListener('mouseenter',function(){
            detal.style.display = 'block'
        })
        newP.addEventListener('mouseleave',function(){
            detal.style.display = 'none'
        })
    // 根据checkbox设置父元素的class
        juadeFull(newIput)
        return newLi
    }

    function juadeFull(obj){
        if(obj.checked){ 
            addClass(obj.parentNode,'full-task')
          
        }else{
            console.log(111)
            removeClass(obj.parentNode,'full-task')
        }
    }
//  常用dom操作方法
    // 获取节点位置的索引
    function getIndex(brothers,target){
        for(i=0;i<brothers.length;i++){
                if(brothers[i] == target){
                    return i ;
                }
            }
    }

    function hasClass(obj,cls){
           return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
    }

    function addClass(obj,cls){
        console.log(hasClass(obj,cls))
        if (!hasClass(obj,name)){
            obj.className =obj.className +' '+ cls;
        } 
    }
    function removeClass(obj,cls){
        if (hasClass(obj,cls)){
            console.log(2)
            obj.className = obj.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),'')
        } 
    }
}

