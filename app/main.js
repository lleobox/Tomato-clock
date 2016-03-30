//noinspection JSCheckFunctionSignatures
/**
 * Created by lleohao on 2016/3/19.
 */
chrome.runtime.onInstalled.addListener(function () {
    var storage = {},
        dbName = "tomato";

    storage[dbName] = {
        todo: [],       // 土豆列表
        history: [],    // 番茄历史列表
        setting: [{
            id: "key",
            workTime: "2",
            shortRestTime: "1",
            longRestTime: "3",
            intervalCount: "2"
        }]
    };
    chrome.storage.local.set(storage, function () {
    });
});


chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create("main.html", {
        id: "tomato-clock",
        innerBounds: {
            width: 356,
            height: 360,
            minWidth: 356,
            maxWidth: 800,
            maxHeight: 600,
            minHeight: 360
        },
        frame: "none"
    });
});

