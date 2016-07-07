app
    .factory("uiService", function () {
        // 用于辅助界面样式的
        return {
            setHeight: function () {
                document.querySelector('#container').style.height = (window.outerHeight - 70) + "px";
            }
        }
    })
    .factory("timeService", function ($rootScope) {
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
    .service("HistoryService", HistoryModel)
    .service("NotificationsService", function () {
        var buttons = {
                work2rest: [
                    {'title': '休息'},
                    {'title': '再工作一会'}
                ],
                rest2work: [
                    {'title': '工作'},
                    {'title': '再休息一会'}
                ]
            },
            work2rest = {
                type: 'basic',
                iconUrl: '../icon/tomato_128.png',
                title: '番茄时钟',
                message: "工作完了，要休息吗？",
                buttons: buttons.work2rest,
                requireInteraction: true,
                isClickable: false
            },
            rest2work = {
                type: 'basic',
                iconUrl: '../icon/tomato_128.png',
                title: '番茄时钟',
                message: "休息完了，要工作吗？",
                buttons: buttons.rest2work,
                requireInteraction: true,
                isClickable: false
            };

        return {
            sendNotifications: function (type) {
                if (type === 'work2rest') {
                    chrome.notifications.create('work2rest', work2rest);
                } else {
                    chrome.notifications.create('rest2work', rest2work);
                }
            }
        }

    });













































