app.controller('indexController', function ($scope, $state, $timeout, $mdSidenav, $mdDialog, $translate, $rootScope, usSpinnerService, cloudService, localService, valueService, constantService, ofscService) {

    $scope.onlineStatus = false;

    if (valueService.getNetworkStatus()) {

        $scope.onlineStatus = true;

    } else {

        $scope.onlineStatus = false;
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
        valueService.setLanguage(lang);
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

            case "ch":

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

    $scope.sideNavItems = [{
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

                $rootScope.selectedCategory = 'Field Service'

                break;

            case "MyTask":

                $rootScope.showDebrief = false;

                $rootScope.showTaskDetail = false;

                $state.go("myFieldJob");

                $rootScope.selectedCategory = 'My Field Job';

                break;

            case "TaskOverview":

                $scope.taskOverview = true;

                $scope.myCalendar = false;

                $state.go("taskOverFlow");

                break;

            case "Debrief":

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

    $scope.menuIconClicked = function () {
        $scope.hideNavLeft = !$scope.hideNavLeft;
    }

    $scope.signout = function () {

        if (valueService.getNetworkStatus()) {

            // var db = sqlitePlugin.deleteDatabase({
            //     name: 'emerson.sqlite',
            //     location: 'default'
            // });

            constantService.onDeviceReady();

            $state.go('login');
        }
        else {
            $state.go('login');

        }
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

    

    $scope.syncFunctionality = function () {

        console.log("NETWORK " + valueService.getNetworkStatus());

        if (valueService.getNetworkStatus()) {

            localService.getAcceptTaskList(function (response) {

                angular.forEach(response, function (item) {

                    valueService.acceptTask(item.Task_Number);
                });
            });

            localService.getPendingTaskList(function (response) {

                angular.forEach(response, function (item) {

                    valueService.submitDebrief(item, item.Task_Number);
                });
            });

            cloudService.getTaskList(function (response) {

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

                cloudService.getExpenseType();
                cloudService.getNoteType();

                getAttachments();

                $state.reload();

                $state.go($state.current.name);

                window.location.reload(true);
            });
        }
    }

    $rootScope.Islogin = false;

    $scope.userName = "";

    $scope.login = function () {

        console.log($scope.userName);

        $rootScope.uName = $scope.userName;

        var baseData = $scope.userName.toLowerCase() + ":" + $scope.password;

        var authorizationValue = window.btoa(baseData);

        var data = {
            header: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + authorizationValue,
                'oracle-mobile-backend-id': constantService.getTaskBackId
            }
        };

        localService.deleteUser();

        cloudService.login(data, function (response) {

            if (response && response.message == null) {

                valueService.setResourceId(response['ID']);

                constantService.setResourceId(response['ID']);

                cloudService.getTechnicianProfile(function (response) {

                    var userObject = {
                        ID: response[0].ID,
                        ClarityID: response[0].ClarityID,
                        Currency: response[0].Currency,
                        Default_View: response[0].Default_View,
                        Email: response[0].Email,
                        Language: response[0].Language,
                        Name: response[0].Name,
                        OFSCId: response[0].OFSCId,
                        Password: response[0].Password,
                        Time_Zone: response[0].Time_Zone,
                        Type: response[0].Type,
                        User_Name: response[0].User_Name,
                        Work_Day: response[0].Work_Day,
                        Work_Hour: response[0].Work_Hour,
                        Last_updated: new Date()
                    };

                    localService.insertUser(userObject);

                    localService.getUser(function (response) {

                        console.log("USER =====> " + JSON.stringify(response));

                        constantService.setUser(response[0]);

                        valueService.setUser(response[0]);

                        var data = {
                            "resourceId": constantService.getUser().OFSCId,
                            "date": moment(new Date()).utcOffset(constantService.getTimeZone()).format('YYYY-MM-DD')
                        };
                        console.log(JSON.stringify(data));
                        ofscService.activate_resource(data, function (response) {

                            if (response != undefined && response != null) {

                                console.log("ACTIVATE RESOURCE " + JSON.stringify(response));
                            }
                        });

                        offlineGetCall();
                    });
                });

            } else {

                $scope.loginError = true;
            }
        });

        function offlineGetCall() {

            cloudService.getTaskList(function (response) {

                if (constantService.getUser().Default_View == "My Task") {

                    $rootScope.selectedItem = 2;

                    $state.go('myFieldJob');

                    $rootScope.Islogin = true;

                } else {

                    $rootScope.selectedItem = 1;

                    $state.go('myTask');

                    $rootScope.Islogin = true;
                }

                $rootScope.apicall = false;

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

                cloudService.getExpenseType();
                cloudService.getNoteType();

                getAttachments();
            });
        }

        console.log("Login API END");
    }

    function getAttachments() {

        cloudService.getFileIds(function (response) {

            if (response.Attachments_Info != undefined && response.Attachments_Info.length > 0) {

                angular.forEach(response.Attachments_Info, function (taskArray, value) {

                    angular.forEach(taskArray.Attachments, function (attachmentValue, value) {

                        download(attachmentValue, taskArray.Task_Id, function (response) {

                            // $rootScope.apicall = false;

                            $scope.attachmentArray = [];

                            var filePath = cordova.file.dataDirectory;

                            if (response != undefined && response != null) {

                                var base64Code = response;

                                valueService.saveBase64File(filePath, attachmentValue.User_File_Name, base64Code, attachmentValue.Content_type);

                                var attachmentObject = {
                                    Attachment_Id: attachmentValue.Attachments_Id,
                                    File_Path: filePath,
                                    File_Name: attachmentValue.User_File_Name,
                                    File_Type: attachmentValue.Content_type,
                                    Type: "O",
                                    AttachmentType: "O",
                                    Created_Date: attachmentValue.Date_Created,
                                    Task_Number: taskArray.Task_Id
                                };
                                $scope.attachmentArray.push(attachmentObject);

                                localService.insertAttachmentList($scope.attachmentArray);

                            }
                        });
                    });
                });
            }
        });
    }

    function download(resource, taskId, callback) {

        $rootScope.apicall = false;

        cloudService.downloadAttachment(taskId, resource.Attachments_Id, function (response) {

            if (response != undefined)
                callback(response.data);

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
