app.factory("uiService", function () {
    // 用于辅助界面样式的
    return {
        setHeight: function () {
            document.querySelector('#container').style.height = (window.outerHeight - 70) + "px";
        }
    }
}).factory("timeService", function () {
    // 用于处理管理时间的服务
    return {}
});












































