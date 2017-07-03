/**
 * 依赖 main.v0.js
 */


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var todo_1 = require("./todo");
var Index = (function() {
    function Index(OTxt, todoOps) {
        var _this = this;
        this.OTxt = OTxt;
        this.todoOps = todoOps;
        this.todo = null;
        if (todoOps) {
            this.todo = new todo_1.Todo(todoOps.todoNode, todoOps.doneNode);
        } else {
            this.todo = new todo_1.Todo();
        }
        console.log("new Index");
        this.todo.init();
        this.OText = OTxt;
        // 事件委托
        document.onclick = function() {
            console.log("document click");
            _this.todoClick(event);
        };
        this.todoAdd();
    }
    // 添加item
    Index.prototype.todoAdd = function() {
        var _this = this;
        console.log("todoAdd");
        this.OText = document.getElementById("todoText");
        console.log(this.OText);
        this.OText.onkeyup = function(e) {
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
    Index.prototype.todoClick = function(ev) {
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
            } else {
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
            } else {
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
new Index();
// export { Index };
