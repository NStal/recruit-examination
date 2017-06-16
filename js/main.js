;
(function() {
    var Todo = function(opt) {
        this.default_ops = {
            todoNode: document.getElementById("todoList"),
            doneNode: document.getElementById("doneList")
        };

        if (opt) {
            for (var x in opt) {
                if (opt.hasOwnProperty(x)) {
                    this.default_ops[x] = opt[x];
                }
            }
        }

        this.todoNum = 0;
        this.doneNum = 0;
    };

    Todo.prototype = {
        init: function() {
            var data = null;
            if (JSON.parse(localStorage.getItem("todo"))) {
                data = JSON.parse(localStorage.getItem("todo"))
            } else {
                data = [];
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].done) {
                    this.add("done", data[i].title);
                    this.doneNum++;
                    this.numChange();
                } else {
                    this.add("todo", data[i].title);
                    this.todoNum++;
                    this.numChange();
                }
            }

        },
        add: function(node, content) {
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
            OP.innerHTML = content;
            OLi.appendChild(OInput);
            OLi.appendChild(OP);

            OLi.appendChild(OA);

            if (node === "todo") {
                this.default_ops.todoNode.appendChild(OLi);
            } else if (node === "done") {
                OInput.checked = "checked";
                this.default_ops.doneNode.appendChild(OLi);
            }
        },
        delete: function(node, obj) {
            if (node === "todo") {
                this.default_ops.todoNode.removeChild(obj);
            } else if (node === "done") {
                this.default_ops.doneNode.removeChild(obj);
            }
        },
        numChange: function() {
            var ONums = document.getElementsByClassName("num");
            for (var i = 0; i < ONums.length; i++) {
                if (ONums[i].classList.contains("todoNum")) {
                    ONums[i].innerHTML = this.todoNum;
                } else if (ONums[i].classList.contains("doneNum")) {
                    ONums[i].innerHTML = this.doneNum;
                } else {
                    console.log("找不到元素");
                }
            }
        },
        saveData: function(type, val) {
            var data = null;
            if (JSON.parse(localStorage.getItem("todo"))) {
                data = JSON.parse(localStorage.getItem("todo"))
            } else {
                data = [];
            }
            var d = {};
            if (type === "todo") {
                d.title = val;
                d.done = false;
                data.push(d);
            } else if (type === "done") {
                d.title = val;
                d.done = true;
                data.push(d);
            } else {
                console.log("error:储存名称错误!");
            }
            localStorage.setItem("todo", JSON.stringify(data));
        },
        deleteData: function(type, val) {
            var data = null;
            if (JSON.parse(localStorage.getItem("todo"))) {
                data = JSON.parse(localStorage.getItem("todo"))
            } else {
                data = [];
            }
            var count = 0;
            if (type === "todo") {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].title === val && data[i].done === false) {
                        data.splice(i, 1);
                    }
                }
            } else if (type === "done") {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].title === val && data[i].done) {
                        data.splice(i, 1);
                    }
                }
            } else {
                console.log("没有数据");
            }

            localStorage.setItem("todo", JSON.stringify(data));
        }
    };

    window["Todo"] = Todo;
})();
