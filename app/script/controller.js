app.controller('startController', function ($rootScope, $scope, timeService, SettingService) {
        $scope.time = {
            value: "00:00"
        };

        var setTime = function (type) {
            SettingService.read(function (result) {
                $scope.time.value = result[0][type] + ":00";
                $scope.$apply();
            });
        };
        setTime($rootScope.status.type);

        // intervalCount， longRestTime， shortRestTime， workTime
        var end = function () {
            $rootScope.status.underway = !$rootScope.status.underway;

            if ($rootScope.status.type === "workTime") {// 工作时间转过来的， 次数加一
                $rootScope.status.count += 1;

                if ($rootScope.status.count != $rootScope.settingInfo.intervalCount) { // 未到长休息时间
                    $rootScope.status.type = "shortRestTime"; // 转入短休息
                } else {
                    $rootScope.status.type = "longRestTime";  // 转入长休息
                }
            } else {
                $rootScope.status.type = "workTime";
            }
            setTime($rootScope.status.type);
        };

        $scope.start = function (type) {
            $rootScope.status.underway = !$rootScope.status.underway;

            var _fn = timeService.start(type);

            $scope.timer = setInterval(function () {
                var count = _fn();
                if (count == -1) {
                    clearInterval($scope.timer);
                    end();
                } else {
                    $scope.time.value = timeService.timeFormat(count);
                    $scope.$apply();
                }
            }, 200);
        };

        $scope.stop = function (type) {
            $rootScope.status.underway = !$rootScope.status.underway;
            clearInterval($scope.timer);
        };

    })
    .controller('listController', function ($scope, uiService, TodoService) {
        // 保持高度自适应
        uiService.setHeight();

        $scope.todoList = {
            undo: [],
            does: []
        };

        $scope.getTodoList = function () {
            TodoService.read(function (result) {
                var undo = result.filter(function (val) {
                        return !val.completed;
                    }),
                    does = result.filter(function (val) {
                        return val.completed;
                    });

                $scope.todoList.undo = undo;
                $scope.todoList.does = does;
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

        $scope.completeItem = function ($event) {
            var target = $event.target,
                id = target.parentNode.id;

            TodoService.updata(id, {
                completed: 1
            }, $scope.getTodoList);
        };

        $scope.deleteItem = function ($event) {
            var target = $event.target,
                id = target.parentNode.id;

            TodoService.remove(id, $scope.getTodoList);
        }
    })
    .controller('historyController', function ($scope, uiService) {
        uiService.setHeight();
    })
    .controller('settingController', function ($rootScope, $scope, uiService, SettingService, $timeout) {
        uiService.setHeight();

        $scope.changeValue = function () {
            var updataVal = {};
            for (i in $rootScope.settingInfo) {
                updataVal[i] = $rootScope.settingInfo[i];
            }

            SettingService.update("key", updataVal, function () {
            });
        }
    });




















