var Todo = (function () {
    function Todo(_todoNode, _doneNode) {
        if (_todoNode === void 0) { _todoNode = document.getElementById("todoList"); }
        if (_doneNode === void 0) { _doneNode = document.getElementById("doneList"); }
        this._todoNode = _todoNode;
        this._doneNode = _doneNode;
        this.todoData = null;
        this.todoNum = 0;
        this.doneNum = 0;
        this.todoNode = _todoNode;
        this.doneNode = _doneNode;
    }
    Todo.prototype.init = function () {
        console.log("init start");
        if (JSON.parse(localStorage.getItem("todo"))) {
            this.todoData = JSON.parse(localStorage.getItem("todo"));
        }
        else {
            this.todoData = [];
        }
        for (var i = 0; i < this.todoData.length; i++) {
            if (this.todoData[i].done) {
                this.add({
                    type: "done",
                    value: this.todoData[i].title,
                    timestamp: this.todoData[i].timestamp
                });
                this.doneNum++;
                this.numChange();
            }
            else {
                this.add({
                    type: "todo",
                    value: this.todoData[i].title,
                    timestamp: this.todoData[i].timestamp
                });
                this.todoNum++;
                this.numChange();
            }
        }
        console.log("init end");
    };
    Todo.prototype.add = function (ops) {
        /**
         * ops.type
         * ops.value
         * ops.timestamp
         */
        console.log("add start");
        var OLi = document.createElement("li");
        var OInput = document.createElement("input");
        var OP = document.createElement("p");
        var OA = document.createElement("a");
        OLi.className = "item";
        OInput.type = "checkbox";
        OA.href = "javascript:;";
        OA.className = "btn";
        OA.classList.add("btn-delete", "fr");
        OA.innerHTML = "X";
        OP.innerHTML = ops.value;
        OLi.appendChild(OInput);
        OLi.appendChild(OP);
        OLi.appendChild(OA);
        OInput.setAttribute("data-timestamp", ops.timestamp);
        OA.setAttribute("data-timestamp", ops.timestamp);
        OLi.setAttribute("data-timestamp", ops.timestamp);
        if (ops.type === "todo") {
            this.todoNode.appendChild(OLi);
        }
        else if (ops.type === "done") {
            OInput.checked = true;
            this.doneNode.appendChild(OLi);
        }
        console.log("add end");
    };
    Todo.prototype.delete = function (node, obj) {
        console.log("delete start");
        if (node === "todo") {
            this.todoNode.removeChild(obj);
        }
        else if (node === "done") {
            this.doneNode.removeChild(obj);
        }
        console.log("delete end");
    };
    Todo.prototype.numChange = function () {
        console.log("numChage start");
        var ONums = document.getElementsByClassName("num");
        for (var i = 0; i < ONums.length; i++) {
            if (ONums[i].classList.contains("todoNum")) {
                ONums[i].innerHTML = this.todoNum.toString();
            }
            else if (ONums[i].classList.contains("doneNum")) {
                ONums[i].innerHTML = this.doneNum.toString();
            }
            else {
                console.log("找不到元素");
            }
        }
        console.log("numChage end");
    };
    Todo.prototype.saveData = function (ops) {
        /**
         * ops.type
         * ops.value
         * ops.timestamp
         */
        this.data = {
            title: "",
            done: false,
            timestamp: ""
        };
        console.log("saveData start");
        if (ops.type === "todo") {
            this.data.title = ops.value;
            this.data.done = false;
            this.data.timestamp = ops.timestamp;
            this.todoData.push(this.data);
        }
        else if (ops.type === "done") {
            this.data.title = ops.value;
            this.data.done = true;
            this.data.timestamp = ops.timestamp;
            this.todoData.push(this.data);
        }
        else {
            console.log("error:储存名称错误!");
        }
        localStorage.setItem("todo", JSON.stringify(this.todoData));
        console.log("saveData end");
    };
    Todo.prototype.deleteData = function (ops) {
        console.log("deleteData start");
        for (var i = 0; i < this.todoData.length; i++) {
            if (ops.type === "done" && this.todoData[i].done && this.todoData[i].timestamp === ops.timestamp) {
                this.todoData.splice(i, 1);
            }
            else if (ops.type === "todo" && !this.todoData[i].done && this.todoData[i].timestamp === ops.timestamp) {
                this.todoData.splice(i, 1);
            }
            else {
                console.log("找不到记录");
            }
        }
        localStorage.setItem("todo", JSON.stringify(this.todoData));
        console.log("deleteData end");
    };
    return Todo;
}());
var Index = (function () {
    function Index(OTxt, todoOps) {
        var _this = this;
        this.OTxt = OTxt;
        this.todoOps = todoOps;
        this.todo = new Todo();
        console.log("new Index");
        this.todo.init();
        this.OText = OTxt;
        // 事件委托
        document.onclick = function () {
            console.log("document click");
            _this.todoClick(event);
        };
        this.todoAdd();
    }
    // 添加item
    Index.prototype.todoAdd = function () {
        var _this = this;
        console.log("todoAdd");
        this.OText = document.getElementById("todoText");
        console.log(this.OText);
        this.OText.onkeyup = function (e) {
            console.log(_this.OText.value, new Date().getTime());
            if (e.keyCode !== 13 || /^\s*$/g.test(_this.OText.value))
                return false;
            console.log("in");
            var timestamp = new Date().getTime().toString();
            _this.todo.add({
                type: "todo",
                value: _this.OText.value,
                timestamp: timestamp
            });
            _this.todo.saveData({
                type: "todo",
                value: _this.OText.value,
                timestamp: timestamp
            });
            _this.todo.todoNum++;
            _this.todo.numChange();
            _this.OText.value = "";
        };
    };
    Index.prototype.todoClick = function (ev) {
        console.log("todoClick");
        var e = ev || event;
        var target = e.target || e.srcElement;
        // 勾选
        if (target.nodeName.toLowerCase() === "input" && target.getAttribute("type") === "checkbox") {
            var timestamp = target.getAttribute("data-timestamp");
            var val = target.parentNode.getElementsByTagName("p")[0].innerHTML;
            if (target.checked && target.type === "checkbox") {
                this.todo.add({
                    type: "done",
                    value: val,
                    timestamp: timestamp
                });
                this.todo.saveData({
                    type: "done",
                    value: val,
                    timestamp: timestamp
                });
                this.todo.delete("todo", target.parentNode);
                this.todo.deleteData({
                    type: "todo",
                    timestamp: timestamp
                });
                this.todo.todoNum--;
                this.todo.doneNum++;
                this.todo.numChange();
            }
            else {
                this.todo.add({
                    type: "todo",
                    value: val,
                    timestamp: timestamp
                });
                this.todo.saveData({
                    type: "todo",
                    value: val,
                    timestamp: timestamp
                });
                this.todo.delete("done", target.parentNode);
                this.todo.deleteData({
                    type: "done",
                    timestamp: timestamp
                });
                this.todo.doneNum--;
                this.todo.todoNum++;
                this.todo.numChange();
            }
        }
        // 删除
        if (target.nodeName.toLowerCase() === "a" && target.classList.contains("btn-delete")) {
            var timestamp = target.getAttribute("data-timestamp");
            var val = target.parentNode.getElementsByTagName("p")[0].innerHTML;
            if (target.parentNode.parentNode.parentNode.classList.contains("todoListBox")) {
                this.todo.deleteData({
                    type: "todo",
                    timestamp: timestamp
                });
                this.todo.delete("todo", target.parentNode);
                this.todo.todoNum--;
                this.todo.numChange();
            }
            else {
                this.todo.deleteData({
                    type: "done",
                    timestamp: timestamp
                });
                this.todo.delete("done", target.parentNode);
                this.todo.doneNum--;
                this.todo.numChange();
            }
        }
    };
    return Index;
}());
var index = new Index();
