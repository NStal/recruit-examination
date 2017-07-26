"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskStorage = (function () {
    function TaskStorage(key, item) {
        this.key = key;
        this.item = item;
        this.storage = JSON.parse(window.localStorage[key]);
        this.storageArray = this.storage.item;
    }
    TaskStorage.prototype.setValue = function (index, key, value) {
        this.storageItem = this.storageArray[index];
        this.storageItem[key] = value;
        this.updata();
    };
    TaskStorage.prototype.remove = function (index) {
        this.storageArray.splice(index, 1);
        this.updata();
    };
    TaskStorage.prototype.updata = function () {
        var key = this.key;
        var item = this.item;
        window.localStorage[key] = JSON.stringify({ item: this.storageArray });
    };
    return TaskStorage;
}());
exports.TaskStorage = TaskStorage;
