import {storageTodo,todoTab} from "./model"
export class TaskStorage {
    storage:storageTodo;
    storageArray:todoTab[];
    index:number;
    storageItem:any;
    key:string;
    item:string;
    value:string;
    constructor(key,item){
        this.key = key;
        this.item = item;
        this.storage = JSON.parse(window.localStorage[key]);
        this.storageArray = this.storage.item;
      
    }

    setValue(index,key,value){
        this.storageItem = this.storageArray[index];
        this.storageItem[key] = value;
        this.updata();
    }
    remove(index){
        this.storageArray.splice(index,1);
        this.updata()
    }
    updata(){
        let key = this.key
        let item=this.item;
        window.localStorage[key] = JSON.stringify({item: this.storageArray})
    }
}