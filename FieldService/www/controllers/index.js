app.controller('indexController', function ($q, $scope, $state, $timeout, $mdSidenav, $mdDialog, $translate, $rootScope, usSpinnerService, cloudService, localService, valueService, constantService, ofscService) {

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
                $('#calendar').fullCalendar('destroy');
                $rootScope.eventInit("en");
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
                    $('#calendar').fullCalendar('destroy');
                    $rootScope.eventInit("ch");
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

        var promises = [];

        if (valueService.getNetworkStatus()) {

            $rootScope.apicall = true;

            var deferAccept = $q.defer();

            localService.getAcceptTaskList(function (response) {

                console.log("SYNC ACCEPT");

                deferAccept.resolve("Accept");

                angular.forEach(response, function (item) {

                    var deferred = $q.defer();

                    valueService.acceptTask(item.Task_Number, function (result) {

                        cloudService.OfscActions(item.Activity_Id, true, function (response) {

                            $rootScope.showAccept = false;

                            deferred.resolve("success");
                        });
                    });

                    promises.push(deferred.promise);
                });
            });

            promises.push(deferAccept.promise);

            var deferSubmit = $q.defer();

            localService.getPendingTaskList(function (response) {

                console.log("SYNC SUBMIT");

                deferSubmit.resolve("Submit");

                angular.forEach(response, function (item) {

                    var deferred = $q.defer();

                    valueService.submitDebrief(item, item.Task_Number, function (result) {

                        cloudService.OfscActions(item.Activity_Id, false, function (res) {

                        });

                        deferred.resolve("success");

                        console.log("DEBRIEF SUCCESS");
                    });

                    promises.push(deferred.promise);
                });
            });

            promises.push(deferSubmit.promise);

            console.log("PENDING UPDATE LENGTH " + promises.length);

            $q.all(promises).then(
                function (response) {

                    console.log("SYNC DATA");

                    cloudService.getTaskList(function (response) {

                        var promiseArray = [];

                        var deferInstall = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getInstallBaseList(function (result) {

                            console.log("INSTALL");

                            $rootScope.apicall = true;

                            deferInstall.resolve("success");
                        });

                        promiseArray.push(deferInstall.promise);

                        var deferContact = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getContactList(function (result) {

                            console.log("CONTACT");

                            $rootScope.apicall = true;

                            deferContact.resolve("success");
                        });

                        promiseArray.push(deferContact.promise);

                        var deferNote = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getNoteList(function (result) {

                            console.log("NOTES");

                            $rootScope.apicall = true;

                            deferNote.resolve("success");
                        });

                        promiseArray.push(deferNote.promise);

                        var deferOverTime = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getOverTimeList(function (result) {

                            console.log("OVERTIME");

                            $rootScope.apicall = true;

                            deferOverTime.resolve("success");
                        });

                        promiseArray.push(deferOverTime.promise);

                        var deferShiftCode = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getShiftCodeList(function (result) {

                            console.log("SHIFTCODE");

                            $rootScope.apicall = true;

                            deferShiftCode.resolve("success");
                        });

                        promiseArray.push(deferShiftCode.promise);

                        var deferChargeType = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getChargeType(function (result) {

                            console.log("CHARGETYPE");

                            $rootScope.apicall = true;

                            deferChargeType.resolve("success");
                        });

                        promiseArray.push(deferChargeType.promise);

                        var deferChargeMethod = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getChargeMethod(function (result) {

                            console.log("CHARGEMETHOD");

                            $rootScope.apicall = true;

                            deferChargeMethod.resolve("success");
                        });

                        promiseArray.push(deferChargeMethod.promise);

                        var deferFieldJob = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getFieldJobName(function (result) {

                            console.log("FIELDJOB");

                            $rootScope.apicall = true;

                            deferFieldJob.resolve("success");
                        });

                        promiseArray.push(deferFieldJob.promise);

                        var deferWorkType = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getWorkType(function (result) {

                            console.log("WORKTYPE");

                            $rootScope.apicall = true;

                            deferWorkType.resolve("success");
                        });

                        promiseArray.push(deferWorkType.promise);

                        var deferItem = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getItem(function (result) {

                            console.log("ITEM");

                            $rootScope.apicall = true;

                            deferItem.resolve("success");
                        });

                        promiseArray.push(deferItem.promise);

                        var deferCurrency = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getCurrency(function (result) {

                            console.log("CURRENCY");

                            $rootScope.apicall = true;

                            deferCurrency.resolve("success");
                        });

                        promiseArray.push(deferCurrency.promise);

                        var deferExpense = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getExpenseType(function (result) {

                            console.log("EXPENSETYPE");

                            $rootScope.apicall = true;

                            deferExpense.resolve("success");
                        });

                        promiseArray.push(deferExpense.promise);

                        var deferNoteType = $q.defer();

                        $rootScope.apicall = true;

                        cloudService.getNoteType(function (result) {

                            console.log("NOTETYPE");

                            $rootScope.apicall = true;

                            deferNoteType.resolve("success");
                        });

                        promiseArray.push(deferNoteType.promise);

                        console.log("LENGTH SYNC " + promiseArray.length);

                        $rootScope.apicall = true;

                        $q.all(promiseArray).then(
                            function (response) {

                                console.log("SYNC SUCCESS ALL");

                                $state.go($state.current, {}, {reload: true});

                                $rootScope.apicall = false;
                            },

                            function (error) {

                                console.log("SYNC FAILURE ALL");

                                $state.go($state.current, {}, {reload: true});

                                $rootScope.apicall = false;
                            }
                        );

                        getAttachments();
                    });
                },

                function (error) {

                }
            );
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
                'oracle-mobile-backend-id': constantService.getChargeBackId()
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

                var promiseArray = [];

                var deferInstall = $q.defer();

                $rootScope.apicall = true;

                cloudService.getInstallBaseList(function (result) {

                    console.log("INSTALL");

                    $rootScope.apicall = true;

                    deferInstall.resolve("success");
                });

                promiseArray.push(deferInstall.promise);

                var deferContact = $q.defer();

                $rootScope.apicall = true;

                cloudService.getContactList(function (result) {

                    console.log("CONTACT");

                    $rootScope.apicall = true;

                    deferContact.resolve("success");
                });

                promiseArray.push(deferContact.promise);

                var deferNote = $q.defer();

                $rootScope.apicall = true;

                cloudService.getNoteList(function (result) {

                    console.log("NOTES");

                    $rootScope.apicall = true;

                    deferNote.resolve("success");
                });

                promiseArray.push(deferNote.promise);

                var deferOverTime = $q.defer();

                $rootScope.apicall = true;

                cloudService.getOverTimeList(function (result) {

                    console.log("OVERTIME");

                    $rootScope.apicall = true;

                    deferOverTime.resolve("success");
                });

                promiseArray.push(deferOverTime.promise);

                var deferShiftCode = $q.defer();

                $rootScope.apicall = true;

                cloudService.getShiftCodeList(function (result) {

                    console.log("SHIFTCODE");

                    $rootScope.apicall = true;

                    deferShiftCode.resolve("success");
                });

                promiseArray.push(deferShiftCode.promise);

                var deferChargeType = $q.defer();

                $rootScope.apicall = true;

                cloudService.getChargeType(function (result) {

                    console.log("CHARGETYPE");

                    $rootScope.apicall = true;

                    deferChargeType.resolve("success");
                });

                promiseArray.push(deferChargeType.promise);

                var deferChargeMethod = $q.defer();

                $rootScope.apicall = true;

                cloudService.getChargeMethod(function (result) {

                    console.log("CHARGEMETHOD");

                    $rootScope.apicall = true;

                    deferChargeMethod.resolve("success");
                });

                promiseArray.push(deferChargeMethod.promise);

                var deferFieldJob = $q.defer();

                $rootScope.apicall = true;

                cloudService.getFieldJobName(function (result) {

                    console.log("FIELDJOB");

                    $rootScope.apicall = true;

                    deferFieldJob.resolve("success");
                });

                promiseArray.push(deferFieldJob.promise);

                var deferWorkType = $q.defer();

                $rootScope.apicall = true;

                cloudService.getWorkType(function (result) {

                    console.log("WORKTYPE");

                    $rootScope.apicall = true;

                    deferWorkType.resolve("success");
                });

                promiseArray.push(deferWorkType.promise);

                var deferItem = $q.defer();

                $rootScope.apicall = true;

                cloudService.getItem(function (result) {

                    console.log("ITEM");

                    $rootScope.apicall = true;

                    deferItem.resolve("success");
                });

                promiseArray.push(deferItem.promise);

                var deferCurrency = $q.defer();

                $rootScope.apicall = true;

                cloudService.getCurrency(function (result) {

                    console.log("CURRENCY");

                    $rootScope.apicall = true;

                    deferCurrency.resolve("success");
                });

                promiseArray.push(deferCurrency.promise);

                var deferExpense = $q.defer();

                $rootScope.apicall = true;

                cloudService.getExpenseType(function (result) {

                    console.log("EXPENSETYPE");

                    $rootScope.apicall = true;

                    deferExpense.resolve("success");
                });

                promiseArray.push(deferExpense.promise);

                var deferNoteType = $q.defer();

                $rootScope.apicall = true;

                cloudService.getNoteType(function (result) {

                    console.log("NOTETYPE");

                    $rootScope.apicall = true;

                    deferNoteType.resolve("success");
                });

                promiseArray.push(deferNoteType.promise);

                console.log("LENGTH LOGIN " + promiseArray.length);

                $rootScope.apicall = true;

                $q.all(promiseArray).then(
                    function (response) {

                        console.log("LOGIN SUCCESS ALL");

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
                    },

                    function (error) {

                        console.log("LOGIN FAILURE ALL");

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

                    }
                );

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

                                localService.insertAttachmentList($scope.attachmentArray, function (result) {
                                    // console.log("success")
                                });

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
