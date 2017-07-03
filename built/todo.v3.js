var TodoList = (function () {
    function TodoList() {
        this.matterList = []; // 节点
        this.wrap = document.querySelector("div.container");
        this.todoUlElement = this.wrap.querySelector("#todoList"); // 待完成事项列表
        this.doneUlElement = this.wrap.querySelector("#doneList"); // 已完成事项列表
        this.todoDataList = []; // 数据
        this.input = document.getElementById("addTodo"); // 输入框
        this.todoListNum = 0; // 待完成事项数量
        this.doneListNum = 0; // 已完成事项数量
        this.todoListNumBox = this.wrap.querySelector("span.todoNum"); // 待办事项数量
        this.doneListNumBox = this.wrap.querySelector("span.doneNum"); // 已完成事项数量
        this.init();
    }
    TodoList.prototype.init = function () {
        var _this = this;
        this.saveDataTimer = setInterval(function () {
            _this.setLocalData();
        }, 2000);
        // 获取本地数据
        this.getLocalData();
        // 监听事项输入
        this.input.onkeyup = function (e) {
            var content = _this.input.value;
            if (e.keyCode !== 13 || /^\s*$/g.test(content))
                return false;
            var data = {
                content: content,
                timeStamp: 0,
                doneFlag: false
            };
            _this.create(data);
            _this.input.value = "";
        };
        // 创建item
        this.create();
        // 渲染页面
        this.rendering();
    };
    // 创建Item (一个或多个)
    TodoList.prototype.create = function (data) {
        var timeStamp = new Date().getTime();
        if (data) {
            // 按下Enter键后执行
            data.timeStamp = timeStamp;
            var item = new TodoListItem(data), node = item.add();
            var matterListData = {
                doneFlag: data.doneFlag,
                timeStamp: timeStamp,
                node: node,
            };
            matterListData.doneFlag ? this.doneListNum++ : this.todoListNum++;
            this.matterList.push(matterListData);
            this.todoDataList.push(data);
            this.rendering(node);
        }
        else {
            if (this.todoDataList) {
                // 页面载入后,并且本地存有数据时被执行
                for (var i = 0; i < this.todoDataList.length; i++) {
                    var item = new TodoListItem(this.todoDataList[i]), node = item.add();
                    var matterListData = {
                        doneFlag: this.todoDataList[i].doneFlag,
                        timeStamp: this.todoDataList[i].timeStamp,
                        node: node,
                    };
                    matterListData.doneFlag ? this.doneListNum++ : this.todoListNum++;
                    this.matterList.push(matterListData);
                    this.rendering(node);
                }
            }
        }
    };
    // 渲染Item
    TodoList.prototype.rendering = function (node) {
        if (node) {
            this.todoUlElement.appendChild(node);
        }
        else {
            this.todoUlElement.innerHTML = "";
            for (var i = 0; i < this.matterList.length; i++) {
                if (this.matterList[i].doneFlag) {
                    this.doneUlElement.appendChild(this.matterList[i].node);
                }
                else {
                    this.todoUlElement.appendChild(this.matterList[i].node);
                }
            }
        }
        this.numChange();
    };
    // 获取本地数据
    TodoList.prototype.getLocalData = function () {
        this.todoDataList = JSON.parse(localStorage.getItem("todo")) || [];
    };
    // 数据保存到本地
    TodoList.prototype.setLocalData = function () {
        localStorage.setItem("todo", JSON.stringify(this.todoDataList));
    };
    // 事项数量发生变化
    TodoList.prototype.numChange = function () {
        this.doneListNumBox.innerHTML = this.doneListNum + "";
        this.todoListNumBox.innerHTML = this.todoListNum + "";
    };
    TodoList.prototype.removeItem = function (timeStamp) {
        for (var i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === timeStamp) {
                this.matterList[i].doneFlag ? this.doneListNum-- : this.todoListNum--;
                this.matterList.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === timeStamp) {
                this.todoDataList.splice(i, 1);
                break;
            }
        }
        this.setLocalData();
        this.rendering();
    };
    TodoList.prototype.shift = function (timeStamp, doneFlag) {
        var node;
        for (var i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === timeStamp) {
                node = this.matterList[i].node;
                this.matterList[i].doneFlag = !this.matterList[i].doneFlag;
                break;
            }
        }
        for (var i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === timeStamp) {
                this.todoDataList[i].doneFlag = !this.todoDataList[i].doneFlag;
                var data = this.todoDataList[i];
                this.todoDataList.splice(i, 1);
                doneFlag ? this.todoDataList.unshift(data) : this.todoDataList.push(data);
                break;
            }
        }
        if (doneFlag) {
            this.doneUlElement.insertBefore(node, this.doneUlElement.children[0]);
            this.doneListNum++;
            this.todoListNum--;
        }
        else {
            this.todoUlElement.appendChild(node);
            this.todoListNum++;
            this.doneListNum--;
        }
        Object.defineProperty(this, "todoListData", {
            set: function () { },
            get: function () { }
        });
        this.numChange();
    };
    Object.defineProperty(TodoList.prototype, "todoListData", {
        set: function (v) {
        },
        enumerable: true,
        configurable: true
    });
    return TodoList;
}());
var TodoListItem = (function () {
    function TodoListItem(data) {
        this.data = data;
        this.checked = false;
        this.timeStamp = data.timeStamp;
    }
    TodoListItem.prototype.add = function () {
        var template = "\n                <input type=\"checkbox\" " + (this.data.doneFlag ? "checked" : "") + " data-timeStamp=\"" + this.data.timeStamp + "\"><p>" + this.data.content + "</p><a href=\"javascript:void(0);\" class=\"btn btn-delete fr\" data-timeStamp=\"" + this.data.timeStamp + "\">X</a>\n            ";
        this.li = document.createElement("li");
        this.li.innerHTML = template;
        this.li.className = "item";
        this.checkbox = this.li.querySelector("input[type=checkbox]");
        this.contentBox = this.li.querySelector("p");
        this.clearBtn = this.li.querySelector("a.btn-delete");
        this.bindEvent();
        return this.li;
    };
    TodoListItem.prototype.bindEvent = function () {
        var _this = this;
        this.checkbox.onclick = function () { return _this.done(); };
        this.clearBtn.onclick = function () { return _this.remove(); };
    };
    TodoListItem.prototype.remove = function () {
        todolist.removeItem(this.timeStamp);
    };
    TodoListItem.prototype.done = function () {
        todolist.shift(this);
    };
    return TodoListItem;
}());
var todolist = new TodoList();
