app.controller('loginController', function ($scope, $compile, $timeout, uiCalendarConfig, $rootScope, $timeout, $state, $http, $translate, cloudService, localService, valueService, constantService, $translate,ofscService) {

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
                'oracle-mobile-backend-id': 'cc9a9b83-02ff-4be1-8b70-bccb3ac6c592'
            }
        };

        cloudService.login(data, function (response) {

            if (response && response.message == null) {

                $rootScope.Islogin = true;

                if ($rootScope.local) {

                    var userObject = {
                        ID: response['ID'],
                        User_Name: ""
                    };

                    localService.deleteUser();

                    localService.insertUser(userObject);
                }

                valueService.setResourceId(response['ID']);

                constantService.setResourceId(response['ID']);

                cloudService.getTechnicianProfile(function (response) {

                    // localService.updateUser()
                    constantService.setTimeZone(response.technicianProfile[0].Time_Zone)
                    if (response.technicianProfile["0"].Language == "English (US)") {

                        $translate.use('en').then(function () {

                            console.log('English Used ');
                        });

                    } else {

                        $translate.use('jp').then(function () {

                            console.log('Chinese Used');
                        });
                    }
                    var data = {
                        "resourceId" : response.technicianProfile["0"].OFSCId,
                        "date" : moment(new Date()).format('YYYY-MM-DD')

                    }
                    ofscService.activate_resource(data,function(response){
                        console.log(response);
                    })
                    /*constantService.setUserEmailId(response.technicianProfile["0"].Email);
                    console.log(constantService.getUserEmailId());*/
                    //Navigate To a View based on preference
                    if (response.technicianProfile["0"].Default_View == "My Task") {

                        $state.go('myFieldJob');
                        $rootScope.selectedItem=2;
                    }
                    $rootScope.uName=response.technicianProfile["0"].Name;
                    valueService.setUserType(response.technicianProfile["0"].Name, response);

                });

                if ($rootScope.local) {

                    offlineGetCall();

                } else {

                    $state.go('myTask');
                }

            } else {

                // alert('Please verify the UserName or Password.')
                $scope.loginError = true;
            }
        });

        function offlineGetCall() {

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

                // getAttachments();

                // localService.getOverTimeList("966", function (response) {
                //
                //     debrief.overTime = response;
                // });
                //
                // localService.getShiftCodeList(taskObject.Task_Number, function (response) {
                //
                //     debrief.shiftCode = response;
                // });
                //
                // localService.getChargeMethodList(function (response) {
                //
                //     debrief.chargeMethod = response;
                // });
                //
                // localService.getChargeTypeList(function (response) {
                //
                //     debrief.chargeType = response;
                // });
                //
                // localService.getFieldJobNameList(function (response) {
                //
                //     debrief.fieldName = response;
                // });

                $state.go('myTask');

            });
        }

        console.log("Login API END");
    }

    function getAttachments() {

        cloudService.getFileIds(function (response) {

            if (response.Attachments_Info != undefined && response.Attachments_Info.length > 0) {

                angular.forEach(response.Attachments_Info, function (taskArray, value) {

                    angular.forEach(taskArray.Attachments, function (attachmentValue, value) {

                        $scope.attachmentArray = [];

                        download(attachmentValue, taskArray.Task_Id, function (response) {

                            var filePath = cordova.file.dataDirectory;

                            var base64Code = response;

                            valueService.saveBase64File(filePath, attachmentValue.User_File_Name, base64Code, attachmentValue.Content_type);

                            var attachmentObject = {
                                Attachment_Id: attachmentValue.Attachments_Id,
                                File_Path: filePath,
                                File_Name: attachmentValue.User_File_Name,
                                File_Type: attachmentValue.Content_type,
                                Type: "O",
                                Task_Number: taskArray.Task_Id
                            };

                            $scope.attachmentArray.push(attachmentObject);
                        });

                        localService.insertAttachmentList($scope.attachmentArray);
                    });
                });
            }
        });
    }

    function download(resource, taskId, callback) {

        cloudService.downloadAttachment(taskId, resource.Attachments_Id, function (response) {

            callback(response.data);
        });
    }
});
