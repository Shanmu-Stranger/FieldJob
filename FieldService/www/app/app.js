'use strict';

var conf = {

    apiUrl: 'https://emersonmobilecloud-a472144.mobileenv.us2.oraclecloud.com:443/mobile/custom/'
};

var app = angular.module('emerson', ['ngMaterial', 'ngLoadingSpinner', 'md.data.table', 'ui.router', 'ui.bootstrap', 'ui.calendar', 'pascalprecht.translate', 'ngFileUpload']);

app.run(function ($rootScope, $location, $http, $state, localService, valueService, constantService) {

    window.addEventListener('offline', offLine);

    window.addEventListener('online', onLine);

    function onLine() {

        console.log("Online");

        valueService.setNetworkStatus(true);
    }

    function offLine() {

        console.log("Offline");

        valueService.setNetworkStatus(false);
    }

    $rootScope.local = true;

    $rootScope.online = false;

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

        localService.getUser(function (response) {

            console.log("USER =====> " + JSON.stringify(response));

            if (response.length > 0) {

                constantService.setUser(response[0]);

                valueService.setUser(response[0]);

                if (constantService.getUser().ID != null) {

                    if (constantService.getUser().Default_View == "My Task") {

                        $rootScope.selectedItem = 2;

                        $state.go('myFieldJob');

                    } else {

                        $state.go('myTask');
                    }

                } else {

                    $location.path('/login');
                }
            } else {

                $location.path('/login');
            }
        });

        // $rootScope.$on("$locationChangeStart", function (event, next, current) {
        //
        //     console.log("CHANGE LOCATION");
        //
        //
        // });
    }
});

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashBoard', '/dashBoard/myTask');

    $urlRouterProvider.otherwise('/login');

    $stateProvider.state("login", {
        url: "/login",
        controller: "loginController",
        templateUrl: "app/views/Login.html"
    })
    $stateProvider.state("dashBoard", {
        url: "/dashBoard",
        controller: "indexController",
        templateUrl: "app/views/dashBoard.html"
    })
    $stateProvider.state("myTask", {
        url: "/myTask",
        parent: 'dashBoard',
        controller: "myTaskController",
        templateUrl: "app/views/MyTask.html"
    })
    $stateProvider.state("myFieldJob", {
        url: "/myFieldJob",
        parent: 'dashBoard',
        controller: "myTaskController",
        templateUrl: "app/views/myFieldJob.html"
    })
    $stateProvider.state("debrief", {
        url: "/debrief",
        parent: 'dashBoard',
        controller: "debriefController",
        templateUrl: "app/views/Debrief.html"
    })
    $stateProvider.state("taskOverFlow", {
        url: "/taskOverFlow",
        parent: 'dashBoard',
        controller: "taskOverFlowController",
        templateUrl: "app/views/TaskOverflow.html"
    })
    $stateProvider.state("todo", {
        url: "/todo",
        parent: 'dashBoard',
        controller: "todoController",
        templateUrl: "app/views/Todo.html"
    })
    $stateProvider.state("material", {
        url: "/material",
        parent: 'dashBoard',
        controller: "taskOverFlowController",
        templateUrl: "app/views/Material.html"
    })
});

app.config(function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'app/data/locale-',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

});

app.filter('timezonefilter', function (constantService) {

    return function (date) {

        console.log("*******************" + constantService.getTimeZone());

        return moment(date).utcOffset(constantService.getTimeZone()).format("DD/MM/YYYY");
        // var convertedDate = new Date(date);
        // return $filter('date')(convertedDate, 'dd MMM yyyy');
    }
});

