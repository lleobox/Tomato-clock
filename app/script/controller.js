app.controller('startController', function ($rootScope, $scope, timeService, SettingService, NotificationsService) {
    $scope.time = {
        value: "00:00"
    };

    /**
     * 初始化倒计时时间
     * @param type 当前的状态
     */
    var init = function (type) {
        SettingService.read(function (result) {
            $scope.time.value = result[0][type] + ":00";
            $scope.$apply();
        });
    };
    init($rootScope.status.type);

    var notifyCallback = function (id, buttonIndex) {
        if (buttonIndex === 0) {
            $scope.start($rootScope.status.type);
        }

        chrome.notifications.clear(id);
    };
    chrome.notifications.onButtonClicked.addListener(notifyCallback);

    /**
     * 开启计时程序
     * @param type 当前的状态
     */
    $scope.start = function (type) {
        // 计时器图标状态
        $rootScope.status.underway = !$rootScope.status.underway;

        var _fn = timeService.start(type);

        $scope.timer = setInterval(function () {
            var count = _fn();
            if (count == -1) {
                clearInterval($scope.timer);
                end(type);
            } else {
                $scope.time.value = timeService.timeFormat(count);
                $scope.$apply();
            }
        }, 1000);
    };

    /**
     * 用户终止计时
     */
    $scope.stop = function (type) {
        $rootScope.status.underway = !$rootScope.status.underway;
        clearInterval($scope.timer);
        init(type);
    };

    // intervalCount， longRestTime， shortRestTime， workTime
    var end = function (type) {
        $rootScope.status.underway = !$rootScope.status.underway;

        if (type === "workTime") {
            // 工作时间转过来的， 次数加一
            $rootScope.status.workCount += 1;

            if ($rootScope.status.workCount != $rootScope.settingInfo.intervalCount) { // 未到长休息时间
                $rootScope.status.type = "shortRestTime"; // 转入短休息
            } else {
                $rootScope.status.type = "longRestTime";  // 转入长休息
            }
            // 显示休息通知
            NotificationsService.sendNotifications('work2rest');
        } else {
            // 统计休息次数
            if ($rootScope.status.type === 'shortRestTime') {
                $rootScope.status.shortRestCount += 1;
            } else {
                $rootScope.status.longRestCount += 1;
            }

            $rootScope.status.type = "workTime";

            // 显示工作通知
            NotificationsService.sendNotifications('rest2work');
        }
        init($rootScope.status.type);
    };

})
    .controller('listController', function ($rootScope, $scope, uiService, TodoService, StatusService) {
        // 保持高度自适应
        uiService.setHeight();

        $scope.todoList = {
            undo: [],
            does: []
        };

        $scope.getTodoList = function () {
            TodoService.read(function (result) {
                var today = Date.now(),
                    recently = result.filter(function (val) {
                        return (val.id - today) / (24 * 60 * 60 * 100) < 1;
                    });

                $scope.todoList.undo = recently.filter(function (val) {
                    return !val.completed;
                });
                $scope.todoList.does = recently.filter(function (val) {
                    return val.completed;
                });
                $scope.$apply();
            });
        };
        $scope.getTodoList();

        $scope.addItem = function ($event) {
            var keycode = $event.keyCode;
            // enter code 13
            if (keycode === 13) {
                TodoService.create($scope.title, $scope.getTodoList);
                $scope.title = "";
            }
        };

        $scope.completeItem = function ($event, type) {
            var target = $event.target,
                id = target.parentNode.id,
                update = null;

            // type === 1 => completed  0 => uncompleted
            if (type === 1) {
                update = {
                    completed: type,
                    workCount: $rootScope.status.workCount,
                    shortRestCount: $rootScope.status.shortRestCount,
                    longRestCount: $rootScope.status.longRestCount
                };
                StatusService.resetCount();
            } else {
                update = {
                    completed: type,
                    workCount: 0,
                    shortRestCount: 0,
                    longRestCount: 0
                }
            }

            TodoService.update(id, update, $scope.getTodoList);
        };

        $scope.deleteItem = function ($event) {
            var target = $event.target,
                id = target.parentNode.id;

            TodoService.remove(id, $scope.getTodoList);
        }
    })
    .controller('historyController', function ($scope, uiService) {
        uiService.setHeight();
        //@todo: 添加历史纪录功能
    })
    .controller('settingController', function ($rootScope, $scope, uiService, SettingService) {
        uiService.setHeight();

        $scope.changeValue = function (type) {
            var updateVal = {};
            updateVal[type] = $rootScope.settingInfo[type];

            SettingService.update("key", updateVal, function () {
            });
        }
    });