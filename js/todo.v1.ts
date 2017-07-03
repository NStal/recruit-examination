interface todoDefaultData {
    todoNode: Node;
    doneNode: Node;
}

interface saveData {
    title: string;
    done: boolean;
    timestamp: string;
}

interface ops {
    type: string;
    value: string;
    timestamp: string;
}

interface nodeType {
    type: string;
}

class Todo {
    todoNode: Node;
    doneNode: Node;
    todoData = null;
    todoNum: number = 0;
    doneNum: number = 0;
    data: saveData;

    constructor(public _todoNode: Node = document.getElementById("todoList"), public _doneNode: Node = document.getElementById("doneList")) {
        this.todoNode = _todoNode;
        this.doneNode = _doneNode;
    }



    init() {
        console.log("init start");
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
        console.log("init end");
    }

    add(ops: ops) {
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
        } else if (ops.type === "done") {
            OInput.checked = true;
            this.doneNode.appendChild(OLi);
        }
        console.log("add end");
    }

    delete(node: string, obj: Node) {
        console.log("delete start");
        if (node === "todo") {
            this.todoNode.removeChild(obj);
        } else if (node === "done") {
            this.doneNode.removeChild(obj);
        }
        console.log("delete end");
    }

    numChange() {
        console.log("numChage start");
        let ONums = document.getElementsByClassName("num");
        for (var i = 0; i < ONums.length; i++) {
            if (ONums[i].classList.contains("todoNum")) {
                ONums[i].innerHTML = this.todoNum.toString();
            } else if (ONums[i].classList.contains("doneNum")) {
                ONums[i].innerHTML = this.doneNum.toString();
            } else {
                console.log("找不到元素");
            }
        }
        console.log("numChage end");
    }

    saveData(ops: ops) {
        /**
         * ops.type
         * ops.value
         * ops.timestamp
         */

        this.data = {
            title: "",
            done: false,
            timestamp: ""
        }
        console.log("saveData start");
        if (ops.type === "todo") {
            this.data.title = ops.value;
            this.data.done = false;
            this.data.timestamp = ops.timestamp;
            this.todoData.push(this.data);
        } else if (ops.type === "done") {
            this.data.title = ops.value;
            this.data.done = true;
            this.data.timestamp = ops.timestamp;
            this.todoData.push(this.data);
        } else {
            console.log("error:储存名称错误!");
        }

        localStorage.setItem("todo", JSON.stringify(this.todoData));
        console.log("saveData end");
    }

    deleteData(ops) {
        console.log("deleteData start");
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
        console.log("deleteData end");
    }
}


export { Todo };



