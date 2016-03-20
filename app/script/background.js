/**
 * Created by lleohao on 2016/3/19.
 */
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("main.html", {
        id: "tomato-clock",
        bounds: {
            width: 800,
            height: 600,
        },
        minWidth: 800,
        minHeight: 600
    });
});