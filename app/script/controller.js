app.controller('startController', function ($scope, timeService) {
        $scope.time = {
            now: new Date()
        };
        var updateClock = function () {
            $scope.time.now = new Date()
        };
        var timer = setInterval(function () {
            $scope.$apply(updateClock);
        }, 1000);

        $scope.startTomato = function () {
            clearInterval(timer);
            timeService.startTomato();
        }
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
    .controller('settingController', function ($scope, uiService, SettingService, $timeout) {
        uiService.setHeight();
        $scope.settingInfo = {};

        $scope.updata = function () {
            SettingService.read(function (result) {
                for (i in result[0]) {
                    $scope.settingInfo[i] = result[0][i];
                }
            });
        };
        $scope.updata();

        $scope.changeValue = function () {
            var updata = {};
            for (i in $scope.settingInfo) {
                updata[i] = $scope.settingInfo[i];
            }

            console.log(updata);
            SettingService.updata("key", updata, function () {
            });
        }
    });




















