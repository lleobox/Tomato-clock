app
    .factory("uiService", function () {
        // 用于辅助界面样式的
        return {
            setHeight: function () {
                document.querySelector('#container').style.height = (window.outerHeight - 70) + "px";
            }
        }
    })
    .factory("timeService", function ($rootScope, SettingService) {
        return {
            // 格式化时间
            timeFormat: function (second) {
                var m = Math.floor(second / 60), s = second % 60;
                m = m < 10 ? "0" + m : "" + m;
                s = s < 10 ? "0" + s : "" + s;

                return m + ":" + s;
            },
            // 倒计时启动
            start: function (type) {
                var count = parseInt($rootScope.settingInfo[type]) * 60;

                return function () {
                    count -= 1;
                    return count;
                }
            },
            // 倒计时停止
            stop: function () {

            }
        }
    })
    .service("TodoService", TodoModel)
    .service("SettingService", SettingModel)
    .service("HistoryService", HistoryModel);













































