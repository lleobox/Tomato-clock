/**
 * Created by lleohao on 2016/3/24.
 */
var DBNAME = "tomato";

function extend(Child, Parent) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
}

/**
 * 封装chrome webapp 的localStorage 操作
 * @param dbName 数据库名
 * @param callback 回调函数，参数为当前操作的数据库
 * @constructor Store
 */
var Store;
Store = function (dbName, callback) {
    var data,
        dbName;

    callback = callback || function () {
        };

    dbName = this.__dbName = dbName;

    chrome.storage.local.get(dbName, function (storage) {
        if (dbName in storage) {
            callback.call(this, storage[dbName])
        } else {
            storage = {};
            storage[dbName] = {
                todo: [],       // 土豆列表
                history: [],    // 番茄历史列表
                setting: []
            };
            chrome.storage.local.set(storage, function () {
                callback.call(this, storage[dbName]);
            }.bind(this));
        }
    }.bind(this));
};

/**
 * 查找有限个内容
 * @param table string 指定查找的表名
 * @param query object 指定查找内容的属性
 * @param callback function 回调函数，返回查找到的内容数组
 */
Store.prototype.find = function (table, query, callback) {
    if (!callback) {
        return;
    }

    chrome.storage.local.get(this.__dbName, function (storge) {
        var result = storge[this.__dbName][table].filter(function (value) {
            for (var q in query) {
                return query[q] === value[q];
            }
        });
        callback.call(this, result);
    }.bind(this));
};

/**
 * 查找指定表中的所有内容
 * @param table string 指定查找的表名
 * @param callback function 回调函数，返回查找到的内容对象
 */
Store.prototype.findAll = function (table, callback) {
    callback = callback || function () {
        };
    chrome.storage.local.get(this.__dbName, function (storage) {
        callback.call(this, storage[this.__dbName][table]);
    }.bind(this));
};

/**
 * 保存内容
 * @param table string 指定保存的表名
 * @param id array 批量根据updateData修改对应内容,
 *           object 保存对象内容至数据库，会自动添加 id 属性
 * @param updateData object 需要修改的内容
 * @param callback function 回调函数，若为修改内容，则返回修改后的表
 *                                  若为新增内容，则返回新增的内容
 */
Store.prototype.save = function (table, id, updateData, callback) {
    chrome.storage.local.get(this.__dbName, function (storage) {
        var data = storage[this.__dbName],
            targetData = data[table];

        callback = callback || function () {
            };

        // id 给出则更新对应id的内容
        if (typeof id !== 'object' || Array.isArray(id)) {
            var ids = [].concat(id);
            ids.forEach(function (id) {
                for (var i = 0; i < targetData.length; i++) {
                    if (targetData[i].id == id) {
                        for (var x in updateData) {
                            targetData[i][x] = updateData[x];
                        }
                    }
                }
            });
            chrome.storage.local.set(storage, function () {
                chrome.storage.local.get(this.__dbName, function (storage) {
                    callback.call(this, storage[this.__dbName][table]);
                }.bind(this));
            }.bind(this));
        } else {
            callback = updateData;
            updateData = id;
            updateData.id = new Date().getTime();
            targetData.push(updateData);
            chrome.storage.local.set(storage, function () {
                callback.call(this, [updateData]);
            }.bind(this));
        }
    }.bind(this));
};

/**
 * 删除指定内容
 * @param table string 指定保存的表名
 * @param id array 需要删除内容的id集
 * @param callback 回调函数，返回删除后表
 */
Store.prototype.remove = function (table, id, callback) {
    chrome.storage.local.get(this.__dbName, function (storage) {
        var data = storage[this.__dbName],
            target = data[table];

        var ids = [].concat(id);
        ids.forEach(function (id) {
            for (var i = 0; i < target.length; i++) {
                if (target[i].id == id) {
                    target.splice(i, 1);
                    break;
                }
            }
        });

        chrome.storage.local.set(storage, function () {
            callback.call(this, target);
        }.bind(this));
    }.bind(this));
};

/**
 * 删除指定的表
 * @param table 指定删除的表名
 */
Store.prototype.drop = function (table) {
    chrome.storage.local.get(this.__dbName, function (storage) {
        var data = storage[this.__dbName];
        data[table] = [];

        chrome.storage.local.set(storage, function (storage) {
            console.log('drop ' + table + 'ok');
        });
    });

};

/**
 * 数据模型的基类
 * @constructor Model
 */
var Model = function () {
    this.storage = null;
    this.table = null;
};

/**
 * 读取相关表中的数据
 * @param query function 返回指定表中的全部内容，并回调这个函数
 *              string or number 返回指定id为query的内容
 *              object, 返回满足query的所有内容哦那个
 * @param callback function 回调函数，返回查找到的内容
 */
Model.prototype.read = function (query, callback) {
    var queryType = typeof query;
    callback = callback || function () {
        };

    if (queryType === 'function') {
        callback = query;
        return this.storage.findAll(this.table, callback);
    } else if (queryType === 'string' || queryType === 'number') {
        this.storage.find(this.table, {id: query}, callback);
    } else {
        this.storage.find(this.table, query, callback);
    }
};

/**
 * 更新数据
 * @param id string or number 指定更新内容的id
 * @param data object 需要更新的内容
 * @param callback function 回调函数，返回修改后的内容
 */
Model.prototype.updata = function (id, data, callback) {
    this.storage.save(this.table, id, data, callback);
};

/**
 * 删除指定id内容
 * @param id d string or number 指定内容的id
 * @param callback function 回调函数，返回修改后的内容
 */
Model.prototype.remove = function (id, callback) {
    this.storage.remove(this.table, id, callback);
};

/**
 * 删除指定表中的所有数据
 */
Model.prototype.removeAll = function () {
    this.storage.drop(this.table);
};

/**
 * 历史纪录的操作类
 * @param dbName string 指定数据库
 * @constructor HistoryModel
 * @extend Model
 */
var HistoryModel = function () {
    this.storage = new Store(DBNAME);
    this.table = 'history';
};
extend(HistoryModel, Model);

/**
 * 待办列表的操作类
 * @param dbName string 指定数据库
 * @constructor TodoModel
 * @extend Model
 */
var TodoModel = function () {
    this.storage = new Store(DBNAME);
    this.table = 'todo';
};
extend(TodoModel, Model);

/**
 * 系统设置保存
 * @param dbName string 指定数据库
 * @constructor SettingModel
 * @extend Model
 */
var SettingModel = function () {
    this.storage = new Store(DBNAME);
    this.table = "setting";
};
extend(SettingModel, Model);


TodoModel.prototype.create = function (title, callback) {
    title = title || "";
    callback = callback || function () {

        };

    var newItem = {
        title: title,
        completed: 0
    };

    this.storage.save(this.table, newItem, callback);
};

HistoryModel.prototype.create = function () {

};