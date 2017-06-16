window.onload = function() {
    var OText = document.getElementById("todoText");
    OText.onkeyup = function(e) {
        var e = e || event;
        if (e.keyCode !== 13 || /^\s*$/g.test(this.value)) return false;
        var timestamp = new Date().getTime();
        todo.add({
            type: "todo",
            value: this.value,
            timestamp: timestamp
        });
        todo.saveData({
            type: "todo",
            value: this.value,
            timestamp: timestamp
        });
        todo.todoNum++;
        todo.numChange();
        this.value = "";
    };

    // 事件委托
    document.onclick = function(e) {
        var e = e || event;
        var target = e.target || e.srcElement;

        // 勾选事件
        if (target.nodeName.toLowerCase() === "input" && target.type === "checkbox") {　　　　　　　
            var val = target.parentNode.getElementsByTagName("p")[0].innerHTML;
            var timestamp = parseInt(target.getAttribute("data-timestamp"));

            if (target.checked || target.checked === "checked") {
                todo.add({
                    type: "done",
                    value: val,
                    timestamp: timestamp
                });
                todo.saveData({
                    type: "done",
                    value: val,
                    timestamp: timestamp
                });
                todo.delete("todo", target.parentNode);
                todo.deleteData({
                    type:"todo",
                    timestamp:timestamp
                });
                todo.todoNum--;
                todo.doneNum++;
                todo.numChange();
            } else {
                todo.add({
                    type: "todo",
                    value: val,
                    timestamp: timestamp
                });
                todo.saveData({
                    type: "todo",
                    value: val,
                    timestamp: timestamp
                });
                todo.delete("done", target.parentNode);
                todo.deleteData({
                    type:"done",
                    timestamp:timestamp
                });
                todo.doneNum--;
                todo.todoNum++;
                todo.numChange();
            }
        }

        // 删除事件
        if (target.nodeName.toLowerCase() === "a" && target.classList.contains("btn-delete")) {
            var val = target.parentNode.getElementsByTagName("p")[0].innerHTML;
            var timestamp = parseInt(target.getAttribute("data-timestamp"));

            if (target.parentNode.parentNode.parentNode.classList.contains("todoListBox")) {
                todo.deleteData({
                    type:"todo",
                    timestamp:timestamp
                });
                todo.delete("todo", target.parentNode);
                todo.todoNum--;
                todo.numChange();
            } else {
                todo.deleteData({
                    type:"done",
                    timestamp:timestamp
                });
                todo.delete("done", target.parentNode);
                todo.doneNum--;
                todo.numChange();
            }
        }
    };

    var todo = new Todo();
    todo.init();

};
