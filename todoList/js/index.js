window.onload = function() {
    var OText = document.getElementById("todoText");
    OText.onkeyup = function(e) {
        var e = e || event;
        if (e.keyCode !== 13 || /^\s*$/g.test(this.value)) return false;
        todo.add("todo", this.value);
        todo.saveData("todo", this.value);
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
            if (target.checked || target.checked === "checked") {
                todo.add("done", val);
                todo.saveData("done",val);
                todo.delete("todo", target.parentNode);
                todo.deleteData("todo",val);
                todo.todoNum--;
                todo.doneNum++;
                todo.numChange();
            } else {
                todo.add("todo",val);
                todo.saveData("todo",val);
                todo.delete("done", target.parentNode);
                todo.deleteData("done",val);
                todo.doneNum--;
                todo.todoNum++;
                todo.numChange();
            }
        }

        // 删除事件
        if (target.nodeName.toLowerCase() === "a" && target.classList.contains("btn-delete")) {
        	var val = target.parentNode.getElementsByTagName("p")[0].innerHTML;
            if (target.parentNode.parentNode.parentNode.classList.contains("todoListBox")) {
                todo.deleteData("todo",val);
                todo.delete("todo", target.parentNode);
                todo.todoNum--;
                todo.numChange();
            } else {
            	console.log(target.parentNode.getElementsByTagName("p")[0].value);
                todo.deleteData("done",val);
                todo.delete("done", target.parentNode);
                todo.doneNum--;
                todo.numChange();
            }
        }
    };

    var todo = new Todo();
    todo.init();

};
