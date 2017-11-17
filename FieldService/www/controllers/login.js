app.controller('loginController', function ($location, $state, $rootScope, $scope, $http, $compile, $timeout, uiCalendarConfig, cloudService, localService, valueService, constantService, $translate, ofscService) {

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

                $rootScope.Islogin = true;

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
                      
                        ofscService.activate_resource(data, function (response) {
                            console.log("ACTIVATE RESOURCE " + JSON.stringify(response));
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

                } else {

                    $rootScope.selectedItem = 1;

                    $state.go('myTask');
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

                            $rootScope.apicall = false;

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
