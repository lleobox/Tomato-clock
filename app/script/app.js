var app = angular.module("tomato", ["ngRoute"]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: "views/list.html",
            controller: "listController"
        })
        .when('/history', {
            templateUrl: "views/history.html",
            controller: "historyController"
        })
        .otherwise({
            redirectTo: "/"
        })
}]).config(function ($provide) {
    $provide.decorator('$window', function ($delegate) {
        Object.defineProperty($delegate, 'history', {
            get: function () {
                return null;
            }
        });
        return $delegate;
    });
}).run(function () {
    window.onresize = function () {
        document.querySelector('#container').style.height = (window.outerHeight - 70) + "px";
    };
});