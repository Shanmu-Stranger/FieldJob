'use strict';

var conf = {

     apiUrl: 'https://emersonmobilecloud-a472144.mobileenv.us2.oraclecloud.com:443/mobile/custom/'
    //apiUrl: 'https://emersonmobiletestenv-a472144.mobileenv.us2.oraclecloud.com:443/mobile/custom/'
};

var app = angular.module('emerson', ['ngMaterial', 'ngLoadingSpinner', 'md.data.table', 'ui.router', 'ui.bootstrap', 'ui.calendar', 'pascalprecht.translate', 'ngFileUpload']);

app.run(function ($rootScope, $location, $http, $state, localService, valueService, constantService) {

    $rootScope.local = true;

    $rootScope.online = false;

    window.addEventListener('offline', offLine);

    window.addEventListener('online', onLine);

    $rootScope.apicall = true;

    function onLine() {

        console.log("Online");

        valueService.setNetworkStatus(true);
    }

    function offLine() {

        console.log("Offline");

        valueService.setNetworkStatus(false);
    }

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

        function checkConnection() {

            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            console.log('Connection type: ' + states[networkState]);

            if (networkState === Connection.NONE) {

                valueService.setNetworkStatus(false);

            } else {

                valueService.setNetworkStatus(true);
            }
        }

        checkConnection();

        localService.getUser(function (response) {

            console.log("USER =====> " + JSON.stringify(response));

            if (response.length > 0) {

                constantService.setUser(response[0]);

                valueService.setUser(response[0]);

                if (constantService.getUser().ID !== null) {

                    valueService.setResourceId(constantService.getUser().ID);

                    constantService.setResourceId(constantService.getUser().ID);

                    if (constantService.getUser().Default_View == "My Task") {

                        $rootScope.selectedItem = 2;

                        localService.getTaskList(function (response) {

                            console.log("TASK MY FIELD JOB =====> " + JSON.stringify(response));

                            localService.getInternalList(function (internalresponse) {

                                angular.forEach(internalresponse, function (item) {

                                    var internalOFSCJSONObject = {};

                                    internalOFSCJSONObject.Start_Date = item.Start_time;
                                    internalOFSCJSONObject.End_Date = item.End_time;
                                    internalOFSCJSONObject.Type = "INTERNAL";
                                    internalOFSCJSONObject.Customer_Name = item.Activity_type;
                                    internalOFSCJSONObject.Task_Number = item.Activity_Id;

                                    response.push(internalOFSCJSONObject);
                                });

                                constantService.setTaskList(response);

                                $state.go('myFieldJob');

                            });
                        });

                    } else {

                        localService.getTaskList(function (response) {

                            console.log("TASK MY TASK =====> " + JSON.stringify(response));

                            localService.getInternalList(function (internalresponse) {

                                angular.forEach(internalresponse, function (item) {

                                    var internalOFSCJSONObject = {};

                                    internalOFSCJSONObject.Start_Date = item.Start_time;
                                    internalOFSCJSONObject.End_Date = item.End_time;
                                    internalOFSCJSONObject.Type = "INTERNAL";
                                    internalOFSCJSONObject.Customer_Name = item.Activity_type;
                                    internalOFSCJSONObject.Task_Number = item.Activity_Id;

                                    response.push(internalOFSCJSONObject);
                                });

                                constantService.setTaskList(response);

                                $state.go('myTask');

                            });
                        });
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
        controller: "indexController",
        templateUrl: "app/views/Login.html"
    });
    $stateProvider.state("dashBoard", {
        url: "/dashBoard",
        controller: "indexController",
        templateUrl: "app/views/dashBoard.html"
    });
    $stateProvider.state("myTask", {
        url: "/myTask",
        // parent: 'dashBoard',
        controller: "myTaskController",
        templateUrl: "app/views/MyTask.html"
    });
    $stateProvider.state("myFieldJob", {
        url: "/myFieldJob",
        // parent: 'dashBoard',
        controller: "myTaskController",
        templateUrl: "app/views/myFieldJob.html"
    });
    $stateProvider.state("debrief", {
        url: "/debrief",
        // parent: 'dashBoard',
        controller: "debriefController",
        templateUrl: "app/views/Debrief.html"
    });
    $stateProvider.state("taskOverFlow", {
        url: "/taskOverFlow",
        // parent: 'dashBoard',
        controller: "taskOverFlowController",
        templateUrl: "app/views/TaskOverflow.html"
    });
    $stateProvider.state("todo", {
        url: "/todo",
        // parent: 'dashBoard',
        controller: "todoController",
        templateUrl: "app/views/Todo.html"
    });
    $stateProvider.state("material", {
        url: "/material",
        // parent: 'dashBoard',
        controller: "taskOverFlowController",
        templateUrl: "app/views/Material.html"
    });
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

        // console.log("*******************" + constantService.getTimeZone());

        if (date === "" || date === undefined)
            return date;

        return moment(date).format("DD/MM/YYYY");
        // var convertedDate = new Date(date);
        // return $filter('date')(convertedDate, 'dd MMM yyyy');
    }
});
app.directive('dateFormat', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            //ctrl.$formatters.unshift(function (a) {
            //    return "06:00";
            //});


            ctrl.$parsers.unshift(function (viewValue) {
                //var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                //elem.val($filter(attrs.format)(plainNumber));
                //return plainNumber;
                if (viewValue !== undefined && viewValue !== "") {
                    if (viewValue.length == 2) {
                        viewValue = viewValue + ":";
                        elem.val(viewValue);
                    }
                    if (viewValue.length > 5) {
                        viewValue = viewValue.substring(0, 5);
                        elem.val(viewValue)
                    }
                    //if (viewValue.split(":")[0] != undefined && viewValue.split(":")[0].length == 1) {
                    //    var hours = "0" + viewValue.split(":")[0]
                    //    viewValue = hours + ":" + viewValue.split(":")[1]
                    //}
                    //if (viewValue.split(":")[1] != undefined && viewValue.split(":")[1].length == 1) {
                    //    var mins = "0" + viewValue.split(":")[1]
                    //    viewValue = viewValue.split(":")[0] + ":" + mins
                    //}
                    //if (viewValue.split(":")[1] != undefined && viewValue.split(":")[1] != "undefined" && viewValue.split(":")[1].length > 2) {
                    //    var mins = viewValue.split(":")[1].substring(0, 2);
                    //    viewValue = viewValue.split(":")[0] + ":" + mins
                    //}
                    //if (viewValue.split(":")[1] == undefined || viewValue.split(":")[1] == "undefined") {
                    //    viewValue = viewValue.split(":")[0] + ":00";
                    //}
                }


                return viewValue;
            });
        }
    };
});
app.directive('signaturePad', ['$interval', '$timeout', '$window', '$rootScope', 'constantService', function ($interval, $timeout, $window, $rootScope, constantService) {

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
                var stagesSign = constantService.getStagesArray();
                switch (stagesSign.title) {
                    case 'Engineer Signature':
                        $rootScope.Engsignature = $scope.dataurl;
                        break;
                    case 'Customer Signature':
                        $rootScope.customersignature = $scope.dataurl;
                        break;
                    default:
                        break;
                }
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
                var stagesSign = constantService.getStagesArray();
                switch (stagesSign.title) {
                    case 'Engineer Signature':
                        $rootScope.engineerSignTime = new Date().toLocaleString();
                        break;
                    case 'Customer Signature':
                        $rootScope.customerSignTime = new Date().toLocaleString();
                        break;
                    default:
                        break;
                }
            };

            $scope.updateModel = function () {

                $timeout().then(function () {

                    $scope.dataurl = $scope.signaturePad.isEmpty() ? EMPTY_IMAGE : $scope.signaturePad.toDataURL();
                    var stagesSign = constantService.getStagesArray();
                    switch (stagesSign.title) {
                        case 'Engineer Signature':
                            $rootScope.Engsignature = $scope.dataurl;
                            break;
                        case 'Customer Signature':
                            $rootScope.customersignature = $scope.dataurl;
                            break;
                        default:
                            break;
                    }
                });
            };

            $scope.clear = function () {
                $scope.signaturePad.clear();
                $scope.dataurl = EMPTY_IMAGE;
                var stagesTime = constantService.getStagesArray();
                switch (stagesTime.title) {
                    case 'Engineer Signature':
                        $rootScope.engineerSignTime = '';
                        $rootScope.Engsignature = '';
                        break;
                    case 'Customer Signature':
                        $rootScope.customerSignTime = '';
                        $rootScope.customersignature = '';
                        break;
                    default:
                        break;
                }
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

app.config(['$httpProvider', function ($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);
