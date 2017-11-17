(function () {

    'use strict';

    app.factory('cloudService', cloudService);

    cloudService.$inject = ['$http', '$rootScope', '$window', '$location', 'localService', 'constantService', 'ofscService'];

    function cloudService($http, $rootScope, $window, $location, localService, constantService, ofscService) {

        var url = conf.apiUrl;

        var service = {};

        service.login = login;

        service.getTechnicianProfile = getTechnicianProfile;

        service.getTaskList = getTaskList;
        service.getInternalList = getInternalList;
        service.getInstallBaseList = getInstallBaseList;
        service.getContactList = getContactList;
        service.getNoteList = getNoteList;
        service.getProjectList = getProjectList;
        service.getFileIds = getFileIds;

        service.getOverTimeList = getOverTimeList;
        service.getShiftCodeList = getShiftCodeList;

        service.getChargeType = getChargeType;
        service.getChargeMethod = getChargeMethod;
        service.getFieldJobName = getFieldJobName;

        service.getWorkType = getWorkType;
        service.getItem = getItem;
        service.getCurrency = getCurrency;

        service.getExpenseType = getExpenseType;
        service.getNoteType = getNoteType;

        service.updateAcceptTask = updateAcceptTask;
        service.startTask = startTask;

        service.uploadTime = uploadTime;
        service.uploadExpense = uploadExpense;
        service.uploadMaterial = uploadMaterial;
        service.uploadNote = uploadNote;

        service.createAttachment = createAttachment;
        service.downloadAttachment = downloadAttachment;

        service.getTaskListCloud = getTaskListCloud;
        service.getInstallBaseListCloud = getInstallBaseListCloud;
        service.getContactListCloud = getContactListCloud;
        service.getNoteListCloud = getNoteListCloud;
        service.getProjectListCloud = getProjectListCloud;

        service.getOverTimeListCloud = getOverTimeListCloud;
        service.getShiftCodeListCloud = getShiftCodeListCloud;

        service.getChargeTypeCloud = getChargeTypeCloud;
        service.getChargeMethodCloud = getChargeMethodCloud;
        service.getFieldJobNameCloud = getFieldJobNameCloud;

        service.getWorkTypeCloud = getWorkTypeCloud;
        service.getItemCloud = getItemCloud;
        service.getCurrencyCloud = getCurrencyCloud;

        service.setCredentials = setCredentials;
        service.clearCredentials = clearCredentials;
        service.OfscActions = OfscActions;
        return service;

        function login(formData, callback) {

            console.log('Login Data', JSON.stringify(formData));

            return $http({

                method: 'GET',
                url: url + 'login_API/verify_login',
                headers: formData.header

            }).success(function (response) {

                console.log('Login Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('Login Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getTechnicianProfile(callback) {

            return $http({

                method: 'GET',
                url: url + 'Technician_Profile_Details/to_get_techpro?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getFieldBackId()
                }

            }).success(function (response) {

                console.log('Technician Response', JSON.stringify(response));

                callback(response.technicianProfile);

            }).error(function (error) {

                console.log('Technician Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getTaskList(callback) {

            var taskArray = [];

            var internalOFSCResponse = [];

            $http({

                method: 'GET',
                url: url + 'TaskDetails_Combined/Task_Details?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getTaskBackId()
                }

            }).success(function (response) {

                console.log("Task Response " + JSON.stringify(response.TaskDetails));

                getInternalList(function (internalresponse) {

                    angular.forEach(internalresponse, function (item) {

                        var internalOFSCJSONObject = {};

                        internalOFSCJSONObject.Start_Date = item.Start_time;
                        internalOFSCJSONObject.End_Date = item.End_time;
                        internalOFSCJSONObject.Type = "INTERNAL";
                        internalOFSCJSONObject.Customer_Name = item.Activity_type;
                        internalOFSCJSONObject.Task_Number = item.Activity_Id;

                        internalOFSCResponse.push(internalOFSCJSONObject);
                    });

                    angular.forEach(response.TaskDetails, function (item) {

                        item.Type = "CUSTOMER";

                        item.email = "";

                        item.Date = new Date();

                        taskArray.push(item);
                    });

                    localService.insertTaskList(taskArray, function (result) {

                        console.log("TASK");

                        angular.forEach(internalOFSCResponse, function (item) {

                            taskArray.push(item);
                        });

                        constantService.setTaskList(taskArray);

                        callback(taskArray);

                    });
                });

            }).error(function (error) {

                console.log("Task Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getInternalList(callback) {

            $http({

                method: 'POST',
                url: url + 'Internal_OFSC/get_ids',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                },
                data: {
                    "resourceId": constantService.getResourceId(),
                    "fromDate": moment(constantService.getStartDate()).format('YYYY-MM-DD'),
                    "toDate": moment(constantService.getEndDate()).format('YYYY-MM-DD')
                }

            }).success(function (response) {

                console.log("Internal Response " + JSON.stringify(response.activities));

                localService.insertInternalList(response.activities, function (result) {

                    console.log("INTERNAL");

                    localService.getInternalList(function (res) {

                        callback(res);
                    });
                });

            }).error(function (error) {

                console.log("Internal Error " + JSON.stringify(error));
            });
        }

        function getInstallBaseList(callback) {

            $http({

                method: 'GET',
                url: url + 'InstallBase/install_base?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                }

            }).success(function (response) {

                console.log("Install Base Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertInstallBaseList(response, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Install Base Error " + JSON.stringify(error));
            });
        }

        function getContactList(callback) {

            $http({

                method: 'GET',
                url: url + 'Contact/contacts_api?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Contact Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertContactList(response, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Contact Error " + JSON.stringify(error));
            });
        }

        function getNoteList(callback) {

            $http({

                method: 'GET',
                url: url + 'Notes/notes_api?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Note Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertNoteList(response, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Note Error " + JSON.stringify(error));
            });
        }

        function getProjectList() {

            $http({

                method: 'GET',
                url: url + 'Project_API/to_get_project?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Project Response " + JSON.stringify(response));

                localService.insertProjectList(response);

            }).error(function (error) {

                console.log("Project Error " + JSON.stringify(error));
            });
        }

        function getFileIds(callback) {

            $http({

                method: 'GET',
                url: url + 'FileID/to_getfileid?Id=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("FileID Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("FileID Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getOverTimeList(callback) {

            $http({

                method: 'GET',
                url: url + 'OverTImeShiftCode/to_get_overtimeshiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("OverTime Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertOverTimeList(response.OverTImeShiftCode, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("OverTime Error " + JSON.stringify(error));
            });
        }

        function getShiftCodeList(callback) {

            $http({

                method: 'GET',
                url: url + 'Shiftcode_API/to_get_shiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("ShiftCode Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertShiftCodeList(response.ShiftCode, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("ShiftCode Error " + JSON.stringify(error));
            });
        }

        function getChargeType(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeTypeLov/charge_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("ChargeType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertChargeTypeList(response.Charge_Type, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Charge Type Error " + JSON.stringify(error));
            });
        }

        function getChargeMethod(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeMethodLOV/chrgmthd?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("ChargeMethod Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertChargeMethodList(response.Charge_Method, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Charge Method Error " + JSON.stringify(error));
            });
        }

        function getFieldJobName(callback) {

            $http({

                method: 'GET',
                url: url + 'TaskName/to_get_taskname?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("FieldJob Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertFieldJobNameList(response.TaskName, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Field Job Error " + JSON.stringify(error));
            });
        }

        function getWorkType(callback) {

            $http({

                method: 'GET',
                url: url + 'workTypeLOV/work_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("WorkType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertWorkTypeList(response.Charge_Method, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("WorkType Error " + JSON.stringify(error));
            });
        }

        function getItem(callback) {

            $http({

                method: 'GET',
                url: url + 'Items_LOV/item_lov?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                }

            }).success(function (response) {

                console.log("Item Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertItemList(response.Charge_Method, function (result) {

                    callback("success");

                });

            }).error(function (error) {

                console.log("Item Error " + JSON.stringify(error));
            });
        }

        function getCurrency(callback) {

            $http({

                method: 'GET',
                url: url + 'CurrenciesLOV/get_currency?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Currency Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertCurrencyList(response.Charge_Method, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("Currency Error " + JSON.stringify(error));
            });
        }

        function getExpenseType(callback) {

            $http({

                method: 'GET',
                url: url + 'ExpenseTypeLOV/expense_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                }

            }).success(function (response) {

                console.log("ExpenseType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertExpenseTypeList(response.ExpenseType, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("ExpenseType Error " + JSON.stringify(error));
            });
        }

        function getNoteType(callback) {

            $http({

                method: 'GET',
                url: url + 'NotesTypeLOV/notes_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("NoteType Response " + JSON.stringify(response));

                $rootScope.apicall = true;

                localService.insertNoteTypeList(response.Notes_Type, function (result) {

                    callback("success");
                });

            }).error(function (error) {

                console.log("NoteType Error " + JSON.stringify(error));
            });
        }

        function updateAcceptTask(formData, callback) {

            console.log("Accept Task Data", JSON.stringify(formData));

            return $http({

                method: 'POST',
                url: url + 'UpdateTaskDetails/update',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                },
                data: formData

            }).success(function (response) {

                console.log("AcceptTask Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("AcceptTask Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function startTask(formData, callback) {

            console.log("Start Task Data", JSON.stringify(formData));

            return $http({

                method: 'POST',
                url: url + 'StartworkAPI/to_startwork?taskId=' + formData.taskId
                + '&taskStatus=' + formData.taskStatus,
                headers: formData.header

            }).success(function (response) {

                console.log("Start Task Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Start Task Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function createAttachment(attachment, callback) {

            $http({

                method: 'POST',
                url: url + 'Create_Attachment/attachment_create',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: attachment

            }).success(function (response) {

                console.log("Create Attachment Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Create Attachment Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function downloadAttachment(taskNumber, attachmentId, callback) {

            $http({

                method: 'GET',
                url: url + 'DownloadAttachment/tasks?taskId=' + taskNumber
                + '&fileAttachmentId=' + attachmentId,
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                // console.log("DownloadAttachment Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("DownloadAttachment Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function uploadTime(timedata, callback) {

            console.log("Time Data " + JSON.stringify(timedata));

            return $http({

                method: 'POST',
                url: url + 'Time_API/time_data',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getInternalBackId()
                },
                data: timedata

            }).success(function (response) {

                console.log("Upload Time Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Time Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function uploadExpense(expenseData, callback) {

            console.log("Expense Data " + JSON.stringify(expenseData));

            return $http({

                method: 'POST',
                url: url + 'Expense_API/expense_pull',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: expenseData

            }).success(function (response) {

                console.log("Upload Expense Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Expense Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function uploadMaterial(materialData, callback) {

            var urlWarranty = "Material_API/material_update";

            console.log("Material Data" + JSON.stringify(materialData));

            $http({

                method: 'POST',
                url: url + urlWarranty,
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: materialData

            }).success(function (response) {

                console.log("Upload Material Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Material Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function uploadNote(noteData, callback) {

            console.log("Note Data", JSON.stringify(noteData));

            return $http({

                method: 'POST',
                url: url + 'Update_Notes_API/to_update_notes',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: noteData

            }).success(function (response) {

                console.log("Upload Note Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Upload Note Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getTaskListCloud(formData, callback) {

            console.log("Task Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'TaskDetails/Resource_ID_taskdetails?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("Task Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Task Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getInstallBaseListCloud(formData, callback) {

            console.log("InstallBase Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'InstallBase/install_base?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("InstallBase Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("InstallBase Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getContactListCloud(formData, callback) {

            console.log("Contact Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'Contact/contacts_api?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("Contact Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Contact Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getNoteListCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'Notes/notes_api?resourceId=' + constantService.getResourceId()
                + '&fromDate=' + constantService.getStartDate()
                + '&toDate=' + constantService.getEndDate(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getTaskBackId()
                }

            }).success(function (response) {

                console.log("Note Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Note Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getProjectListCloud(formData, callback) {

            console.log("Project Cloud Data", JSON.stringify(formData));

            $http({

                method: 'GET',
                url: url + 'Project_API/to_get_project?resourceId=' + formData.resourceId
                + '&fromDate=' + formData.startDate
                + '&toDate=' + formData.endDate,
                headers: formData.header

            }).success(function (response) {

                console.log("Project Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("Project Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getOverTimeListCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'OverTImeShiftCode/to_get_overtimeshiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getShiftBackId()
                }

            }).success(function (response) {

                console.log("OverTime Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("OverTime Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getShiftCodeListCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'Shiftcode_API/to_get_shiftcode?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getShiftBackId()
                }

            }).success(function (response) {

                console.log("ShiftCode Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log("ShiftCode Cloud Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getChargeTypeCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeTypeLov/charge_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                // console.log("downloadAttachment Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);
            });
        }

        function getChargeMethodCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'ChargeMethodLOV/chrgmthd?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                // console.log("downloadAttachment Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);
            });
        }

        function getFieldJobNameCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'TaskName/to_get_taskname?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getFieldBackId()
                }

            }).success(function (response) {

                // console.log("downloadAttachment Cloud Response " + JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                callback(error);
            });
        }

        function getWorkTypeCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'workTypeLOV/work_type?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("WorkType Response " + JSON.stringify(response));

                callback(response);

                //  localService.insertWorkTypeList(response.Charge_Method);

            }).error(function (error) {

                console.log("WorkType Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getItemCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'Items_LOV/item_lov?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Item Response " + JSON.stringify(response));

                callback(response);

                //localService.insertItemList(response.Charge_Method);

            }).error(function (error) {

                console.log("Item Error " + JSON.stringify(error));

                callback(error);
            });
        }

        function getCurrencyCloud(callback) {

            $http({

                method: 'GET',
                url: url + 'CurrenciesLOV/get_currency?resourceId=' + constantService.getResourceId(),
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                }

            }).success(function (response) {

                console.log("Currency Response " + JSON.stringify(response));

                callback(response);

                //localService.insertCurrencyList(response.Charge_Method);

            }).error(function (error) {

                console.log("Currency Error " + JSON.stringify(error));

                callback(error);
            });
        }


        function setCredentials(email, password, userId) {

            var authData = Base64.encode(email + ':' + password);

            $rootScope.globals = {

                currentUser: {

                    email: email,
                    userId: userId,
                    authData: authData,
                    rootUrl: url
                },

                adminDetails: $rootScope.admin
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authData;

            // $cookieStore.put('advGlobalObj', $rootScope.globals);
        }


        function clearCredentials() {

            $rootScope.globals = {};

            // $cookieStore.remove('advGlobalObj');
        }

        function OfscActions(activateId, isAccept, callback) {
            var data = {
                "resourceId": constantService.getUser().OFSCId,
                "date": moment(new Date()).utcOffset(constantService.getTimeZone()).format('YYYY-MM-DD')
            };
            ofscService.activate_resource(data, function (response) {

                if (response != undefined && response != null) {

                    console.log("ACTIVATE RESOURCE " + JSON.stringify(response));

                    var updateStatus =
                        {
                            "activityId": activateId,
                            "XA_TASK_STATUS": "8"
                        }

                    ofscService.updateStatus(updateStatus, function (response) {

                        var activityDetails =
                            {
                                "activityId": activateId,

                            }

                        ofscService.activityDetails(activateId, function (response) {

                            if (response != undefined && response.items != undefined && response.items.length > 0) {
                                var startActivity = false
                                angular.forEach(response.items, function (item) {

                                    var date = new Date(item.date);

                                    if (date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
                                        startActivity = true
                                        var startActivityData =
                                            {
                                                "activityId": response.items[0].activityId,

                                            }
                                        console.log("startActivityData*****" + startActivityData.activityId)
                                        ofscService.start_activity(startActivityData, function (response) {

                                            if (!isAccept) {
                                                var complete = {"activityId": startActivityData.activityId}
                                                console.log("complete_activity*****" + complete.activityId)
                                                ofscService.complete_activity(complete, function (response) {
                                                    callback();
                                                })
                                            }
                                            else {
                                                callback();
                                            }
                                        })
                                    }
                                })
                                if (!startActivity) {

                                    callback();

                                }
                                //else if (!startActivity)
                                //{
                                //    ofscService.complete_activity(data, function (response) {
                                //        callback();
                                //    })
                                //}
                            }

                        })
                    })
                }
            });
        }
    }

    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {

            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        },

        decode: function (input) {

            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            var base64test = /[^A-Za-z0-9\+\/\=]/g;

            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {

                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();
