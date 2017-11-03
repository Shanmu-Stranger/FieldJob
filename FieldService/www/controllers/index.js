app.controller('indexController', function ($scope, $state, $timeout, $mdSidenav, $mdDialog, $translate, $rootScope, usSpinnerService, valueService, localService, cloudService) {


    // if (window.navigator.onLine) {
    //
    //     onLine();
    //
    // } else if (window.navigator.offLine) {
    //
    //     offLine();
    // }

    window.addEventListener('offline', offLine);

    window.addEventListener('online', onLine);

    function onLine() {

        console.log("Online");

        $scope.onlineStatus = true;

        valueService.setNetworkStatus(true);
    }

    function offLine() {

        console.log("Offline");

        $scope.onlineStatus = false;

        valueService.setNetworkStatus(false);
    }

    if (valueService.getNetworkStatus()) {

        localService.getAcceptTaskList(function (response) {

            angular.forEach(response, function (item) {

                valueService.acceptTask(item.Task_Number);

            });
        });
    }

    if (valueService.getNetworkStatus()) {

        localService.getPendingTaskList(function (response) {

            angular.forEach(response, function (item) {

                valueService.submitDebrief(item.Task_Number);

            });
        });
    }

    $scope.spinnerLoading = true;

    $rootScope.closed = false;

    $rootScope.selectedCategory = 'Field Service';

    $scope.collapsedClass = "";

    $scope.franceFlag = true;

    $scope.chinaFlag = true;

    $scope.stopSpin = function () {

        console.log('Stop Spinner');

        usSpinnerService.stop('spinner-1');
    };

    $scope.openLeftMenu = function () {

        console.log('show');

        $mdSidenav('left').toggle();
    };

    $scope.changeLanguage = function (lang) {

        switch (lang) {

            case "en":

                $scope.usFlag = false;
                $scope.franceFlag = true;
                $scope.chinaFlag = true;
                $translate.use('en').then(function () {
                    console.log('English Used');
                });

                break;

            case "fr":

                $scope.usFlag = true;
                $scope.franceFlag = false;
                $scope.chinaFlag = true;
                $translate.use('fr').then(function () {
                    console.log('french Used');
                });

                break;

            case "ch" :

                $scope.usFlag = true;
                $scope.franceFlag = true;
                $scope.chinaFlag = false;
                $translate.use('jp').then(function () {
                    console.log('Chinese Used');
                });

                break;

            default:
                break;
        }
    }

    $scope.sideNavItems = [
        {
            id: 1,
            displayName: "My Calendar",
            name: "MyCalendar",
            controller: "myTask",
            image: "images/calendar/Rectangle8.png",
            imageSelected: "images/calendar/Rectangle8copy.png"
        },
        {
            id: 2,
            displayName: "My Field Job",
            name: "MyTask",
            controller: "myTask",
            image: "images/mytask/Shape36.png",
            imageSelected: "images/mytask/myTaskSel.png"
        },
        {
            id: 3,
            displayName: "Field Job Overview",
            name: "TaskOverview",
            controller: "taskOverflow",
            image: "images/taskoverview/taskoverview.png",
            imageSelected: "images/taskoverview/taskOverflowSel.png"
        },
        {
            id: 4,
            displayName: "Debrief",
            name: "Debrief",
            controller: "debrief",
            image: "images/debrief/brief copy.png",
            imageSelected: "images/debrief/brief.png"
        }
    ];

    $rootScope.selectedItem = $scope.sideNavItems[0].id;

    $scope.menuClick = function (item) {

        $rootScope.selectedItem = item.id;

        $rootScope.tabClicked = true;

        $rootScope.columnclass = "col-sm-11";

        switch (item.name) {

            case "MyCalendar":

                $scope.myCalendar = true;

                $scope.taskOverview = false;

                $rootScope.showDebrief = false;

                $rootScope.showTaskDetail = false;

                $state.go(item.controller);

                /*if ($('.showTaskList').is(":visible")) {

                    $('.showTaskList').hide();
                    $('.fc-view-container').show();
                    $('#calendar > div.fc-toolbar.fc-header-toolbar > div.fc-center > div').show();
                    $('.fc-toolbar.fc-header-toolbar').show();
                    $('.showMonth').show();
                }*/

                $rootScope.selectedCategory = 'Field Service'

                break;

            case "MyTask":

                $rootScope.showDebrief = false;

                $rootScope.showTaskDetail = false;

                $state.go("myFieldJob");

                /* setTimeout(function () {

                     $('.fc-view-container').hide();
                     $('#calendar > div.fc-toolbar.fc-header-toolbar > div.fc-center > div').hide();
                     $('.fc-toolbar.fc-header-toolbar').hide();
                     $('.showMonth').hide();
                     $('.showTaskList').show();
                 }, 100);*/

                $rootScope.selectedCategory = 'My Field Job';

                break;

            case "TaskOverview":

                $scope.taskOverview = true;

                $scope.myCalendar = false;

                $state.go("taskOverFlow");

                break;

            case "Debrief" :

                $scope.taskOverview = true;

                $scope.myCalendar = false;

                $state.go(item.controller);

                $rootScope.selectedCategory = 'Debrief'

            default:
                break;
        }
    }

    $scope.menuToggle = function () {

        if ($rootScope.closed == true) {

            $rootScope.closed = false;
            $scope.collapsedClass = ""

        } else {

            $rootScope.closed = true;
            $scope.collapsedClass = "collapsed"
        }
    }

    $scope.signout = function () {

        // localService.deleteUser();

        // var db = sqlitePlugin.deleteDatabase({name: 'emerson.sqlite', location: 'default'});

        $state.go('login');
    }

    $scope.export2PDF = function () {

        html2canvas(document.getElementById('exportthis'), {

            onrendered: function (canvas) {

                var data = canvas.toDataURL();

                var docDefinition = {

                    content: [{
                        image: data,
                        width: 500,
                    }]
                };

                pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
            }
        });
    }

    $scope.saveValues = function () {

        valueService.saveValues();
    }

    //  window.addEventListener("online", onLine, false);
    //
    //  window.addEventListener("offline", offLine, false);

    $scope.syncFunctionality = function () {
        console.log("Inside the syncFunctionality");


        cloudService.getTaskList(function (response) {

            localService.deleteInstallBase();
            localService.deleteNote();
            localService.deleteContact();
            localService.deleteShiftCode();
            localService.deleteOverTime();
            localService.deleteFieldJobName();

            cloudService.getInstallBaseList();
            cloudService.getContactList();
            cloudService.getNoteList();

            cloudService.getOverTimeList();
            cloudService.getShiftCodeList();

            cloudService.getChargeType();
            cloudService.getChargeMethod();
            cloudService.getFieldJobName();

            cloudService.getWorkType();
            cloudService.getItem();
            cloudService.getCurrency();

            $state.go('myTask');
        });
    }

});

//$scope.changeLanguage();

/*$(function (){
   $("[data-toggle = 'popover']").popover({
         'placement': 'bottom',
         'animation': true,
         'html': true,
         'title' : getPopoverCustomTitle(),
         'content': getPopoverCustomContent()
     });
});

function getPopoverCustomTitle() {
// return '<div class="popover ' + className + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
return '<div class="popover-custom-title"><label>Alex</label><label>Field Engineer</label><label>Sign Out</label></div>';
}

function getPopoverCustomContent() {
// return '<div class="popover ' + className + '" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
return '<div class="popover-custom-content"><label>Select your Language</label><br><hr><img src="images/Layer 10.png" ng-click="changeLanguage()"><img src="images/Layer 12.png" ng-click="changeLanguage()"></div>';
}*/
