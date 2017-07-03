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
        // 获取本地数据
        this.getLocalData();
        // 监听事项输入
        this.input.onkeyup = function (e) {
            var content = _this.input.value;
            if (e.keyCode !== 13 || /^\s*$/g.test(content))
                return false;
            clearInterval(_this.saveDataTimer);
            var data = {
                content: content,
                timeStamp: 0,
                doneFlag: false
            };
            _this.create(data);
            _this.input.value = "";
            _this.dataChange();
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
            var item = new TodoListItem(data, this), node = item.node;
            var matterListData = {
                doneFlag: data.doneFlag,
                timeStamp: timeStamp,
                node: node,
            };
            matterListData.doneFlag ? this.doneListNum++ : this.todoListNum++;
            this.matterList.push(matterListData);
            this.todoDataList.push(data);
            this.rendering(node);
            this.dataChange();
        }
        else {
            if (this.todoDataList) {
                // 页面载入后,并且本地存有数据时被执行
                for (var i = 0; i < this.todoDataList.length; i++) {
                    var item = new TodoListItem(this.todoDataList[i], this), node = item.node;
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
            this.doneUlElement.innerHTML = "";
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
    TodoList.prototype.dataChange = function () {
        var _this = this;
        clearTimeout(this.saveDataTimer);
        this.saveDataTimer = setTimeout(function () {
            console.log("save data");
            _this.setLocalData();
        }, 2000);
    };
    TodoList.prototype.removeItem = function (item) {
        for (var i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === item.timeStamp) {
                this.matterList[i].doneFlag ? this.doneListNum-- : this.todoListNum--;
                this.matterList.splice(i, 1);
                console.log(i);
                break;
            }
        }
        for (var i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === item.timeStamp) {
                this.todoDataList.splice(i, 1);
                break;
            }
        }
        // this.setLocalData();
        this.dataChange();
        this.rendering();
    };
    TodoList.prototype.shift = function (item) {
        var node;
        for (var i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === item.timeStamp) {
                node = this.matterList[i].node;
                this.matterList[i].doneFlag = !this.matterList[i].doneFlag;
                break;
            }
        }
        for (var i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === item.timeStamp) {
                this.todoDataList[i].doneFlag = !this.todoDataList[i].doneFlag;
                var data = this.todoDataList[i];
                this.todoDataList.splice(i, 1);
                item.checked ? this.todoDataList.unshift(data) : this.todoDataList.push(data);
                break;
            }
        }
        if (item.checked) {
            this.doneUlElement.insertBefore(node, this.doneUlElement.children[0]);
            this.doneListNum++;
            this.todoListNum--;
        }
        else {
            this.todoUlElement.appendChild(node);
            this.todoListNum++;
            this.doneListNum--;
        }
        // Object.defineProperty(this, "todoListData", {
        //     set: () => { },
        //     get: () => { }
        // })
        this.numChange();
        this.dataChange();
    };
    // set todoListData(v) {
    // }
    TodoList.prototype.contentChange = function (item) {
        for (var i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === item.timeStamp) {
                this.todoDataList[i].content = item.content;
                break;
            }
        }
        this.dataChange();
    };
    TodoList.prototype.dragStart = function (item) { this.ItemDragStart = item; };
    TodoList.prototype.dragEnter = function (item) { this.ItemDragEnter = item; };
    TodoList.prototype.drop = function (item) { console.log("sssssssssssssssssss", item.node); };
    TodoList.prototype.dragEnd = function () {
        if (this.ItemDragStart !== this.ItemDragEnter) {
            var startValue = this.ItemDragStart.content;
            for (var i = 0; i < this.todoDataList.length; i++) {
                if (this.ItemDragStart.timeStamp === this.todoDataList[i].timeStamp) {
                    this.ItemDragStart.contentBox.innerHTML = this.ItemDragEnter.content;
                    this.ItemDragStart.content = this.ItemDragEnter.content;
                    this.todoDataList[i].content = this.ItemDragEnter.content;
                }
                else if (this.ItemDragEnter.timeStamp === this.todoDataList[i].timeStamp) {
                    this.ItemDragEnter.contentBox.innerHTML = startValue;
                    this.ItemDragEnter.content = startValue;
                    this.todoDataList[i].content = startValue;
                }
            }
        }
        this.dataChange();
    };
    return TodoList;
}());
var TodoListItem = (function () {
    function TodoListItem(data, parent) {
        this.data = data;
        this.parent = parent;
        this.checked = false;
        var template = "\n                <input type=\"checkbox\" " + (this.data.doneFlag ? "checked" : "") + " data-timeStamp=\"" + this.data.timeStamp + "\"><p contenteditable>" + this.data.content + "</p><a href=\"javascript:void(0);\" class=\"btn btn-delete fr\" data-timeStamp=\"" + this.data.timeStamp + "\">X</a>\n            ";
        this.node = document.createElement("li");
        this.node.innerHTML = template;
        this.node.className = "item";
        this.node.draggable = true;
        this.checkbox = this.node.querySelector("input[type=checkbox]");
        this.contentBox = this.node.querySelector("p");
        this.clearBtn = this.node.querySelector("a.btn-delete");
        this.checked = data.doneFlag || false;
        this.timeStamp = data.timeStamp;
        this.content = data.content;
        this.bindEvent();
    }
    TodoListItem.prototype.create = function () { };
    TodoListItem.prototype.bindEvent = function () {
        var _this = this;
        var contentChangeTimer = null;
        var contentLength = 0;
        var oldContent = "";
        var _self = this;
        this.checkbox.onclick = function () { return _this.done(); };
        this.clearBtn.onclick = function () { return _this.remove(); };
        this.contentBox.onkeyup = function () {
            if (_this.contentBox.innerHTML.length !== contentLength || _this.contentBox.innerHTML !== oldContent) {
                clearTimeout(contentChangeTimer);
                _this.node.style.backgroundColor = "#fff";
                _this.clearBtn.style.color = "#abcdef";
                contentChangeTimer = setTimeout(function () {
                    _this.contentChange();
                }, 600);
                oldContent = _this.contentBox.innerHTML;
                contentLength = _this.contentBox.innerHTML.length;
            }
            else {
                _this.node.style.backgroundColor = "rgba(255, 181, 181,.7)";
                _this.clearBtn.style.color = "#fff";
            }
        };
        this.node.ondragstart = function () { return _this.drag("start"); };
        this.node.ondragenter = function () { return _this.drag("enter"); };
        this.node.ondrop = function () { return _this.drag("drop"); };
        this.node.ondragend = function () { return _this.drag("end"); };
    };
    TodoListItem.prototype.remove = function () {
        this.parent.removeItem(this);
    };
    TodoListItem.prototype.done = function () {
        this.checked = !this.checked;
        this.parent.shift(this);
    };
    TodoListItem.prototype.contentChange = function () {
        this.content = this.contentBox.innerHTML;
        this.parent.contentChange(this);
    };
    TodoListItem.prototype.drag = function (flag) {
        switch (flag) {
            case "start":
                this.parent.dragStart(this);
                break;
            case "enter":
                this.parent.dragEnter(this);
                break;
            case "drop":
                this.parent.drop(this);
                break;
            case "end":
                this.parent.dragEnd();
                break;
        }
    };
    return TodoListItem;
}());
var todolist = new TodoList();
