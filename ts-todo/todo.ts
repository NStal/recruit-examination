// export interface todoTab {
//     text: string;
//     status: boolean;
//     matter: number;
// }

// export interface storageTodo {
//     item: todoTab[]
// }
// import { TaskStorage } from "./taskStorage"
interface todoNorm {
    text: string;
    status: boolean;
    matter: number;
}

interface storageTodo {
    item: todoNorm[]
}

class TaskStorage {
    storageKey: string;
    storageArrayName: string;
    storageArray: todoNorm[];
    storageItem: todoNorm;
    taskKey: string;
    taskValue: string;
    index: number;
    // 初始化localstorage数组
    constructor(storageKey, storageArrayName) {
        this.storageKey = storageKey;
        this.storageArrayName = storageArrayName;

        this.storageArray = this.init();
    }
    init(): todoNorm[] {
        if (!localStorage.task) {
            window.localStorage.setItem(this.storageKey, `{"${this.storageArrayName}":[]}`);
        }
        console.log(localStorage[this.storageKey])
        return JSON.parse(localStorage[this.storageKey])[this.storageArrayName]

    }
    getItemArray(): todoNorm[] {
        console.log(this.storageArrayName)
        return JSON.parse(window.localStorage[this.storageKey])[this.storageArrayName]
    }

    addItem(item: todoNorm) {
        this.storageArray = this.getItemArray();
        this.storageArray.unshift(item);
        this.updata();
    }
    setValue(index, taskKey, taskValue) {
        this.storageArray = this.getItemArray();
        this.storageArray[index][taskKey] = taskValue;
        this.updata();
    }
    remove(index) {
        this.storageArray.splice(index, 1);
        this.updata()
    }
    updata() {
        let storageValue = {}
        storageValue[this.storageArrayName] = this.storageArray;
        console.log(storageValue)
        window.localStorage[this.storageKey] = JSON.stringify(storageValue)
    }
}

let StorageA = new TaskStorage('task', 'item')
let todos: todoNorm[] = JSON.parse(localStorage.task).item;

class Todo {
    item: todoNorm;
    dom: HTMLElement;
    constructor(option: todoNorm) {
        this.item = option;
    }

    public setDom() {
        let matterValue: string
        let matterColor: string
        switch (this.item.matter) {
            case (0):
                matterValue = '一般'
                matterColor = '#cccccc'
                break
            case (1):
                matterValue = '重要'
                matterColor = '#aaaaaa'
                break
            case (2):
                matterValue = '紧急'
                matterColor = '#888888'
                break
        }

        let domString = `<li class ='task'>
                        <span class = 'matter' style='background-color :${matterColor}'>${matterValue}</span>
                        <input type = 'checkbox'  ${this.item.status}>
                        <p>${this.item.text}</p>
                        <a href='#' class='delete' onclick = 'remove(this)'>删除</a>
                        </li>`;
        let div = document.createElement('div');
        div.innerHTML = domString;
        let task = <HTMLElement>div.childNodes[0];
        let taskMatter = <HTMLElement>task.querySelector('.matter');
        let p = <HTMLElement>task.querySelector('p');
        task.addEventListener('mouseenter', function (e) {
            detal.innerHTML = p.innerHTML;
        })
        p.addEventListener('mouseenter', function () {
            detal.style.display = 'block'
        })
        p.addEventListener('mouseleave', function () {
            detal.style.display = 'none'
        })
        let chebox = <HTMLInputElement>div.querySelector('[type="checkbox"]')
        if (this.item.status) {
            chebox.checked = true;
            addClass(task, 'full-task')
        } else {
            chebox.checked = false;
            removeClass(task, 'full-task')
        }
        chebox.addEventListener('click', () => {
            let taskList = <HTMLElement>document.getElementsByClassName('task-list')[0];
            let brothers = <HTMLCollection>document.getElementsByClassName('task');
            var index = <number>getIndex(brothers, chebox.parentElement);
            if (chebox.checked) {
                StorageA.setValue(index, 'status', true)
                addClass(task, 'full-task')
            } else {
                StorageA.setValue(index, 'status', false)
                removeClass(task, 'full-task')
            }
        })
        return task
    }

}

