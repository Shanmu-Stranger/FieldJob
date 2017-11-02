(function () {

    'use strict';

    app.service('valueService', valueService);

    valueService.$inject = ['$http', '$rootScope', '$window', '$location', 'localService', 'cloudService'];

    function valueService($http, $rootScope, $window, $location, localService, cloudService) {

        var futureTask;

        var service = {};

        var resourceId = null;

        var userObject = {};

        var warrantyType = null;

        var taskId = null;

        var header = null;

        var networkStatus = false;

        var debrief = {
            task: {},
            installBase: {},
            time: [],
            expense: [],
            material: [],
            notes: [],
            attachment: [],
            engineer: {},
            overTime: [],
            shiftCode: [],
            chargeType: [],
            chargeMethod: [],
            fieldName: [],
            workType: [],
            item: [],
            currency: []
        };

        var userType = {
            name: '',
            clarityType: '',
            defaultView: '',
            duration: ''
        };

        service.setResourceId = setResourceId;
        service.getResourceId = getResourceId;

        service.setUser = setUser;
        service.getUser = getUser;

        service.setUserType = setUserType;
        service.getUserType = getUserType;

        service.setHeader = setHeader;
        service.getHeader = getHeader;

        service.setTask = setTask;
        service.getTask = getTask;

        service.setInstallBase = setInstallBase;
        service.getInstallBase = getInstallBase;

        service.setTaskId = setTaskId;
        service.getTaskId = getTaskId;

        service.setTime = setTime;
        service.getTime = getTime;

        service.setExpense = setExpense;
        service.getExpense = getExpense;

        service.setMaterial = setMaterial;
        service.getMaterial = getMaterial;

        service.setNote = setNote;
        service.getNote = getNote;

        service.setAttachment = setAttachment;
        service.getAttachment = getAttachment;

        service.setEngineer = setEngineer;
        service.getEngineer = getEngineer;

        service.setOverTime = setOverTime;
        service.getOverTime = getOverTime;

        service.setShiftCode = setShiftCode;
        service.getShiftCode = getShiftCode;

        service.getChargeType = getChargeType;
        service.getChargeMethod = getChargeMethod;
        service.getFieldJob = getFieldJob;

        service.getWorkType = getWorkType;
        service.getItem = getItem;
        service.getCurrency = getCurrency;

        service.getDebrief = getDebrief;
        service.saveValues = saveValues;

        service.setWarrantyType = setWarrantyType;
        service.getWarrantyType = getWarrantyType;

        service.setNetworkStatus = setNetworkStatus;
        service.getNetworkStatus = getNetworkStatus;

        service.saveBase64File = saveBase64File;
        service.saveFile = saveFile;
        service.openFile = openFile;

        service.submitDebrief = submitDebrief;

        service.checkIfFutureDayTask = checkIfFutureDayTask;
        service.setIfFutureDateTask = setIfFutureDateTask;
        service.getIfFutureDateTask = getIfFutureDateTask;

        return service;

        function setResourceId(id) {
            resourceId = id;
        };

        function getResourceId() {
            return resourceId;
        };

        function setUser(user) {

            userObject = user;

            setUserType();
        };

        function getUser() {
            return userObject;
        };

        function setIfFutureDateTask(value) {

            futureTask = value;
        };

        function getIfFutureDateTask() {
            return futureTask;
        };

        function setUserType() {

            userType.name = getUser().Name;

            userType.defaultView = getUser().Default_View;

            userType.duration = getUser().Work_Hour;

            if (getUser().ClarityID == "1") {

                userType.clarityType = 'C';

            } else {

                userType.clarityType = 'NC';
            }
        };

        function getUserType() {
            return userType;
        };

        function setHeader(header) {
            header = header;
        };

        function getHeader() {
            return header;
        };

        function setTask(taskObject) {

            debrief.task = taskObject;

            localService.getInstallBaseList(taskObject.Task_Number, function (response) {

                debrief.installBase = response[0];
            });

            localService.getTimeList(taskObject.Task_Number, function (response) {

                debrief.time = response;
            });

            localService.getExpenseList(taskObject.Task_Number, function (response) {

                debrief.expense = response;
            });

            localService.getMaterialList(taskObject.Task_Number, function (response) {

                debrief.material = response;
            });

            localService.getNotesList(taskObject.Task_Number, function (response) {

                debrief.notes = response;
            });

            localService.getAttachmentList(taskObject.Task_Number, "D", function (response) {

                debrief.attachment = response;
            });

            localService.getEngineer(taskObject.Task_Number, function (response) {

                debrief.engineer = response;
            });

            localService.getOverTimeList(taskObject.Task_Number, function (response) {

                debrief.overTime = response;
            });

            localService.getShiftCodeList(taskObject.Task_Number, function (response) {

                debrief.shiftCode = response;
            });

            localService.getChargeTypeList(function (response) {

                debrief.chargeType = response;
            });

            localService.getChargeMethodList(function (response) {

                debrief.chargeMethod = response;
            });

            localService.getFieldJobNameList(function (response) {

                debrief.fieldName = response;
            });

            localService.getWorkTypeList(function (response) {

                debrief.workType = response;
            });

            localService.getItemList(function (response) {

                debrief.item = response;
            });

            localService.getCurrencyList(function (response) {

                debrief.currency = response;
            });
        };

        function getTask() {

            return debrief.task;
        };

        function setInstallBase(installBaseObject) {

            debrief.installBase = installBaseObject;
        };

        function getInstallBase() {

            return debrief.installBase;
        };

        function setTaskId(task) {

            taskId = task;
        };

        function getTaskId() {

            return taskId;
        };

        function setTime(timeArray) {

            debrief.time = timeArray;
        };

        function getTime() {

            return debrief.time;
        };

        function setExpense(expenseArray) {

            debrief.expense = expenseArray;
        };

        function getExpense() {

            return debrief.expense;
        };

        function setMaterial(materialArray) {

            debrief.material = materialArray;
        };

        function getMaterial() {

            return debrief.material;
        };

        function setNote(noteArray) {

            debrief.notes = noteArray;
        };

        function getNote() {

            return debrief.notes;
        };

        function setAttachment(attachmentArray) {

            debrief.attachment = attachmentArray;
        };

        function getAttachment() {

            return debrief.attachment;
        };

        function setEngineer(engineerObject) {

            debrief.engineer = engineerObject;
        };

        function getEngineer() {

            return debrief.engineer;
        };

        function setOverTime(overTimeArray) {

            debrief.overTime = overTimeArray;
        };

        function getOverTime() {

            return debrief.overTime;
        };

        function setShiftCode(shiftCodeArray) {

            debrief.shiftCode = shiftCodeArray;
        };

        function getShiftCode() {

            return debrief.shiftCode;
        };

        function getChargeType() {

            return debrief.chargeType;
        };

        function getChargeMethod() {

            return debrief.chargeMethod;
        };

        function getFieldJob() {

            return debrief.fieldName;
        };

        function getWorkType() {

            return debrief.workType;
        };

        function getItem() {

            return debrief.item;
        };

        function getCurrency() {

            return debrief.currency;
        };

        function getDebrief() {

            return debrief;
        };

        function setNetworkStatus(status) {

            networkStatus = status;
        };

        function getNetworkStatus() {

            return networkStatus;
        };

        function saveValues() {

            if (debrief.time.length > 0) {

                localService.deleteTime(debrief.task.Task_Number);
                localService.insertTimeList(debrief.time);
            }

            if (debrief.expense.length > 0) {

                localService.deleteExpense(debrief.task.Task_Number);
                localService.insertExpenseList(debrief.expense);
            }

            if (debrief.material.length > 0) {

                localService.deleteMaterial(debrief.task.Task_Number);
                localService.insertMaterialList(debrief.material);
            }

            if (debrief.notes.length > 0) {

                localService.deleteNotes(debrief.task.Task_Number);
                localService.insertNotesList(debrief.notes);
            }

            if (debrief.attachment.length > 0) {

                localService.deleteAttachment(debrief.task.Task_Number);
                localService.insertAttachmentList(debrief.attachment);
            }

            if (debrief.engineer != undefined && debrief.engineer.Task_Number != null) {

                localService.deleteEngineer(debrief.task.Task_Number);
                localService.insertEngineerList(debrief.engineer);
            }
        };

        function setWarrantyType(type) {

            warrantyType = type;
        };

        function getWarrantyType() {

            return warrantyType;
        };

        function b64toBlob(b64Data, contentType, sliceSize) {

            contentType = contentType || '';

            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);

            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {

                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);

                for (var i = 0; i < slice.length; i++) {

                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});

            return blob;
        };

        function saveBase64File(folderpath, filename, content, contentType) {

            var DataBlob = b64toBlob(content, contentType);

            console.log("START WRITING");

            window.resolveLocalFileSystemURL(folderpath, function (dir) {

                console.log("ACCESS GRANTED");

                dir.getFile(filename, {create: true}, function (file) {

                    console.log("FILE CREATED SUCCESSFULLY");

                    file.createWriter(function (fileWriter) {

                        console.log("WRITING CONTENT TO FILE");

                        fileWriter.write(DataBlob);

                    }, function () {

                        alert("UNABLE TO SAVE " + folderpath);
                    });
                });
            });
        };

        function saveFile(folderpath, filename, file) {

            var DataBlob = file;

            console.log("START WRITING");

            window.resolveLocalFileSystemURL(folderpath, function (dir) {

                console.log("ACCESS GRANTED");

                dir.getFile(filename, {create: true}, function (file) {

                    console.log("FILE CREATED SUCCESSFULLY");

                    file.createWriter(function (fileWriter) {

                        console.log("WRITING CONTENT TO FILE");

                        fileWriter.write(DataBlob);

                    }, function () {

                        alert("UNABLE TO SAVE " + folderpath);
                    });
                });
            });
        };

        function openFile(filePath, fileType) {

            cordova.plugins.fileOpener2.open(filePath, fileType, {

                    error: function (e) {
                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success: function () {
                        console.log('file opened successfully');
                    }
                }
            );
        };

        function copyDatabaseFile(dbName) {

            var sourceFileName = cordova.file.applicationDirectory + 'www/db/' + dbName;

            var targetDirName = cordova.file.dataDirectory;

            console.log("DB PATH", targetDirName);

            return Promise.all([

                new Promise(function (resolve, reject) {

                    resolveLocalFileSystemURL(sourceFileName, resolve, reject);
                }),

                new Promise(function (resolve, reject) {

                    resolveLocalFileSystemURL(targetDirName, resolve, reject);
                })

            ]).then(function (files) {

                var sourceFile = files[0];

                var targetDir = files[1];

                return new Promise(function (resolve, reject) {

                    targetDir.getFile(dbName, {}, resolve, reject);

                }).then(function () {

                    console.log("File already copied");

                }).catch(function () {

                    console.log("File doesn't exist, copying it");

                    return new Promise(function (resolve, reject) {

                        sourceFile.copyTo(targetDir, dbName, resolve, reject);

                    }).then(function () {

                        console.log("File copied");
                    });
                });
            });
        };
    }

    function submitDebrief(taskId) {

        var timeArray = [];

        var expenseArray = [];

        var materialArray = [];

        var notesArray = [];

        if ($rootScope.local) {

            localService.getTimeList(taskId, function (response) {

                timeArray = response;
            });

            localService.getExpenseList(taskId, function (response) {

                expenseArray = response;
            });

            localService.getMaterialList(taskId, function (response) {

                materialArray = response;
            });

            localService.getNotesList(taskId, function (response) {

                notesArray = response;
            });

            // localService.getAttachmentList(taskId, "D", function (response) {
            //
            //     debrief.attachment = response;
            // });
            //
            // localService.getEngineer(taskId, function (response) {
            //
            //     debrief.engineer = response;
            // });
        }

        var timeJSONData = [];

        for (var i = 0; i < timeArray.length; i++) {

            var date = $filter("date")(timeArray[i].Date, "yyyy-MM-ddThh:mm:ss.000");
            date = date + "Z";

            var timeData = {
                "task_id": timeArray[i].Task_Number,
                "shift_code": timeArray[i].Shift_Code_Id,
                "overtime_shiftcode": timeArray[i].Time_Code_Id,
                "charge_type": timeArray[i].Charge_Type_Id,
                "duration": timeArray[i].Duration,
                "comments": timeArray[i].Comments,
                "labor_item": timeArray[i].Item_Id,
                "labor_description": timeArray[i].Description,
                "work_type": timeArray[i].Work_Type_Id,
                "start_date": date,
                "end_date": date,
                "charge_method": timeArray[i].Charge_Method_Id,
                "JobName": "20"
            }

            timeJSONData.push(timeData);
        }

        var expenseJSONData = [];

        for (var i = 0; i < expenseArray.length; i++) {

            var expenseDate = $filter("date")(expenseArray[i].Date, "yyyy-MM-dd");

            var expenseData = {
                "taskId": expenseArray[i].Task_Number,
                "comments": expenseArray[i].Justification,
                "currency": expenseArray[i].Currency_Id,
                "chargeMethod": expenseArray[i].Charge_Method_Id,
                "ammount": expenseArray[i].Amount,
                "date": expenseDate,
                "expenseItem": expenseArray[i].Expense_Type_Id,
                "chargeType": "2",
                "billable": "true"
            }

            expenseJSONData.push(expenseData);
        }

        var materialDataJSONWarranty = [];

        var materialDataJSON = [];

        for (var i = 0; i < materialArray.length; i++) {

            if (materialArray[i].Charge_Type_Id == 138) {

                angular.forEach(materialArray[i].Serial_Type, function (key) {

                    var materialData = {
                        "charge_method": materialArray[i].Charge_Type_Id.toString(),
                        "task_id": materialArray[i].Task_Number,
                        "item_description": materialArray[i].Description,
                        "product_quantity": materialArray[i].Product_Quantity,
                        "comments": "gfhghg",
                        "item": "11",
                        "serialin": key.in,
                        "serialout": key.out,
                        "service_activity": "serveact",
                        "charge_type": "2"
                    }

                    materialDataJSONWarranty.push(materialData);
                });

            } else {

                angular.forEach(materialArray[i].Serial_Type, function (key) {

                    var materialData = {
                        "charge_method": materialArray[i].Charge_Type_Id.toString(),
                        "task_id": materialArray[i].Task_Number,
                        "item_description": materialArray[i].Description,
                        "product_quantity": materialArray[i].Product_Quantity,
                        "comments": "gfhghg",
                        "item": "11",
                        "serial_number": key.number,
                        "service_activity": "serveact",
                        "charge_type": "2"
                    }

                    materialDataJSON.push(materialData);
                });
            }

            var noteDataJSON = [];

            for (var i = 0; i < notesArray.length; i++) {

                var noteData = {
                    "Notes_type": notesArray[i].Note_Type.id,
                    "notes_description": notesArray[i].Notes,
                    "task_id": notesArray[i].Task_Number
                };

                noteDataJSON.push(noteData);
            }

            var timeUploadJSON = {
                "Time": timeJSONData
            }

            console.log(timeUploadJSON);

            if (timeArray) {

                cloudService.uploadTime(timeUploadJSON, function (respose) {

                    console.log("Uploaded Time Data");
                });
            }

            var expenseUploadJSON = {
                "expense": expenseJSONData
            }

            console.log(expenseUploadJSON);

            if (expenseArray) {

                cloudService.updateExpenses(expenseUploadJSON, function (respose) {

                    console.log("Uploaded Expense Data");
                });
            }

            var notesUploadJSON = {
                "Notes": noteDataJSON
            }

            console.log(notesUploadJSON);

            if (notesArray) {

                cloudService.updateNotes(notesUploadJSON, function (respose) {

                    console.log("Uploaded notes");
                });
            }

            var materialUploadJSON = {
                "Material": materialDataJSON
            }

            var materialUploadJSONWarranty = {
                "Material": materialDataJSONWarranty
            }

            console.log(materialUploadJSON);

            if (materialArray) {

                cloudService.updateMaterial(materialUploadJSON, materialUploadJSONWarranty, function (respose) {

                    console.log("Uploaded materail");
                });
            }

            var taskObject = {
                Task_Number: valueService.getTask().Task_Number,
                Submit_Status: "I"
            };

            localService.updateTaskSubmitStatus(taskObject);
        }
    }

    function checkIfFutureDayTask(selTask) {
        var currDate = new Date;
        var selDate = new Date(selTask.Start_Date.split(" ")[0]);
        console.log(currDate);
        console.log(selDate);
        if (selDate.getFullYear() > currDate.getFullYear()) {
            return true;
        } else if (selDate.getFullYear() === currDate.getFullYear()) {
            if (selDate.getMonth() > currDate.getMonth()) {
                return true;
            } else if (selDate.getMonth() === currDate.getMonth()) {
                if (selDate.getDate() > currDate.getDate()) {
                    return true;
                }
            }
        }

        return false;

    }


})();
