app.controller('startController', function ($scope, $timeout) {
        $scope.time = {
            now : new Date()
        };
        var updateClock = function () {
            $scope.time.now = new Date()
        };
        var timer = setInterval(function () {
            $scope.$apply(updateClock);
        }, 1000);
    })
    .controller('listController', function ($scope, uiService) {
        uiService.setHeight();
    })
    .controller('historyController', function ($scope, uiService) {
        uiService.setHeight();
    });