// 实例

let taskList = <HTMLElement>document.getElementsByClassName('task-list')[0];

function showInit(sortState) {
    taskList.innerHTML = '';
    let todoArray = StorageA.getItemArray()
    switch (sortState) {
        case (0):
            break;
        case (1):
            todoArray.sort((a, b) => {
                if (a.matter > b.matter) {
                    return -1
                } else if (a.matter < b.matter) {
                    return 1
                } else {
                    return 0
                }

            })
            break
        case (2):
            break
    }
    for (let i = 0; i < todoArray.length; i++) {
        let showTodo = new Todo(todoArray[i])
        taskList.appendChild(showTodo.setDom())
    }
}

showInit(0)

function remove(that: HTMLElement) {
    let taskList = <HTMLElement>document.getElementsByClassName('task-list')[0];
    let brothers = <HTMLCollection>document.getElementsByClassName('task');
    let index = <number>getIndex(brothers, <HTMLElement>that.parentElement);
    StorageA.remove(index);
    taskList.removeChild(<Node>that.parentNode);
}



let addBtn = <HTMLElement>document.getElementsByClassName('add-task')[0];
addBtn.addEventListener('click', () => {
    let inputValue = (<HTMLInputElement>document.querySelector('.task-input')).value;
    let tip = document.getElementsByClassName('tip')[0];
    console.log(inputValue.length)
    if (inputValue.length == 0) {
        console.log('空')
        tip.innerHTML = '提示：输入内容不能为空'
        return
    }
    (<HTMLInputElement>document.querySelector('.task-input')).value = ''
    let matter = (<HTMLSelectElement>document.querySelector('select')).selectedIndex;
    StorageA.addItem({ 'text': inputValue, 'status': false, 'matter': matter })
    let newTodo = new Todo({ 'text': inputValue, 'status': false, 'matter': matter });
    taskList.insertBefore(newTodo.setDom(), taskList.childNodes[0])
})

let input = <HTMLElement>document.getElementsByClassName('task-input')[0];
let detal = <HTMLElement>document.getElementsByClassName('detal')[0];
input.focus();
input.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        addBtn.click()
    }
})

taskList.addEventListener('mousemove', function (e) {
    detal.style.left = e.clientX + 20 + 'px'
    detal.style.top = e.clientY + 10 + 'px'
})

// 常用仿jq方法

function getIndex(brothers: HTMLCollection, target: HTMLElement) {
    for (let i = 0; i < brothers.length; i++) {
        if (brothers[i] == target) {
            return i;
        }
    }
}
function hasClass(obj: HTMLElement, cls: string) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj: HTMLElement, cls: string) {
    if (!hasClass(obj, name)) {
        obj.className = obj.className + ' ' + cls;
    }
}

function removeClass(obj: HTMLElement, cls: string) {
    if (hasClass(obj, cls)) {
        obj.className = obj.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), '')
    }
}

let sortState: number;
let defaultBtn = <HTMLElement>document.querySelector('.sort-default');
let starBtn = <HTMLElement>document.querySelector('.sort-star');
defaultBtn.addEventListener('click', () => {
    sortState = 0;
    showInit(sortState);
    onlyClass(defaultBtn, 'pattern-select')
})
starBtn.addEventListener('click', () => {
    sortState = 1;
    showInit(sortState);
    onlyClass(starBtn, 'pattern-select')
})

function onlyClass(tag: HTMLElement, className: string) {
    let siblingTag = tag.tagName;
    let sibling = tag.parentElement.getElementsByTagName(siblingTag);
    console.log(sibling)
    for (let i = 0; i < sibling.length; i++) {
        removeClass(<HTMLElement>sibling[i], className)
    }
    // let arr = []
    // arr.forEach.call(sibling, (element) => {
    //     console.log("array fuck", element)
    // });
    addClass(tag, className)

}
