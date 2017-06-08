window.onload = function(){
	var newtodo = document.getElementById('newlist');
	newtodo.onkeyup = function(ele){
		//ele.preventDefault();
		todolen = newtodo.value.length;
		if (ele.keyCode==13 && todolen>0) {
	        addnewlist();
	        newtodo.value = ''
		}
	}

	document.getElementById('cpl').onclick = function(){
        complist();
	}

	document.getElementById('del').onclick = function(){
        dellist();
	}

}	

//增加待完成任务
function addnewlist(){
	var todol = document.getElementById('todoinglist');
	var newtodo = document.getElementById('newlist');

	var newtodolist = document.createElement('li');
	var newcheck = document.createElement('input');
	var newliststr = document.createElement('p');
	newcheck.setAttribute('type','checkbox');
	//newtodolist.setAttribute('class','todoinglist')
    todol.appendChild(newtodolist);
    newtodolist.appendChild(newcheck);
    newtodolist.appendChild(newliststr);

    newliststr.innerHTML =newtodo.value;
    //待完成任务数量
    getlistnum('todo')
}

//完成任务
function complist(){ 
	var list = document.getElementById('todoinglist').getElementsByTagName('li');
	var listnum = list.length;
	var todol = document.getElementById('todocpllist');
	//var j=0;
	for (var i = listnum-1; i>=0 ; i--){
        if (list[i].getElementsByTagName('input')[0].checked){
        	//list[i].getElementsByTagName('input')[0].checked = false;
		    todol.appendChild(list[i]);
        }
	};
	for (var i = 0; i<document.getElementsByTagName('li').length;i++){
		document.getElementsByTagName('li')[i].getElementsByTagName('input')[0].checked = false;
	}
	getlistnum('todo');
	getlistnum('cpl');
}


//删除任务
function dellist(){
	var list = document.getElementsByTagName('li');
	var listnum = list.length;
	for (var i=listnum-1;i>=0;i--){
        if (list[i].getElementsByTagName('input')[0].checked){
        	//delani(i);
        	list[i].parentNode.removeChild(list[i]);
        } 
	}
	getlistnum('todo');
	getlistnum('cpl');
};
//动画效果
/*function delani(ele){
	var list = document.getElementsByTagName('li')[ele];
    timer = setInterval(function(){
    	console.log(list.offsetWidth+':'+ele);
    	if (list.offsetWidth == 0){
    		clearInterval(timer);
    		//list.parentNode.removeChild(list);
    	}else{
    		list.style.width = list.offsetWidth-10+'px';
    	}
    },100);
    getlistnum('todo');
	getlistnum('cpl');
};*/



//任务数量更新
function getlistnum(ele){
    switch (ele){
    	case 'todo':
    	    var todonum = document.getElementById('todoinglist').getElementsByTagName('li').length;
            document.getElementById('listnum-do').innerHTML = todonum;
    	break;
    	case 'cpl':
    	    var cplnum = document.getElementById('todocpllist').getElementsByTagName('li').length;
            document.getElementById('listnum-cpl').innerHTML = cplnum;
    	break;
    }
}