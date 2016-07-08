var app = angular.module("tomato", ["ngRoute"]);

app
    .run(function ($rootScope, SettingService) {
        window.onresize = function () {
            document.querySelector('#container').style.height = (window.outerHeight - 70) + "px";
        };

        // 保存全局配置信息
        $rootScope.settingInfo = {};
        $rootScope.status = {
            type: "workTime",
            underway: false,
            workCount: 0,
            shortRestCount: 0,
            longRestCount: 0
        };
        SettingService.read(function (result) {
            for (var i in result[0]) {
                $rootScope.settingInfo[i] = result[0][i];
            }
        });
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: "views/list.html",
            controller: "listController"
        })
            .when('/history', {
                templateUrl: "views/history.html",
                controller: "historyController"
            })
            .when('/setting', {
                templateUrl: "views/setting.html",
                controller: "settingController"
            })
            .otherwise({
                redirectTo: "/list"
            })
    }])
    .config(function ($provide) {
        $provide.decorator('$window', function ($delegate) {
            Object.defineProperty($delegate, 'history', {
                get: function () {
                    return null;
                }
            });
            return $delegate;
        });
    });

app.filter('dateFilter', function () {
    return function (date) {
        var _d = new Date(date);
        return (_d.getMonth() + 1) + '月' + _d.getDate() + '日';
    }
});