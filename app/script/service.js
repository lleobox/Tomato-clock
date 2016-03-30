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
            timeFormat: function (second) {
                var m = Math.floor(second / 60), s = second % 60;
                m = m < 10 ? "0" + m : "" + m;
                s = s < 10 ? "0" + s : "" + s;

                return m + ":" + s;
            }
        }
    })
    .service("TodoService", TodoModel)
    .service("SettingService", SettingModel)
    .service("HistoryService", HistoryModel);













































