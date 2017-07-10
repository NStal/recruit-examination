// export interface todoTab {
//     text: string;
//     status: boolean;
//     matter: number;
// }
var TaskStorage = (function () {
    // 初始化localstorage数组
    function TaskStorage(storageKey, storageArrayName) {
        this.storageKey = storageKey;
        this.storageArrayName = storageArrayName;
        this.storageArray = this.init();
    }
    TaskStorage.prototype.init = function () {
        if (!localStorage.task) {
            window.localStorage.setItem(this.storageKey, "{\"" + this.storageArrayName + "\":[]}");
        }
        console.log(localStorage[this.storageKey]);
        return JSON.parse(localStorage[this.storageKey])[this.storageArrayName];
    };
    TaskStorage.prototype.getItemArray = function () {
        console.log(this.storageArrayName);
        return JSON.parse(window.localStorage[this.storageKey])[this.storageArrayName];
    };
    TaskStorage.prototype.addItem = function (item) {
        this.storageArray = this.getItemArray();
        this.storageArray.unshift(item);
        this.updata();
    };
    TaskStorage.prototype.setValue = function (index, taskKey, taskValue) {
        this.storageArray = this.getItemArray();
        this.storageArray[index][taskKey] = taskValue;
        this.updata();
    };
    TaskStorage.prototype.remove = function (index) {
        this.storageArray.splice(index, 1);
        this.updata();
    };
    TaskStorage.prototype.updata = function () {
        var storageValue = {};
        storageValue[this.storageArrayName] = this.storageArray;
        console.log(storageValue);
        window.localStorage[this.storageKey] = JSON.stringify(storageValue);
    };
    return TaskStorage;
}());
var StorageA = new TaskStorage('task', 'item');
var todos = JSON.parse(localStorage.task).item;
var Todo = (function () {
    function Todo(option) {
        this.item = option;
    }
    Todo.prototype.setDom = function () {
        var matterValue;
        var matterColor;
        switch (this.item.matter) {
            case (0):
                matterValue = '一般';
                matterColor = '#cccccc';
                break;
            case (1):
                matterValue = '重要';
                matterColor = '#aaaaaa';
                break;
            case (2):
                matterValue = '紧急';
                matterColor = '#888888';
                break;
        }
        var domString = "<li class ='task'>\n                        <span class = 'matter' style='background-color :" + matterColor + "'>" + matterValue + "</span>\n                        <input type = 'checkbox'  " + this.item.status + ">\n                        <p>" + this.item.text + "</p>\n                        <a href='#' class='delete' onclick = 'remove(this)'>\u5220\u9664</a>\n                        </li>";
        var div = document.createElement('div');
        div.innerHTML = domString;
        var task = div.childNodes[0];
        var taskMatter = task.querySelector('.matter');
        var p = task.querySelector('p');
        task.addEventListener('mouseenter', function (e) {
            detal.innerHTML = p.innerHTML;
        });
        p.addEventListener('mouseenter', function () {
            detal.style.display = 'block';
        });
        p.addEventListener('mouseleave', function () {
            detal.style.display = 'none';
        });
        var chebox = div.querySelector('[type="checkbox"]');
        if (this.item.status) {
            chebox.checked = true;
            addClass(task, 'full-task');
        }
        else {
            chebox.checked = false;
            removeClass(task, 'full-task');
        }
        chebox.addEventListener('click', function () {
            var taskList = document.getElementsByClassName('task-list')[0];
            var brothers = document.getElementsByClassName('task');
            var index = getIndex(brothers, chebox.parentElement);
            if (chebox.checked) {
                StorageA.setValue(index, 'status', true);
                addClass(task, 'full-task');
            }
            else {
                StorageA.setValue(index, 'status', false);
                removeClass(task, 'full-task');
            }
        });
        return task;
    };
    return Todo;
}());
// 实例
var taskList = document.getElementsByClassName('task-list')[0];
function showInit(sortState) {
    taskList.innerHTML = '';
    var todoArray = StorageA.getItemArray();
    switch (sortState) {
        case (0):
            break;
        case (1):
            todoArray.sort(function (a, b) {
                if (a.matter > b.matter) {
                    return -1;
                }
                else if (a.matter < b.matter) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            break;
        case (2):
            break;
    }
    for (var i = 0; i < todoArray.length; i++) {
        var showTodo = new Todo(todoArray[i]);
        taskList.appendChild(showTodo.setDom());
    }
}
showInit(0);
function remove(that) {
    var taskList = document.getElementsByClassName('task-list')[0];
    var brothers = document.getElementsByClassName('task');
    var index = getIndex(brothers, that.parentElement);
    StorageA.remove(index);
    taskList.removeChild(that.parentNode);
}
var addBtn = document.getElementsByClassName('add-task')[0];
addBtn.addEventListener('click', function () {
    var inputValue = document.querySelector('.task-input').value;
    var tip = document.getElementsByClassName('tip')[0];
    console.log(inputValue.length);
    if (inputValue.length == 0) {
        console.log('空');
        tip.innerHTML = '提示：输入内容不能为空';
        return;
    }
    document.querySelector('.task-input').value = '';
    var matter = document.querySelector('select').selectedIndex;
    StorageA.addItem({ 'text': inputValue, 'status': false, 'matter': matter });
    var newTodo = new Todo({ 'text': inputValue, 'status': false, 'matter': matter });
    taskList.insertBefore(newTodo.setDom(), taskList.childNodes[0]);
});
var input = document.getElementsByClassName('task-input')[0];
var detal = document.getElementsByClassName('detal')[0];
input.focus();
input.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        addBtn.click();
    }
});
taskList.addEventListener('mousemove', function (e) {
    detal.style.left = e.clientX + 20 + 'px';
    detal.style.top = e.clientY + 10 + 'px';
});
// 常用仿jq方法
function getIndex(brothers, target) {
    for (var i = 0; i < brothers.length; i++) {
        if (brothers[i] == target) {
            return i;
        }
    }
}
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(obj, cls) {
    if (!hasClass(obj, name)) {
        obj.className = obj.className + ' ' + cls;
    }
}
function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        obj.className = obj.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), '');
    }
}
var sortState;
var defaultBtn = document.querySelector('.sort-default');
var starBtn = document.querySelector('.sort-star');
defaultBtn.addEventListener('click', function () {
    sortState = 0;
    showInit(sortState);
    onlyClass(defaultBtn, 'pattern-select');
});
starBtn.addEventListener('click', function () {
    sortState = 1;
    showInit(sortState);
    onlyClass(starBtn, 'pattern-select');
});
function onlyClass(tag, className) {
    var siblingTag = tag.tagName;
    var sibling = tag.parentElement.getElementsByTagName(siblingTag);
    console.log(sibling);
    for (var i = 0; i < sibling.length; i++) {
        removeClass(sibling[i], className);
    }
    // let arr = []
    // arr.forEach.call(sibling, (element) => {
    //     console.log("array fuck", element)
    // });
    addClass(tag, className);
}