app.directive('signaturePad', ['$interval', '$timeout', '$window', '$rootScope', function ($interval, $timeout, $window, $rootScope) {

    'use strict';

    var signaturePad, element,
        EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjgAAADcCAQAAADXNhPAAAACIklEQVR42u3UIQEAAAzDsM+/6UsYG0okFDQHMBIJAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHADDAQwHMBwAwwEMB8BwAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEwHMBwAMMBMBzAcAAMBzAcwHAADAcwHADDAQwHMBwAwwEMB8BwAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcCQADAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHMBwAAwHMBwAwwEMBzAcAMMBDAfAcADDAQwHwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHMBwAAwHMBwAwwEMB8BwAMMBDAfAcADDATAcwHAAwwEwHMBwAAwHMBzAcAAMBzAcAMMBDAcwHADDAQwHwHAAwwEMB8BwAMMBMBzAcADDkQAwHMBwAAwHMBwAwwEMBzAcAMMBDAfAcADDAQwHwHAAwwEwHMBwAMMBMBzAcAAMBzAcwHAADAcwHADDAQwHMBwAwwEMB8BwAMMBMBzAcADDATAcwHAADAcwHMBwAAwHMBwAwwEMBzAcAMMBDAegeayZAN3dLgwnAAAAAElFTkSuQmCC';

    return {
        restrict: 'EA',
        replace: true,
        template: '<div class="signature" style="width: 100%; max-width:{{width}}px; height: 100%; max-height:{{height}}px;"><canvas style="display: block; margin: 0 auto;" ng-mouseup="onMouseup()" ng-mousedown="notifyDrawing({ drawing: true })"></canvas></div>',
        scope: {
            accept: '=?',
            clear: '=?',
            disabled: '=?',
            dataurl: '=?',
            height: '@',
            width: '@',
            notifyDrawing: '&onDrawing',
        },
        controller: ['$scope', function ($scope) {

            $scope.accept = function () {

                $rootScope.signature = $scope.dataurl;

                return {
                    isEmpty: $scope.dataurl === EMPTY_IMAGE,
                    dataUrl: $scope.dataurl
                };

            };

            $scope.onMouseup = function () {

                $scope.updateModel();

                $scope.notifyDrawing({
                    drawing: false
                });
            };

            $scope.updateModel = function () {

                $timeout().then(function () {

                    $scope.dataurl = $scope.signaturePad.isEmpty() ? EMPTY_IMAGE : $scope.signaturePad.toDataURL();
                });
            };

            $scope.clear = function () {
                $scope.signaturePad.clear();
                $scope.dataurl = EMPTY_IMAGE;
            };

            $scope.$watch("dataurl", function (dataUrl) {
                if (!dataUrl || $scope.signaturePad.toDataURL() === dataUrl) {
                    return;
                }

                $scope.setDataUrl(dataUrl);

            });
        }],
        link: function (scope, element, attrs) {

            var canvas = element.find('canvas')[0];
            var parent = canvas.parentElement;
            var scale = 0;
            var ctx = canvas.getContext('2d');

            var width = parseInt(scope.width, 10);
            var height = parseInt(scope.height, 10);

            canvas.width = width;
            canvas.height = height;

            scope.signaturePad = new SignaturePad(canvas);

            scope.setDataUrl = function (dataUrl) {
                var ratio = Math.max(window.devicePixelRatio || 1, 1);

                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(ratio, ratio);

                scope.signaturePad.clear();
                scope.signaturePad.fromDataURL(dataUrl);

                $timeout().then(function () {
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.scale(1 / scale, 1 / scale);
                });
            };

            scope.$watch('disabled', function (val) {
                val ? scope.signaturePad.off() : scope.signaturePad.on();
            });

            var calculateScale = function () {

                var scaleWidth = Math.min(parent.clientWidth / width, 1);
                var scaleHeight = Math.min(parent.clientHeight / height, 1);

                var newScale = Math.min(scaleWidth, scaleHeight);

                if (newScale === scale) {
                    return;
                }

                var newWidth = width * newScale;
                var newHeight = height * newScale;
                canvas.style.height = Math.round(newHeight) + "px";
                canvas.style.width = Math.round(newWidth) + "px";

                scale = newScale;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(1 / scale, 1 / scale);
            };

            var resizeIH = $interval(calculateScale, 200);
            scope.$on('$destroy', function () {
                $interval.cancel(resizeIH);
                resizeIH = null;
            });

            angular.element($window).bind('resize', calculateScale);
            scope.$on('$destroy', function () {
                angular.element($window).unbind('resize', calculateScale);
            });

            calculateScale();

            element.on('touchstart', onTouchstart);
            element.on('touchend', onTouchend);

            function onTouchstart(event) {
                scope.$apply(function () {
                    // notify that drawing has started
                    scope.notifyDrawing({
                        drawing: true
                    });
                });
                event.preventDefault();
            }

            function onTouchend(event) {
                scope.$apply(function () {
                    // updateModel
                    scope.updateModel();

                    // notify that drawing has ended
                    scope.notifyDrawing({
                        drawing: false
                    });
                });
                event.preventDefault();
            }
        }
    };
}]);
