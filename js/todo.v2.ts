// 单条本地数据格式
interface LocalData {
    content: string;
    doneFlag: boolean;
    timeStamp: number;
}

class TodoList {
    todoWrapElement = document.querySelector(".container") as HTMLDivElement;
    todoListElement = this.todoWrapElement.querySelector("#todoList") as HTMLUListElement;
    doneListElement = this.todoWrapElement.querySelector("#doneList") as HTMLUListElement;
    todoNumSpanElemen = this.todoWrapElement.querySelector(".todoNum") as HTMLSpanElement;
    doneNumSpanElemen = this.todoWrapElement.querySelector(".doneNum") as HTMLSpanElement;
    inputBox = document.getElementById("addTodo") as HTMLInputElement;
    todoNum: number = 0;
    doneNum: number = 0;
    localData: Array<LocalData> = JSON.parse(localStorage.getItem('todo')) || [];

    constructor() {
        this.init();
        this.inputBox.onkeyup = e => {
            if (e.keyCode !== 13 || /^\s*$/g.test(this.inputBox.value)) return false;
            let timeStamp: number = new Date().getTime();
            let data = {
                content: this.inputBox.value,
                doneFlag: false,
                timeStamp,
            }
            this.addItem(data)
            // 清空输入框内容
            this.inputBox.value = "";
        }
    }

    init() {
        if (this.localData.length > 0) {
            this.localData.forEach((values: LocalData, index) => {
                this.addItem(values, false);
            });
        }
    }

    // 添加待办事项
    addItem(data: LocalData, save?: boolean) {


        let item: HTMLLIElement, item_checkbox: HTMLInputElement, item_p: HTMLParagraphElement, item_clearBtn: HTMLAnchorElement;

        item = document.createElement("li"); // li
        item_checkbox = document.createElement("input"); //  复选框 - input[type=checkbox] 标记事项是否完成
        item_p = document.createElement("p");   // p - 存放item内容
        item_clearBtn = document.createElement("a"); // 按钮 - 删除item

        item.className = "item";
        item.setAttribute("data-timestamp", data.timeStamp + "");

        item_checkbox.type = "checkbox";
        if (data.doneFlag) item_checkbox.checked = true;
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
        } else {
            this.todoListElement.appendChild(item);
            this.todoNum++;
        }

        this.itemsNumChange();

        // 是否保存数据到本地
        if (save !== false) this.saveData(data);

    }

    // 删除事项
    removeItem(item: HTMLLIElement) {
        let node = item.parentNode as HTMLLIElement;
        if (node.id === "todoList") {
            this.todoListElement.removeChild(item);
            this.todoNum--;
            this.itemsNumChange();
        } else {
            this.doneListElement.removeChild(item);
            this.doneNum--;
            this.itemsNumChange();
        }
        this.deleteData(parseInt(item.getAttribute("data-timeStamp")));
    }


    // 保存数据到本地
    saveData(data?: LocalData) {
        if (data) this.localData.push({ ...data });
        localStorage.setItem("todo", JSON.stringify(this.localData));
    }

    // 删除本地数据
    deleteData(timestamp: number) {
        this.localData.forEach((values: LocalData, index) => {
            if (timestamp === values.timeStamp) {
                console.log(index)
                this.localData.splice(index, 1);
                this.saveData();
            }
        });
    }

    // 事件数量发生变化时
    itemsNumChange() {
        this.todoNumSpanElemen.innerHTML = this.todoNum.toString();
        this.doneNumSpanElemen.innerHTML = this.doneNum.toString();
    }

    // 移动事项 从todo到done
    toDone(node: HTMLLIElement) {
        this.doneListElement.appendChild(node);
        this.doneNum++;
        this.todoNum--;
        this.itemsNumChange();
    }

    // 移动事项 从done到todo
    toTodo(node: HTMLLIElement) {
        this.todoListElement.appendChild(node);
        this.doneNum--;
        this.todoNum++;
        this.itemsNumChange();
    }

    // 改变数据
    changeData(timeStamp: number) {
        this.localData.forEach((values: LocalData, index) => {
            if (values.timeStamp === timeStamp) {
                console.log(this.localData[index])
                this.localData[index].doneFlag = !this.localData[index].doneFlag;
                this.saveData();
            }
        });
    }
}

class TodoListItem {
    checkBox = this.node.querySelector("input[type=checkbox]") as HTMLInputElement;
    clearBtn = this.node.querySelector(".btn-delete") as HTMLAnchorElement;
    contentBox = this.node.querySelector("p") as HTMLParagraphElement;

    constructor(public readonly parent: TodoList, public readonly node: HTMLLIElement) {
        if (this.checkBox) this.checkBox.onclick = this.done.bind(this);
        if (this.clearBtn) this.clearBtn.onclick = this.clear.bind(this);

    }

    // 事项状态发生变化
    done() {
        let timeStamp = parseInt(this.checkBox.getAttribute("data-timeStamp"));
        if (this.checkBox.checked) {
            console.log(`执行事项完成 : ${this.checkBox.checked}`)
            this.parent.toDone(this.node);
            this.parent.changeData(timeStamp);
        } else {
            console.log(`执行事项待完成 : ${this.checkBox.checked}`)
            this.parent.toTodo(this.node);
            this.parent.changeData(timeStamp);
        }

    }

    // 删除
    clear() {
        let timeStamp = parseInt(this.checkBox.getAttribute("data-timeStamp"));
        this.parent.removeItem(this.node);
    }

}

new TodoList()