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
    private ItemDragStart: TodoListItem;
    private ItemDragEnter: TodoListItem;
    constructor() {
        this.init();
    }

    private init() {

        // 获取本地数据
        this.getLocalData();
        // 监听事项输入
        this.input.onkeyup = (e) => {
            let content = this.input.value;
            if (e.keyCode !== 13 || /^\s*$/g.test(content)) return false;
            clearInterval(this.saveDataTimer);
            let data: TodoDada = {
                content,
                timeStamp: 0,
                doneFlag: false
            }

            this.create(data)
            this.input.value = "";
            this.dataChange();
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
            let item = new TodoListItem(data, this), node = item.node;
            let matterListData = {
                doneFlag: data.doneFlag,
                timeStamp,
                node,
            };

            matterListData.doneFlag ? this.doneListNum++ : this.todoListNum++;

            this.matterList.push(matterListData);
            this.todoDataList.push(data);

            this.rendering(node);
            this.dataChange();
        } else {
            if (this.todoDataList) {
                // 页面载入后,并且本地存有数据时被执行
                for (let i = 0; i < this.todoDataList.length; i++) {
                    let item = new TodoListItem(this.todoDataList[i], this), node = item.node;
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
            this.doneUlElement.innerHTML = "";
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

    private dataChange() {
        clearTimeout(this.saveDataTimer);
        this.saveDataTimer = setTimeout(() => {
            console.log("save data");
            this.setLocalData();
        }, 2000);

    }

    removeItem(item: TodoListItem) {
        for (let i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === item.timeStamp) {
                this.matterList[i].doneFlag ? this.doneListNum-- : this.todoListNum--;
                this.matterList.splice(i, 1);
                console.log(i)
                break;
            }
        }

        for (let i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === item.timeStamp) {
                this.todoDataList.splice(i, 1);
                break;
            }
        }

        // this.setLocalData();
        this.dataChange();
        this.rendering();
    }

    shift(item: TodoListItem) {
        let node: HTMLLIElement;
        for (let i = 0; i < this.matterList.length; i++) {
            if (this.matterList[i].timeStamp === item.timeStamp) {
                node = this.matterList[i].node;
                this.matterList[i].doneFlag = !this.matterList[i].doneFlag;
                break;
            }
        }

        for (let i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === item.timeStamp) {
                this.todoDataList[i].doneFlag = !this.todoDataList[i].doneFlag;
                let data = this.todoDataList[i];
                this.todoDataList.splice(i, 1);
                item.checked ? this.todoDataList.unshift(data) : this.todoDataList.push(data);
                break;
            }
        }

        if (item.checked) {
            this.doneUlElement.insertBefore(node, this.doneUlElement.children[0]);
            this.doneListNum++;
            this.todoListNum--;
        } else {
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
    }
    // set todoListData(v) {

    // }

    contentChange(item: TodoListItem) {
        for (let i = 0; i < this.todoDataList.length; i++) {
            if (this.todoDataList[i].timeStamp === item.timeStamp) {
                this.todoDataList[i].content = item.content;
                break;
            }
        }
        this.dataChange();
    }

    dragStart(item: TodoListItem) { this.ItemDragStart = item; }
    dragEnter(item: TodoListItem) { this.ItemDragEnter = item }
    drop(item: TodoListItem) { console.log("sssssssssssssssssss", item.node) }
    dragEnd() {
        if (this.ItemDragStart !== this.ItemDragEnter) {
            let startValue = this.ItemDragStart.content
            for (let i = 0; i < this.todoDataList.length; i++) {
                if (this.ItemDragStart.timeStamp === this.todoDataList[i].timeStamp) {
                    this.ItemDragStart.contentBox.innerHTML = this.ItemDragEnter.content;
                    this.ItemDragStart.content = this.ItemDragEnter.content;
                    this.todoDataList[i].content = this.ItemDragEnter.content;
                } else if (this.ItemDragEnter.timeStamp === this.todoDataList[i].timeStamp) {
                    this.ItemDragEnter.contentBox.innerHTML = startValue;
                    this.ItemDragEnter.content = startValue;
                    this.todoDataList[i].content = startValue;
                }
            }
        }
        this.dataChange();
    }
}

class TodoListItem {
    public node: HTMLLIElement;
    public checked: boolean = false;
    public timeStamp: number;
    public content: string;

    private checkbox: HTMLInputElement;
    public contentBox: HTMLParagraphElement;
    private clearBtn: HTMLAnchorElement;
    constructor(private readonly data: TodoDada, private readonly parent: TodoList) {
        let template = `
                <input type="checkbox" ${this.data.doneFlag ? "checked" : ""} data-timeStamp="${this.data.timeStamp}"><p contenteditable>${this.data.content}</p><a href="javascript:void(0);" class="btn btn-delete fr" data-timeStamp="${this.data.timeStamp}">X</a>
            `;
        this.node = document.createElement("li") as HTMLLIElement;
        this.node.innerHTML = template;
        this.node.className = "item";
        this.node.draggable = true;

        this.checkbox = this.node.querySelector("input[type=checkbox]") as HTMLInputElement;
        this.contentBox = this.node.querySelector("p") as HTMLParagraphElement;
        this.clearBtn = this.node.querySelector("a.btn-delete") as HTMLAnchorElement;

        this.checked = data.doneFlag || false;
        this.timeStamp = data.timeStamp;
        this.content = data.content;
        this.bindEvent();
    }

    create() { }

    bindEvent() {
        let contentChangeTimer = null;
        let contentLength = 0;
        let oldContent = "";
        let _self = this;
        this.checkbox.onclick = () => this.done();
        this.clearBtn.onclick = () => this.remove();
        this.contentBox.onkeyup = () => {
            if (this.contentBox.innerHTML.length !== contentLength || this.contentBox.innerHTML !== oldContent) {
                clearTimeout(contentChangeTimer);
                this.node.style.backgroundColor = "#fff";
                this.clearBtn.style.color = "#abcdef";
                contentChangeTimer = setTimeout(() => {
                    this.contentChange();
                }, 600);
                oldContent = this.contentBox.innerHTML;
                contentLength = this.contentBox.innerHTML.length;
            } else {
                this.node.style.backgroundColor = "rgba(255, 181, 181,.7)";
                this.clearBtn.style.color = "#fff";
            }
        };

        this.node.ondragstart = () => this.drag("start");
        this.node.ondragenter = () => this.drag("enter");
        this.node.ondrop = () => this.drag("drop");
        this.node.ondragend = () => this.drag("end");
    }

    remove() {
        this.parent.removeItem(this);
    }

    done() {
        this.checked = !this.checked;
        this.parent.shift(this);
    }

    contentChange() {
        this.content = this.contentBox.innerHTML;
        this.parent.contentChange(this);
    }

    drag(flag: string) {
        switch (flag) {
            case "start": this.parent.dragStart(this); break;
            case "enter": this.parent.dragEnter(this); break;
            case "drop": this.parent.drop(this); break;
            case "end": this.parent.dragEnd(); break;
        }
    }
}

var todolist = new TodoList()