//获取类名
function getClass(obj, name) {
    var objs = obj.getElementsByTagName('*');
    var result = [];
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].className == name) {
            result.push(objs[i]);
        }
    }
    return result;
}


// 获取元素节点

var ul = document.getElementsByTagName('ul')[0];
var create = document.getElementsByTagName('button')[0];
var todoTxt = document.getElementsByTagName('input')[0];
var edit = getClass(document, 'edit')[0];
var num = getClass(document, 'num')[0];
var all = getClass(document, 'all on')[0];
var active = getClass(document, 'active')[0];
var completed = getClass(document, 'completed')[0];
var items2 = getClass(document, 'items2')[0];
var btns = items2.getElementsByTagName('a');
var secAll = getClass(document, 'sec-all')[0];
var clear = getClass(document, 'clear')[0];
var tTop = getClass(document, 'top')[0];
var todos = [];
var times = [];

// 添加函数
function createFn() {
    var mydate = new Date();
    var myhours = mydate.getHours();
    var myminus = mydate.getMinutes();
    if (myhours < 10) {
        myhours = "0" + myhours;
    }
    if (myminus < 10) {
        myminus = "0" + myminus;
    }
    time = myhours + ':' + myminus;
    var newTodos = document.createElement('li');
    if (todoTxt.value == '' || todoTxt.value == null) {
        return false;
    } else {
        newTodos.innerHTML = '<img src="img/ico-1.png"><i>' + todoTxt.value + '</i><button class="delete">delete</button><span class="time">' + time + '</span>';
        if (tTop.checked) {
            ul.insertBefore(newTodos, ul.firstChild);
            newTodos.style.cssText = "background:#f38ca7;";
        } else {
            ul.appendChild(newTodos);
        }
        todos.push(todoTxt.value);
        times.push(time);
        localStorage.setItem('date', todos);
        localStorage.setItem('time', times);
        todoTxt.value = '';
    }
    edit.style.display = "block";
    total();
}
// 键盘事件
document.onkeydown = function (e) {
    var e = e || event;
    if (e.keyCode == 13) {
        createFn();
    }
}
//事件委托
ul.onclick = function (e) {
    var lis = document.getElementsByTagName('li');
    var e = e || event;
    var target = e.target;
    if (target.nodeName == "BUTTON") {
        target.parentNode.remove();
        if (lis.length == 0) {
            edit.style.display = "none";
        }
    }
    if (target.nodeName == "IMG") {
        if (target.src.indexOf('img/ico-2.png') < 0) {
            target.src = "img/ico-2.png";
            target.nextSibling.style.textDecoration = "line-through";
            target.nextSibling.style.color = "#999";
            if (active.className == 'on') {
                activeFn(26);
            }
        } else {
            target.src = "img/ico-1.png";
            target.nextSibling.style.textDecoration = "none";
            target.nextSibling.style.color = "";
            if (completed.className == 'on') {
                activeFn(-1);
            }
        }
    }
    total();
}
// 计算items数量
function total() {
    var nums = document.getElementsByTagName('img');
    var len = nums.length;
    var arr2 = [];
    for (var i = 0; i < len; i++) {
        if (nums[i].src.indexOf('img/ico-2.png') < 0) {
            arr2.push(nums[i]);
        }
    }
    num.innerHTML = arr2.length;
}

// 全部显示
all.onclick = function () {
    var lis = document.getElementsByTagName('li');
    var len = lis.length;
    for (var i = 0; i < len; i++) {
        lis[i].style.display = 'block';
    }
    show(this);
}

// 显示未完成
active.onclick = function () {
    activeFn(26);
    show(this);
}

function activeFn(inx) {
    var lis = document.getElementsByTagName('li');
    var nums = document.getElementsByTagName('img');
    var len = lis.length;
    for (var i = 0; i < len; i++) {
        lis[i].style.display = "block";
        if (nums[i].src.indexOf('ico-2.png') == inx) {
            lis[i].style.display = "none";
        }
    }
}

// 显示完成
completed.onclick = function () {
    show(this);
    activeFn(-1);
}

// 点击高亮
function show(inx) {
    for (var i = 0; i < btns.length; i++) {
        btns[i].className = '';
    }
    inx.className = "on";
}

// 点击切换全选
var flag = true;
secAll.onclick = function () {
    var nums = document.getElementsByTagName('img');
    var len = nums.length;
    if (flag) {
        for (var i = 0; i < len; i++) {
            nums[i].src = "img/ico-2.png";
            flag = false;
        }
    } else {
        for (var i = 0; i < len; i++) {
            nums[i].src = "img/ico-1.png";
            flag = true;
        }
    }
    total();
}

// 清除全部
clear.onclick = function () {
    var nums = document.getElementsByTagName('img');
    var lens = nums.length;
    var arr3 = [];
    for (var i = 0; i < lens; i++) {
        if (nums[i].src.indexOf('img/ico-2.png') > 0) {
            arr3.push(nums[i].parentNode);
        }
    }
    for (var i = 0; i < arr3.length; i++) {
        arr3[i].remove();
    }
    if (nums.length == 0) {
        edit.style.display = "none";
    }
}
// 打开重新获取
window.onload = function () {
    var result = localStorage.getItem('date').split(',');
    var resultTime = localStorage.getItem('time').split(',');
    var len = result.length;
    for (var i = 0; i < len; i++) {
        var newTodos = document.createElement('li');
        newTodos.innerHTML = '<img src="img/ico-1.png"><i>' + result[i] + '</i><button class="delete">delete</button><span class="time">' + resultTime[i] + '</span>';
        ul.appendChild(newTodos);
    }
    edit.style.display = "block";
    total();
}