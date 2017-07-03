interface TodoDada {
    content: string,
    timeStamp: number,
    doneFlag: boolean,
}

interface MatterListData {
    doneFlag: boolean,
    timeStamp: number,
    node: HTMLLIElement,
}

class TodoList {
    private matterList: MatterListData[] = []; // 节点
    private wrap = document.querySelector("div.container") as HTMLDivElement;
    private todoUlElement = this.wrap.querySelector("#todoList") as HTMLUListElement; // 待完成事项列表
    private doneUlElement = this.wrap.querySelector("#doneList") as HTMLUListElement; // 已完成事项列表
    private todoDataList: Array<TodoDada> = []; // 数据
    private input = document.getElementById("addTodo") as HTMLInputElement; // 输入框
    private todoListNum: number = 0; // 待完成事项数量
    private doneListNum: number = 0; // 已完成事项数量
    private todoListNumBox = this.wrap.querySelector("span.todoNum") as HTMLSpanElement; // 待办事项数量
    private doneListNumBox = this.wrap.querySelector("span.doneNum") as HTMLSpanElement; // 已完成事项数量
    private saveDataTimer: any;
    constructor() {
        this.init();
    }

    private init() {

        this.saveDataTimer = setInterval(() => {
            this.setLocalData();
        }, 2000);

        // 获取本地数据
        this.getLocalData();
        // 监听事项输入
        this.input.onkeyup = (e) => {
            let content = this.input.value;
            if (e.keyCode !== 13 || /^\s*$/g.test(content)) return false;
            let data: TodoDada = {
                content,
                timeStamp: 0,
                doneFlag: false
            }

            this.create(data)
            this.input.value = "";
        };

        // 创建item
        this.create();
        // 渲染页面
        this.rendering();
    }

    // 创建Item (一个或多个)
    private create(data?: TodoDada) {
        let timeStamp = new Date().getTime();
        if (data) {
            // 按下Enter键后执行
            data.timeStamp = timeStamp;
            let item = new TodoListItem(data), node = item.add();
            let matterListData = {
                doneFlag: data.doneFlag,
                timeStamp,
                node,
            };

            matterListData.doneFlag ? this.doneListNum++ : this.todoListNum++;

            this.matterList.push(matterListData);
            this.todoDataList.push(data);

            this.rendering(node);
        } else {
            if (this.todoDataList) {
                // 页面载入后,并且本地存有数据时被执行
                for (let i = 0; i < this.todoDataList.length; i++) {
                    let item = new TodoListItem(this.todoDataList[i]), node = item.add();
                    let matterListData = {
                        doneFlag: this.todoDataList[i].doneFlag,
                        timeStamp: this.todoDataList[i].timeStamp,
                        node,
                    };

                    matterListData.doneFlag ? this.doneListNum++ : this.todoListNum++;
                    this.matterList.push(matterListData);
                    this.rendering(node);
                }
            }
        }
    }

    // 渲染Item
    private rendering(node?: HTMLLIElement) {
        if (node) {
            this.todoUlElement.appendChild(node)
        } else {
            this.todoUlElement.innerHTML = "";
            for (let i = 0; i < this.matterList.length; i++) {
                if (this.matterList[i].doneFlag) {
                    this.doneUlElement.appendChild(this.matterList[i].node);
                } else {
                    this.todoUlElement.appendChild(this.matterList[i].node);
                }
            }
        }
        this.numChange();
    }

    // 获取本地数据
    private getLocalData() {
        this.todoDataList = JSON.parse(localStorage.getItem("todo")) || [];
    }

    // 数据保存到本地
    private setLocalData() {
        localStorage.setItem("todo", JSON.stringify(this.todoDataList));
    }

    // 事项数量发生变化
    private numChange() {
        this.doneListNumBox.innerHTML = this.doneListNum + "";
        this.todoListNumBox.innerHTML = this.todoListNum + "";
    }

    removeItem(timeStamp: number) {
        for (let i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === timeStamp) {
                this.matterList[i].doneFlag ? this.doneListNum-- : this.todoListNum--;
                this.matterList.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === timeStamp) {
                this.todoDataList.splice(i, 1);
                break;
            }
        }
        this.setLocalData();
        this.rendering();
    }

    shift(timeStamp: number, doneFlag: boolean) {
        let node: HTMLLIElement;
        for (let i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === timeStamp) {
                node = this.matterList[i].node;
                this.matterList[i].doneFlag = !this.matterList[i].doneFlag;
                break;
            }
        }

        for (let i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === timeStamp) {
                this.todoDataList[i].doneFlag = !this.todoDataList[i].doneFlag;
                let data = this.todoDataList[i];
                this.todoDataList.splice(i, 1);
                doneFlag ? this.todoDataList.unshift(data) : this.todoDataList.push(data);
                break;
            }
        }

        if (doneFlag) {
            this.doneUlElement.insertBefore(node, this.doneUlElement.children[0]);
            this.doneListNum++;
            this.todoListNum--;
        } else {
            this.todoUlElement.appendChild(node);
            this.todoListNum++;
            this.doneListNum--;
        }
        Object.defineProperty(this, "todoListData", {
            set: () => { },
            get: () => { }
        })
        this.numChange();
    }
    set todoListData(v) {

    }
}

class TodoListItem {
    node: any;
    checked: boolean = false;
    private li: HTMLLIElement;
    private checkbox: HTMLInputElement;
    private contentBox: HTMLParagraphElement;
    private clearBtn: HTMLAnchorElement;
    private timeStamp: number;
    constructor(private readonly data: TodoDada) {
        this.timeStamp = data.timeStamp;
    }

    add() {
        let template = `
                <input type="checkbox" ${this.data.doneFlag ? "checked" : ""} data-timeStamp="${this.data.timeStamp}"><p>${this.data.content}</p><a href="javascript:void(0);" class="btn btn-delete fr" data-timeStamp="${this.data.timeStamp}">X</a>
            `;
        this.li = document.createElement("li") as HTMLLIElement;
        this.li.innerHTML = template;
        this.li.className = "item";

        this.checkbox = this.li.querySelector("input[type=checkbox]") as HTMLInputElement;
        this.contentBox = this.li.querySelector("p");
        this.clearBtn = this.li.querySelector("a.btn-delete") as HTMLAnchorElement;

        this.bindEvent();
        return this.li;
    }

    bindEvent() {
        this.checkbox.onclick = () => this.done();
        this.clearBtn.onclick = () => this.remove();
    }

    remove() {
        todolist.removeItem(this.timeStamp);
    }

    done() {
        todolist.shift(this);
    }
}

var todolist = new TodoList()