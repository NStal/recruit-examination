var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var TodoList = (function () {
    function TodoList() {
        var _this = this;
        this.todoWrapElement = document.querySelector(".container");
        this.todoListElement = this.todoWrapElement.querySelector("#todoList");
        this.doneListElement = this.todoWrapElement.querySelector("#doneList");
        this.todoNumSpanElemen = this.todoWrapElement.querySelector(".todoNum");
        this.doneNumSpanElemen = this.todoWrapElement.querySelector(".doneNum");
        this.inputBox = document.getElementById("addTodo");
        this.todoNum = 0;
        this.doneNum = 0;
        this.localData = JSON.parse(localStorage.getItem('todo')) || [];
        this.init();
        this.inputBox.onkeyup = function (e) {
            if (e.keyCode !== 13 || /^\s*$/g.test(_this.inputBox.value))
                return false;
            var timeStamp = new Date().getTime();
            var data = {
                content: _this.inputBox.value,
                doneFlag: false,
                timeStamp: timeStamp,
            };
            _this.addItem(data);
            // 清空输入框内容
            _this.inputBox.value = "";
        };
    }
    TodoList.prototype.init = function () {
        var _this = this;
        if (this.localData.length > 0) {
            this.localData.forEach(function (values, index) {
                _this.addItem(values, false);
            });
        }
    };
    // 添加待办事项
    TodoList.prototype.addItem = function (data, save) {
        var item, item_checkbox, item_p, item_clearBtn;
        item = document.createElement("li"); // li
        item_checkbox = document.createElement("input"); //  复选框 - input[type=checkbox] 标记事项是否完成
        item_p = document.createElement("p"); // p - 存放item内容
        item_clearBtn = document.createElement("a"); // 按钮 - 删除item
        item.className = "item";
        item.setAttribute("data-timestamp", data.timeStamp + "");
        item_checkbox.type = "checkbox";
        if (data.doneFlag)
            item_checkbox.checked = true;
        item_checkbox.setAttribute("data-timestamp", data.timeStamp + "");
        item_p.innerHTML = data.content;
        item_clearBtn.href = "javascript:void(0);";
        item_clearBtn.className = "btn";
        item_clearBtn.classList.add("btn-delete", "fr");
        item_clearBtn.setAttribute("data-timestamp", data.timeStamp + "");
        item_clearBtn.innerHTML = "X";
        item.appendChild(item_checkbox);
        item.appendChild(item_p);
        item.appendChild(item_clearBtn);
        new TodoListItem(this, item);
        if (data.doneFlag) {
            this.doneListElement.appendChild(item);
            this.doneNum++;
        }
        else {
            this.todoListElement.appendChild(item);
            this.todoNum++;
        }
        this.itemsNumChange();
        // 是否保存数据到本地
        if (save !== false)
            this.saveData(data);
    };
    // 删除事项
    TodoList.prototype.removeItem = function (item) {
        var node = item.parentNode;
        if (node.id === "todoList") {
            this.todoListElement.removeChild(item);
            this.todoNum--;
            this.itemsNumChange();
        }
        else {
            this.doneListElement.removeChild(item);
            this.doneNum--;
            this.itemsNumChange();
        }
        this.deleteData(parseInt(item.getAttribute("data-timeStamp")));
    };
    // 保存数据到本地
    TodoList.prototype.saveData = function (data) {
        if (data)
            this.localData.push(__assign({}, data));
        localStorage.setItem("todo", JSON.stringify(this.localData));
    };
    // 删除本地数据
    TodoList.prototype.deleteData = function (timestamp) {
        var _this = this;
        this.localData.forEach(function (values, index) {
            if (timestamp === values.timeStamp) {
                console.log(index);
                _this.localData.splice(index, 1);
                _this.saveData();
            }
        });
    };
    // 事件数量发生变化时
    TodoList.prototype.itemsNumChange = function () {
        this.todoNumSpanElemen.innerHTML = this.todoNum.toString();
        this.doneNumSpanElemen.innerHTML = this.doneNum.toString();
    };
    // 移动事项 从todo到done
    TodoList.prototype.toDone = function (node) {
        this.doneListElement.appendChild(node);
        this.doneNum++;
        this.todoNum--;
        this.itemsNumChange();
    };
    // 移动事项 从done到todo
    TodoList.prototype.toTodo = function (node) {
        this.todoListElement.appendChild(node);
        this.doneNum--;
        this.todoNum++;
        this.itemsNumChange();
    };
    // 改变数据
    TodoList.prototype.changeData = function (timeStamp) {
        var _this = this;
        this.localData.forEach(function (values, index) {
            if (values.timeStamp === timeStamp) {
                console.log(_this.localData[index]);
                _this.localData[index].doneFlag = !_this.localData[index].doneFlag;
                _this.saveData();
            }
        });
    };
    return TodoList;
}());
var TodoListItem = (function () {
    function TodoListItem(parent, node) {
        this.parent = parent;
        this.node = node;
        this.checkBox = this.node.querySelector("input[type=checkbox]");
        this.clearBtn = this.node.querySelector(".btn-delete");
        this.contentBox = this.node.querySelector("p");
        if (this.checkBox)
            this.checkBox.onclick = this.done.bind(this);
        if (this.clearBtn)
            this.clearBtn.onclick = this.clear.bind(this);
    }
    // 事项状态发生变化
    TodoListItem.prototype.done = function () {
        var timeStamp = parseInt(this.checkBox.getAttribute("data-timeStamp"));
        if (this.checkBox.checked) {
            console.log("\u6267\u884C\u4E8B\u9879\u5B8C\u6210 : " + this.checkBox.checked);
            this.parent.toDone(this.node);
            this.parent.changeData(timeStamp);
        }
        else {
            console.log("\u6267\u884C\u4E8B\u9879\u5F85\u5B8C\u6210 : " + this.checkBox.checked);
            this.parent.toTodo(this.node);
            this.parent.changeData(timeStamp);
        }
    };
    // 删除
    TodoListItem.prototype.clear = function () {
        var timeStamp = parseInt(this.checkBox.getAttribute("data-timeStamp"));
        this.parent.removeItem(this.node);
    };
    return TodoListItem;
}());
new TodoList();
