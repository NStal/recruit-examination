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

        this.todoData = null;
        this.todoNum = 0;
        this.doneNum = 0;
    };

    Todo.prototype = {
        init: function() {
            if (JSON.parse(localStorage.getItem("todo"))) {
                this.todoData = JSON.parse(localStorage.getItem("todo"))
            } else {
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
                } else {
                    this.add({
                        type: "todo",
                        value: this.todoData[i].title,
                        timestamp: this.todoData[i].timestamp
                    });
                    this.todoNum++;
                    this.numChange();
                }
            }

        },
        add: function(ops) {
            /**
             * ops.type
             * ops.value
             * ops.timestamp
             */
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
                this.default_ops.todoNode.appendChild(OLi);
            } else if (ops.type === "done") {
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
        saveData: function(ops) {
            /**
             * ops.type
             * ops.value
             * ops.timestamp
             */

            var d = {};

            // console.log(ops.type,ops.value,ops.timestamp);

            if (ops.type === "todo") {
                d.title = ops.value;
                d.done = false;
                d.timestamp = ops.timestamp;
                this.todoData.push(d);
            } else if (ops.type === "done") {
                d.title = ops.value;
                d.done = true;
                d.timestamp = ops.timestamp;
                this.todoData.push(d);
            } else {
                console.log("error:储存名称错误!");
            }

            localStorage.setItem("todo", JSON.stringify(this.todoData));
        },
        deleteData: function(ops) {

            for (var i = 0; i < this.todoData.length; i++) {
                if (ops.type === "done" && this.todoData[i].done && this.todoData[i].timestamp === ops.timestamp) {
                    this.todoData.splice(i, 1);
                } else if (ops.type === "todo" && !this.todoData[i].done && this.todoData[i].timestamp === ops.timestamp) {
                    this.todoData.splice(i, 1);
                } else {
                    console.log("找不到记录");
                }

            }

            localStorage.setItem("todo", JSON.stringify(this.todoData));
        }
    };

    window["Todo"] = Todo;
})();
