app.controller("debriefController", function ($scope, $state, $rootScope, $window, $timeout, $filter, $http, $q, cloudService, $mdDialog, valueService, localService, Upload, constantService) {

    $scope.currentTab = "time";

    $rootScope.Islogin = true;

    $scope.userType = valueService.getUserType().clarityType;

    $scope.engineerName = valueService.getUserType().name;

    $rootScope.headerName = "Debrief";

    if (valueService.getUserType().defaultView == "My Task") {

        $scope.routeAfterDone = "myFieldJob";

    } else {

        $scope.routeAfterDone = "myTask";
    }

    if (!$rootScope.completedTask) {

        $scope.stages = [
            {title: "Time", templateUrl: $scope.userType == 'C' ? "app/views/Time.html" : "app/views/TimeNC.html"},
            {title: "Expenses", templateUrl: "app/views/Expenses.html"},
            {title: "Material", templateUrl: "app/views/Material.html"},
            {title: "Notes", templateUrl: "app/views/Notes.html"},
            {title: "Attachments", templateUrl: "app/views/Attachments.html"},
            {title: "Engineer Signature", templateUrl: "app/views/EngineerSignature.html"},
            {title: "Summary", templateUrl: "app/views/Summary.html"},
            {title: "Customer Signature", templateUrl: "app/views/CustomerSignature.html"}
        ];

    } else {

        $scope.stages = [
            {title: "Summary", templateUrl: "app/views/Summary.html"},
            {title: "Customer Signature", templateUrl: "app/views/CustomerSignature.html"}
        ];
    }

    $scope.datePicker = {startDate: null, endDate: null};

    $scope.summary = {};
    $scope.taskId = "";
    $scope.taskObject = {};
    $scope.installBaseObject = {};

    $scope.timeArray = [];
    $scope.expenseArray = [];
    $scope.materialArray = [];
    $scope.notesArray = [];
    $scope.attachmentArray = [];
    $scope.engineerObject = {};

    $scope.overTimeArray = [];
    $scope.shiftCodeArray = [];

    $scope.initializeDebrief = function () {

        $scope.taskObject = valueService.getTask();

        $scope.taskId = $scope.taskObject.Task_Number;

        $scope.installBaseObject = valueService.getInstallBase();

        $scope.timeArray = valueService.getTime();
        $scope.expenseArray = valueService.getExpense();
        $scope.materialArray = valueService.getMaterial();
        $scope.notesArray = valueService.getNote();
        $scope.attachmentArray = valueService.getAttachment();

        $scope.image = [];

        $scope.files = [];

        angular.forEach($scope.attachmentArray, function (attachment) {

            var attachmentObject = {};

            attachmentObject.contentType = attachment.File_Type;

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

                fs.root.getFile(attachment.File_Name, {create: true, exclusive: false}, function (fileEntry) {

                    fileEntry.file(function (file) {

                        var reader = new FileReader();

                        reader.onloadend = function () {

                            console.log("Successful file read: " + this.result);

                            attachmentObject.base64 = this.result.split(",")[1];

                            attachmentObject.contentType = attachment.File_Type;

                            attachmentObject.fileDisc = attachment.File_Name.split(".")[0];
                            attachmentObject.filename = attachment.File_Name;
                            attachmentObject.filetype = attachment.File_Name.split(".")[1];

                            if (attachment.AttachmentType == "D") {

                                $scope.files.push(attachmentObject);

                            } else if (attachment.AttachmentType == "M") {

                                $scope.image.push(attachmentObject)
                            }
                        };

                        reader.readAsDataURL(file);
                    });
                });
            });
        });

        $scope.engineerObject = valueService.getEngineer();

        $scope.overTimeArray = valueService.getOverTime();
        $scope.shiftCodeArray = valueService.getShiftCode();

        $scope.chargeTypeArray = valueService.getChargeType();
        $scope.chargeMethodArray = valueService.getChargeMethod();
        $scope.fieldJobArray = valueService.getFieldJob();

        $scope.chargeTypeArray = valueService.getChargeType();
        $scope.chargeMethodArray = valueService.getChargeMethod();
        $scope.fieldJobArray = valueService.getFieldJob();

        $scope.workTypeArray = valueService.getWorkType();
        $scope.Item = valueService.getItem();
        $scope.currencyArray = valueService.getCurrency();

        $scope.expenseTypeArray = valueService.getExpenseType();
        $scope.noteTypeArray = valueService.getNoteType();

        $scope.setDropDownValues();

        $scope.setDefaultValues();

    };

    $scope.setDropDownValues = function () {

        $scope.timeDefault = {};

        $scope.timeDefault = {
            fieldJobName: {
                title: "Field Job Name",
                values: $scope.fieldJobArray
            },
            chargeType: {
                title: "Charge Type",
                values: $scope.chargeTypeArray
            },
            workType: {
                title: "Work Type",
                values: $scope.workTypeArray
            },
            chargeMethod: {
                title: "Charge Method",
                values: $scope.chargeMethodArray,
            },
            item: {
                title: "Item",
                values: [{"ID": 1, "Value": " Standard"},
                    {"ID": 2, "Value": " Overtime"},
                    {"ID": 3, "Value": " DoubleTime"}],
                valuesDeputation: [{"ID": 1, "Value": "Deputation- Standard"},
                    {"ID": 2, "Value": "Deputation- Overtime"},
                    {"ID": 3, "Value": "Deputation- DoubleTime"}],
                valuesTravel: [{"ID": 4, "Value": "Travel- Standard"},
                    {"ID": 5, "Value": "Travel- Overtime"},
                    {"ID": 6, "Value": "Travel- DoubleTime"}],
                valuesNormal: [{"ID": 1, "Value": "Normal- Standard"},
                    {"ID": 2, "Value": "Normal- Overtime"},
                    {"ID": 3, "Value": "Normal- DoubleTime"}],
                valuesNightShift: [{"ID": 1, "Value": "Night Shift- Standard"},
                    {"ID": 2, "Value": "Night Shift- Overtime"},
                    {"ID": 3, "Value": "Night Shift- DoubleTime"}]
            },
            description: {
                title: "Description"
            },
            timeCode: {
                title: "Time Code",
                values: $scope.overTimeArray
            },
            timeCodeT: {
                title: "Time Code",
                value: ["OT1", "OT2", "OT3", "OS1", "OS2", "Standard"]
            },
            shiftCode: {
                title: "Shift Code",
                values: $scope.shiftCodeArray
            },
            Date: {
                title: "Date"
            },
            duration: {
                title: "Duration"
            },
            comments: {
                title: "Comments"
            }
        };

        $scope.expenseDefault = {
            date: {
                title: "Date"
            },
            expenseType: {
                title: "Expense Type",
                values: $scope.expenseTypeArray
            },
            amount: {
                title: "Amount"
            },
            currency: {
                title: "Currency",
                values: $scope.currencyArray
            },
            chargeMethod: {
                title: "Charge Method",
                values: $scope.chargeMethodArray
            },
            billable: {
                title: "Billable"
            },
            justification: {
                title: "Justification"
            }
        };

        $scope.materialDefault = {
            chargeType: {
                title: "Charge Method",
                values: $scope.chargeMethodArray
            },
            description: {
                title: "Description"
            },
            serialActivity: {
                title: "Service Activity"
            },
            serialIn: {
                title: "Serial In"
            },
            serialOut: {
                title: "Serial Out"
            },
            serialNo: {
                title: "Serial Number"
            },
            productQuantity: {
                title: "Product Quantity"
            },
            comments: {
                title: "Comments"
            }
        };

        $scope.noteDefault = {
            noteType: {
                title: "Note Type",
                values: $scope.noteTypeArray
            },
            noteDate: {
                title: "Note Date"
            },
            noteCreator: {
                title: "Created By"
            },
            notes: {
                title: "Notes"
            }
        };
    };

    $scope.setDefaultValues = function () {

        if ($scope.timeArray != null && $scope.timeArray.length > 0) {

            angular.forEach($scope.timeArray, function (item) {

                if (item.Date != undefined && item.Date != "")
                    item.Date = new Date(item.Date);

                item.timeDefault = $scope.timeDefault;

                item.DurationHours = moment.duration(item.Duration).hours();

                item.DurationMinutes = moment.duration(item.Duration).minutes();

                angular.forEach(item.timeDefault.chargeType.values, function (type) {
                    if (type.ID == item.Charge_Type_Id) {
                        item.Charge_Type = type;
                    }
                });

                angular.forEach(item.timeDefault.chargeMethod.values, function (type) {
                    if (type.ID == item.Charge_Method_Id) {
                        item.Charge_Method = type;
                    }
                });

                angular.forEach(item.timeDefault.fieldJobName.values, function (type) {
                    if (type.TaskCode == item.Field_Job_Name_Id) {
                        item.Field_Job_Name = type;
                    }
                });

                angular.forEach(item.timeDefault.timeCode.values, function (type) {
                    if (type.OverTime_Shift_Code_ID == item.Time_Code_Id) {
                        item.Time_Code = type;
                    }
                });

                angular.forEach(item.timeDefault.shiftCode.values, function (type) {
                    if (type.Shift_Code_ID == item.Shift_Code_Id) {
                        item.Shift_Code = type;
                    }
                });

                angular.forEach(item.timeDefault.workType.values, function (type) {

                    if (type.ID == item.Work_Type_Id) {

                        item.Work_Type = type;

                        if (type.Value == "Deputation") {
                            item.timeDefault.item.values = item.timeDefault.item.valuesDeputation;
                        } else if (type.Value == "Travel") {
                            item.timeDefault.item.values = item.timeDefault.item.valuesTravel;
                        } else if (type.Value == "Normal") {
                            item.timeDefault.item.values = item.timeDefault.item.valuesNormal;
                        } else if (type.Value == "Night Shift") {
                            item.timeDefault.item.values = item.timeDefault.item.valuesNightShift;
                        }
                    }
                });

                angular.forEach(item.timeDefault.item.values, function (type) {
                    if (type.ID == item.Item_Id) {
                        item.Item = type;
                    }
                });
            });
        }

        if ($scope.expenseArray != null && $scope.expenseArray.length > 0) {

            angular.forEach($scope.expenseArray, function (item) {

                if (item.Date != undefined && item.Date != "")
                    item.Date = new Date(item.Date);

                item.expenseDefault = $scope.expenseDefault;

                angular.forEach(item.expenseDefault.chargeMethod.values, function (type) {
                    if (type.ID == item.Charge_Method_Id) {
                        item.Charge_Method = type;
                    }
                });

                angular.forEach(item.expenseDefault.currency.values, function (type) {
                    if (type.ID == item.Currency_Id) {
                        item.Currency = type;
                    }
                });

                angular.forEach(item.expenseDefault.expenseType.values, function (type) {
                    if (type.ID == item.Expense_Type_Id) {
                        item.Expense_Type = type;
                    }
                });
            });
        }

        if ($scope.materialArray != null && $scope.materialArray.length > 0) {

            angular.forEach($scope.materialArray, function (item) {

                item.materialDefault = $scope.materialDefault;
                angular.forEach(item.materialDefault.chargeType.values, function (type) {
                    if (type.ID == item.Charge_Type_Id) {
                        item.Charge_Type = type;
                    }
                });
                var serialin, serialout, serialNo;

                if (item.Serial_In != undefined) {

                    var serialin = item.Serial_In.split(",");

                    serialin = item.Serial_In.split(",");
                }

                if (item.Serial_In != undefined) {

                    var serialout = item.Serial_Out.split(",");

                    serialout = item.Serial_Out.split(",");
                }

                if (item.Serial_In != undefined) {

                    var serialNo = item.Serial_Number.split(",");

                    serialNo = item.Serial_Number.split(",")
                }

                item.Serial_Type = [];

                if (serialNo != undefined && serialNo.length > 0) {

                    angular.forEach(serialNo, function (serail) {

                        var serialTypeobj = {};

                        serialTypeobj.in = "";
                        serialTypeobj.out = "";
                        serialTypeobj.number = serail;

                        if (serialTypeobj.number != "")
                            item.Serial_Type.push(serialTypeobj);
                    });
                }

                if (serialin != undefined && serialin.length > 0 && serialout != undefined && serialout.length > 0) {

                    var index = 0;

                    angular.forEach(serialin, function (serail) {

                        var serialTypeobj = {};

                        serialTypeobj.in = serail;
                        serialTypeobj.out = serialout[index];
                        serialTypeobj.number = "";

                        if (serialTypeobj.in != "")
                            item.Serial_Type.push(serialTypeobj);

                        index++;
                    });
                }
            });
        }

        if ($scope.notesArray != null && $scope.notesArray.length > 0) {

            angular.forEach($scope.notesArray, function (item) {

                if (item.Date != undefined && item.Date != "")
                    item.Date = new Date(item.Date);

                item.noteDefault = $scope.noteDefault;

                angular.forEach(item.noteDefault.noteType.values, function (type) {
                    if (type.ID == item.Note_Type_Id) {
                        item.Note_Type = type;
                    }
                });
            });
        }

        $scope.attachmentDefaultObject = {
            Attachment_Id: $scope.taskId + ($scope.attachmentArray.length + 1),
            File_Name: "",
            File_Path: "",
            Type: "D",
            Task_Number: $scope.taskId
        };

        if ($scope.engineerObject == undefined) {

            $scope.engineerObject = {
                Engineer_Id: $scope.taskId,
                followUp: false,
                salesQuote: false,
                salesVisit: false,
                salesLead: false,
                Follow_Up: "",
                Spare_Quote: "",
                Sales_Visit: "",
                Sales_Head: "",
                Sign_File_Path: "",
                File_Name: "",
                Task_Number: $scope.taskId
            };
        }
        else {
            $scope.engineerObject.followUp = ($scope.engineerObject.followUp == 'true');
            $scope.engineerObject.salesQuote = ($scope.engineerObject.salesQuote == 'true');
            $scope.engineerObject.salesVisit = ($scope.engineerObject.salesVisit == 'true');
            $scope.engineerObject.salesLead = ($scope.engineerObject.salesLead == 'true');
        }
    };

    $scope.addObject = function (stage) {

        var durationFromResponse, DurationHours, DurationMinutes;

        switch (stage) {

            case "Time":

                if (valueService.getUserType().duration) {
                    durationFromResponse = moment(valueService.getUserType().duration, 'HH').format('HH:mm');
                    DurationHours = moment.duration(durationFromResponse).hours();
                    DurationMinutes = moment.duration(durationFromResponse).minutes();
                } else {
                    durationFromResponse = "08:00";
                    DurationHours = "08"
                    DurationMinutes = "00"
                }

                $scope.timeArray.push({
                    timeDefault: $scope.timeDefault,
                    Time_Id: $scope.taskId + "" + ($scope.timeArray.length + 1),
                    Field_Job_Name: "",
                    Field_Job_Name_Id: "",
                    Charge_Type: "",
                    Charge_Type_Id: "",
                    Charge_Method: $scope.taskObject.Labor_Method,
                    Charge_Method_Id: "",
                    Work_Type: "",
                    Work_Type_Id: "",
                    Item: "",
                    Item_Id: "",
                    Description: "",
                    Time_Code: "",
                    Time_Code_Id: "",
                    Shift_Code: "",
                    Shift_Code_Id: "",
                    Date: new Date(),
                    Duration: durationFromResponse,
                    DurationHours: DurationHours,
                    DurationMinutes: DurationMinutes,
                    mins: 0,
                    Comments: "",
                    Task_Number: $scope.taskId
                });

                break;

            case "Expenses":

                $scope.expenseArray.push({
                    expenseDefault: $scope.expenseDefault,
                    Expense_Id: $scope.taskId + "" + ($scope.expenseArray.length + 1),
                    Date: new Date(),
                    Expense_Type: "",
                    Expense_Type_Id: "",
                    Amount: "",
                    Currency: "",
                    Currency_Id: "",
                    Charge_Method: $scope.taskObject.Expense_Method,
                    Charge_Method_Id: "",
                    Justification: "",
                    Task_Number: $scope.taskId
                });

                break;

            case "Notes":

                $scope.notesArray.push({
                    noteDefault: $scope.noteDefault,
                    Notes_Id: $scope.taskId + "" + ($scope.notesArray.length + 1),
                    Note_Type: "",
                    Note_Type_Id: "",
                    Date: new Date(),
                    Created_By: $rootScope.uName,
                    Notes: "",
                    Task_Number: $scope.taskId
                });

                break;
            case "Material":
                $scope.materialArray.push({
                    materialDefault: $scope.materialDefault,
                    Material_Id: $scope.taskId + "" + ($scope.materialArray.length + 1),
                    Charge_Type: "",
                    Charge_Type_Id: "",
                    Description: "",
                    Product_Quantity: 1,
                    Serial_Type: [{"in": "", "out": "", "number": ""}],
                    Task_Number: $scope.taskId,
                    ItemName: ""
                });
            default:
                break;
        }
    };

    $rootScope.addMaterialItem = function () {

        $scope.dropDown = false;

        $scope.materialArray.push({
            materialDefault: $scope.materialDefault,
            Material_Id: $scope.taskId + "" + ($scope.materialArray.length + 1),
            Charge_Type: valueService.getWarrantyType().value,
            Charge_Type_Id: valueService.getWarrantyType().id,
            Description: $scope.description,
            Product_Quantity: 1,
            Serial_Type: [{"in": "", "out": "", "number": ""}],
            Task_Number: $scope.taskId,
            ItemName: ""
        });

        $mdDialog.hide();
    };

    $scope.addSerialItem = function (index) {

        $scope.materialArray[index].Product_Quantity++;

        $scope.materialArray[index]["Serial_Type"].push({"in": "", "out": "", "number": ""});
    };

    $scope.deleteSerialItem = function (index) {

        $scope.materialArray[index].Product_Quantity--;

        $scope.materialArray[index]["Serial_Type"].splice($scope.materialArray[index]["Serial_Type"].length - 1, 1);
    };

    $scope.setMaterialSearchText = function (text) {
        $scope.description = text;
    };

    $scope.showDropDown = function (event, description) {

        this.MaterialForm.descriptionValue.$setPristine();

        this.MaterialForm.descriptionValue.$setPristine(true);

        this.descriptionValue = '';

        if (description) {

            $mdDialog.show({

                controller: DialogController,
                templateUrl: "app/views/Dialog.html",
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true

            }).then(function (selected) {

                $scope.status = "You said the information was '" + selected + "'.";

            }, function () {

                $scope.status = "You cancelled the dialog.";
            });
        }
    };

    function DialogController($scope, $mdDialog) {

        $scope.selectedWarranty = null;

        $scope.warrantyList = [{"id": 1, "value": "Billable"},
            {"id": 137, "value": "Goodwill"},
            {"id": 138, "value": "Warranty"},
            {"id": 2, "value": "Concession"}];

        $scope.selectedWarrantyType = function (warrantyType) {

            $scope.selectedWarranty = warrantyType;

            valueService.setWarrantyType($scope.selectedWarranty);
        }
    }

    $scope.hideDropDown = function () {
        $scope.dropDown = false;
    };

    $scope.copyObject = function (item, stage) {

        var itemToBeCopied = angular.copy(item);

        switch (stage) {

            case "Time":

                itemToBeCopied.Comments = "";
                itemToBeCopied.Time_Id = $scope.taskId + "" + ($scope.timeArray.length + 1)
                $scope.timeArray.push(itemToBeCopied);

                break;

            case "Expenses":

                itemToBeCopied.justification = "";
                itemToBeCopied.Expense_Id = $scope.taskId + "" + ($scope.expenseArray.length + 1)
                $scope.expenseArray.push(itemToBeCopied);

                break;

            case "Notes":
                itemToBeCopied.Notes_Id = $scope.taskId + "" + ($scope.notesArray.length + 1)
                $scope.notesArray.push(itemToBeCopied);

                break;
            case "Material":
                itemToBeCopied.Material_Id = $scope.taskId + "" + ($scope.materialArray.length + 1)
                $scope.materialArray.push(itemToBeCopied);

                break;

            default:
                break;
        }
    };

    $scope.deleteObject = function (index, item, stage) {

        switch (stage) {

            case "Time":

                for (var i = 0; i < $scope.timeArray.length; i++) {

                    if (index == i) {

                        $scope.timeArray.splice(index, 1);
                    }
                }

                break;

            case "Expenses":

                for (var i = 0; i < $scope.expenseArray.length; i++) {

                    if (index == i) {

                        $scope.expenseArray.splice(index, 1);
                    }
                }

                break;

            case "Material":

                for (var i = 0; i < $scope.materialArray.length; i++) {

                    if (index == i) {

                        $scope.materialArray.splice(index, 1);
                    }
                }

                break;

            case "Notes":

                for (var i = 0; i < $scope.notesArray.length; i++) {

                    if (index == i) {

                        $scope.notesArray.splice(index, 1);
                    }
                }

                break;

            default:
                break;
        }
    };

    $scope.initializeDebrief();

    $scope.setWorkType = function (workType, timeObject) {

        if (workType.Value == "Deputation" || workType.ID==1) {

            timeObject.timeDefault.item.values = timeObject.timeDefault.item.valuesDeputation;

        } else if (workType.Value == "Travel" || workType.ID == 2) {

            timeObject.timeDefault.item.values = timeObject.timeDefault.item.valuesTravel;

        } else if (workType.Value == "Normal" || workType.ID == 3) {

            timeObject.timeDefault.item.values = timeObject.timeDefault.item.valuesNormal;

        } else if (workType.Value == "Night Shift" || workType.Value == "Nightshift" || workType.ID == 4) {

            timeObject.timeDefault.item.values = timeObject.timeDefault.item.valuesNightShift;
        }

        timeObject.Work_Type_Id = timeObject.Work_Type.ID;
        timeObject.Item = "";
    };

    $scope.setChargeType = function (timeObject) {

        timeObject.Charge_Type_Id = timeObject.Charge_Type.ID;
    }

    $scope.setChargeTypeMaterial = function (timeObject) {

        timeObject.Charge_Type_Id = timeObject.Charge_Type.ID;

        if (timeObject.Charge_Type.Value == 'Billable' || timeObject.Charge_Type.Value == 'Goodwill' || timeObject.Charge_Type.Value == 'Concession') {

            angular.forEach(timeObject.Serial_Type, function (serial) {

                serial.in = "";
                serial.out = ""
            });

        } else {

            angular.forEach(timeObject.Serial_Type, function (serial) {

                serial.number = "";
            });
        }
    }

    $scope.setFieldName = function (timeObject) {
        timeObject.Field_Job_Name_Id = timeObject.Field_Job_Name.TaskCode;
    }

    $scope.setShiftCode = function (timeObject) {
        timeObject.Shift_Code_Id = timeObject.Shift_Code.Shift_Code_ID;
    }

    $scope.setTimeCode = function (timeObject) {
        timeObject.Time_Code_Id = timeObject.Time_Code.OverTime_Shift_Code_ID;
    }

    $scope.setChargeMethod = function (timeObject) {
        timeObject.Charge_Method_Id = timeObject.Charge_Method.ID;
    }

    $scope.setChargeMethodForExpense = function (expenseObject) {
        expenseObject.Charge_Method_Id = expenseObject.Charge_Method.ID;
    }

    $scope.setCurrency = function (expenseObject) {
        expenseObject.Currency_Id = expenseObject.Currency.ID;
    }

    $scope.setExpenseItem = function (expenseObject) {
        expenseObject.Expense_Type_Id = expenseObject.Expense_Type.ID;
    }

    $scope.setItem = function (timeObject) {
        timeObject.Item_Id = timeObject.Item.ID;
    }

    $scope.setNoteType = function (noteobj) {
        noteobj.Note_Type_Id = noteobj.Note_Type.ID;
    }
    $rootScope.saveValues = function () {
        $scope.saveValues();
        valueService.saveValues();
    }
    $scope.saveValues = function ()
    {
        if ($scope.timeArray.length > 0) {

            valueService.setTime($scope.timeArray);

        }
        if ($scope.expenseArray.length > 0) {

            valueService.setExpense($scope.expenseArray);

        }
        if ($scope.materialArray.length > 0) {

            $scope.serialNumber = function (serialArray) {

                var serialNumberArray = [];

                angular.forEach(serialArray, function (key, value) {

                    serialNumberArray.push(key.number);
                });

                return serialNumberArray;
            }

            $scope.serialIn = function (serialArray) {

                var serialNumberArray = [];

                angular.forEach(serialArray, function (key, value) {

                    serialNumberArray.push(key.in);
                });

                return serialNumberArray;
            }

            $scope.serialOut = function (serialArray) {

                var serialNumberArray = [];

                angular.forEach(serialArray, function (key, value) {

                    serialNumberArray.push(key.out);
                });

                return serialNumberArray;
            }

            angular.forEach($scope.materialArray, function (key, value) {
                key.Serial_In = $scope.serialIn(key.Serial_Type);
                key.Serial_Out = $scope.serialOut(key.Serial_Type);
                key.Serial_Number = $scope.serialNumber(key.Serial_Type);
            });

            valueService.setMaterial($scope.materialArray);
        }
        if ($scope.notesArray.length > 0) {

            valueService.setNote($scope.notesArray);
        }
        if ($scope.files.length > 0 || $scope.image.length > 0) {

            $scope.attachmentArraydb = [];

            i = 0;

            angular.forEach($scope.files, function (attachment) {

                var filePath = cordova.file.dataDirectory;

                var base64Code = attachment.base64;

                valueService.saveBase64File(filePath, attachment.filename, base64Code, attachment.contentType);

                var attachmentObject = {
                    Attachment_Id: $scope.taskId + "" + (i + 1),
                    File_Path: filePath,
                    File_Name: attachment.filename,
                    File_Type: attachment.contentType,
                    Type: "D",
                    Task_Number: $scope.taskId,
                    AttachmentType: "D"
                };

                $scope.attachmentArraydb.push(attachmentObject);

                i++;
            });

            angular.forEach($scope.image, function (attachment) {

                var filePath = cordova.file.dataDirectory;

                var base64Code = attachment.base64;

                valueService.saveBase64File(filePath, attachment.filename, base64Code, attachment.data.split(",")[0].split(";")[0].split(":")[1]);

                var attachmentObject = {
                    Attachment_Id: $scope.taskId + "" + (i + 1),
                    File_Path: filePath,
                    File_Name: attachment.filename,
                    File_Type: attachment.contentType,
                    Type: "D",
                    Task_Number: $scope.taskId,
                    AttachmentType: "M"
                };

                $scope.attachmentArraydb.push(attachmentObject);

                i++;
            });

            valueService.setAttachment($scope.attachmentArraydb);
        }
        if ($scope.engineerObject != null) {

            valueService.setEngineer($scope.engineerObject);
        }
    }
    $scope.tabChange = function (stage) {

        constantService.setStagesArray(stage);

        console.log("STAGE =====> " + JSON.stringify(stage));

        if ($scope.currentTab == "time") {

          

        } else if ($scope.currentTab == "expenses") {

            

        } else if ($scope.currentTab == "material") {

           

        } else if ($scope.currentTab == "notes") {

            

        } else if ($scope.currentTab == "attachments") {

         

        } else if ($scope.currentTab == "engineer signature") {

           
        }

        if (stage.title.toLowerCase() == "time") {

            if ($scope.timeArray.length == 0) {

                $scope.addObject(stage.title);

                if ($scope.timeDefault.chargeMethod.values != undefined && $scope.timeDefault.chargeMethod.values.length > 0) {

                    angular.forEach($scope.timeDefault.chargeMethod.values, function (key, value) {

                        if (key.Value == $scope.taskObject.Labor_Method) {

                            $scope.timeArray[0].Charge_Method = key;
                            $scope.timeArray[0].Charge_Method_Id = key.ID;
                        }
                    });
                }
            }

            $scope.currentTab = "time";
        }

        if (stage.title.toLowerCase() == "expenses") {

            if ($scope.expenseArray.length == 0) {

                $scope.addObject(stage.title);

                if ($scope.expenseDefault.chargeMethod.values != undefined && $scope.expenseDefault.chargeMethod.values.length > 0) {

                    angular.forEach($scope.expenseDefault.chargeMethod.values, function (key, value) {

                        if (key.Value == $scope.taskObject.Expense_Method) {

                            $scope.expenseArray[0].Charge_Method = key;
                            $scope.expenseArray[0].Charge_Method_Id = key.ID;
                        }
                    });
                }
            }

            $scope.currentTab = "expenses";
        }

        if (stage.title.toLowerCase() == "material") {
            if ($scope.materialArray.length == 0) {

                $scope.addObject(stage.title);

                if ($scope.materialDefault.chargeType.values != undefined && $scope.materialDefault.chargeType.values.length > 0) {

                    angular.forEach($scope.materialDefault.chargeType.values, function (key, value) {

                        if (key.Value == $scope.taskObject.Material_Method) {

                            $scope.materialArray[0].Charge_Type = key;
                            $scope.materialArray[0].Charge_Type_Id = key.ID;
                        }
                    });
                }
            }

            $scope.currentTab = "material";
        }

        if (stage.title.toLowerCase() == "notes") {

            if ($scope.notesArray.length == 0) {

                $scope.addObject(stage.title);
            }

            $scope.currentTab = "notes";
        }

        if (stage.title.toLowerCase() == "attachments") {

            $scope.currentTab = "attachments";
        }

        if (stage.title.toLowerCase() == "engineer signature") {

            $scope.currentTab = "engineer signature";
        }

        if (stage.title == "Summary") {

            $scope.summary.timeArray = [];
            $scope.summary.expenseArray = [];
            $scope.summary.materialArray = [];
            $scope.summary.notesArray = [];
            $scope.summary.taskObject = {};

            if ($scope.expenseArray != undefined) {

                angular.forEach($scope.expenseArray, function (key, value) {

                    var expenseObject = {
                        "Date": $filter("date")(key.Date, "dd-MM-yyyy "),
                        "Expense_Type": key.Expense_Type.Value,
                        "Amount": key.Amount,
                        "Currency": key.Currency.Value,
                        "Charge_Method": key.Charge_Method.Value,
                        "IsBillable": "Yes",
                        "Justification": key.Justification
                    }

                    $scope.summary.expenseArray.push(expenseObject);
                });
            }

            if ($scope.materialArray != undefined) {

                $scope.serialNumber = function (serialArray) {

                    var serialNumberArray = [];

                    angular.forEach(serialArray, function (key, value) {

                        serialNumberArray.push(key.number);
                    });

                    return serialNumberArray;
                }

                $scope.serialIn = function (serialArray) {

                    var serialNumberArray = [];

                    angular.forEach(serialArray, function (key, value) {

                        serialNumberArray.push(key.in);
                    });

                    return serialNumberArray;
                }

                $scope.serialOut = function (serialArray) {

                    var serialNumberArray = [];

                    angular.forEach(serialArray, function (key, value) {

                        serialNumberArray.push(key.out);
                    });

                    return serialNumberArray;
                }

                angular.forEach($scope.materialArray, function (key, value) {

                    var materialObject = {
                        "Charge_Type": key.Charge_Type.Value,
                        "Product_Quantity": key.Product_Quantity,
                        "serialNumber": $scope.serialNumber(key.Serial_Type),
                        "serialIn": $scope.serialIn(key.Serial_Type),
                        "serialOut": $scope.serialOut(key.Serial_Type),
                        "Description": key.Description,
                        "ItemName": key.ItemName
                    }

                    $scope.summary.materialArray.push(materialObject);
                });
            }

            if ($scope.notesArray != undefined) {

                angular.forEach($scope.notesArray, function (key, value) {

                    var notesObject = {
                        "Note_Type": key.Note_Type.Value,
                        "Date": key.Date,
                        "Notes": key.Notes
                    }

                    $scope.summary.notesArray.push(notesObject);
                });
            }

            if ($scope.taskObject != undefined) {

                $scope.summary.taskObject.Customer_Name = $scope.taskObject.Customer_Name;
                $scope.summary.taskObject.Service_Request = $scope.taskObject.Service_Request;
                $scope.summary.taskObject.Task_Number = $scope.taskObject.Task_Number;
                $scope.summary.taskObject.Job_Description = $scope.taskObject.Job_Description;

                if ($scope.installBaseObject != undefined && $scope.installBaseObject.length > 0) {

                    $scope.summary.taskObject.InstallBase = [];

                    angular.forEach($scope.installBaseObject, function (key) {

                        var install = {};

                        install.Product_Line = key.Product_Line;
                        install.Serial_Number = key.Serial_Number;
                        install.TagNumber = key.TagNumber;
                        install.Original_PO_Number = key.Original_PO_Number;

                        $scope.summary.taskObject.InstallBase.push(install);
                    });
                }

                $scope.summary.taskObject.times = [];

                $scope.summary.taskObject.times.push({
                    "Start_Date": $scope.taskObject.Start_Date,
                    "End_Date": $scope.taskObject.End_Date,
                    "Duration": $scope.taskObject.Duration
                });
            }

            if ($scope.timeArray != undefined) {

                var length = $scope.timeArray.length, i = 0;

                var grandTotalTimeArray = [];

                var subTotalTimeArray = [];

                angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecode, value) {

                    var codeobj = {};

                    var codeobj1 = {};

                    codeobj[timecode.Overtimeshiftcode] = 0;

                    codeobj1[timecode.Overtimeshiftcode] = 0;

                    grandTotalTimeArray.push(codeobj);

                    subTotalTimeArray.push(codeobj1);

                });

                var grandtimeObject = $scope.getTimenewObj("", "GRAND TOTAL", "", "", "", "", "", 0);

                var subtotalObject = $scope.getTimenewObj("", "SUB TOTAL", "", "", "", "", "", 0);

                var subTotalArray = [];

                angular.forEach($scope.timeArray, function (key, value) {

                    grandtimeObject.Duration = $scope.calculateDuration(grandtimeObject, key);

                    if (grandtimeObject.Duration.split(":")[0].length == 1) {

                        var hours = "0" + grandtimeObject.Duration.split(":")[0];
                        grandtimeObject.Duration = hours + ":" + grandtimeObject.Duration.split(":")[1]
                    }

                    if (grandtimeObject.Duration.split(":")[1].length == 1) {
                        var mins = "0" + grandtimeObject.Duration.split(":")[1]
                        grandtimeObject.Duration = grandtimeObject.Duration.split(":")[0] + ":" + mins
                    }

                    $scope.populateTimeCodeArray(grandTotalTimeArray, key);

                    if (subTotalArray.length > 0) {

                        var keepGoing = true;

                        angular.forEach(subTotalArray, function (subtotalObj, value) {

                            if (keepGoing) {

                                if (subtotalObj.Work_Type == key.Work_Type.Value) {

                                    newWorkType = false;

                                    $scope.populateTimeCodeArray(subTotalTimeArray, key);

                                    subtotalObj.Duration = $scope.calculateDuration(subtotalObj, key);

                                    if (subtotalObj.Duration.split(":")[0].length == 1) {

                                        var hours = "0" + subtotalObj.Duration.split(":")[0];

                                        subtotalObj.Duration = hours + ":" + subtotalObj.Duration.split(":")[1]
                                    }

                                    if (subtotalObj.Duration.split(":")[1].length == 1) {

                                        var mins = "0" + subtotalObj.Duration.split(":")[1];

                                        subtotalObj.Duration = subtotalObj.Duration.split(":")[0] + ":" + mins
                                    }

                                    keepGoing = false;

                                } else {

                                    newWorkType = true;
                                }
                            }
                        });

                        if (newWorkType) {

                            subtotalObject = $scope.getTimenewObj(key.Work_Type.Value, "SUB TOTAL", "", "", "", "", "", 0);

                            subTotalTimeArray = [];

                            angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecode, value) {

                                var codeobj = {};

                                codeobj[timecode.Overtimeshiftcode] = 0;

                                subTotalTimeArray.push(codeobj);
                            });

                            $scope.populateTimeCodeArray(subTotalTimeArray, key);

                            subtotalObject.timecode = subTotalTimeArray;

                            subtotalObject.Duration = $scope.calculateDuration(subtotalObject, key);

                            if (subtotalObject.Duration.split(":")[0].length == 1) {

                                var hours = "0" + subtotalObject.Duration.split(":")[0];

                                subtotalObject.Duration = hours + ":" + subtotalObject.Duration.split(":")[1];
                            }

                            if (subtotalObject.Duration.split(":")[1].length == 1) {

                                var mins = "0" + subtotalObject.Duration.split(":")[1];

                                subtotalObject.Duration = subtotalObject.Duration.split(":")[0] + ":" + mins;
                            }

                            subTotalArray.push(subtotalObject);
                        }

                    } else if (subTotalArray.length == 0) {

                        subtotalObject.Work_Type = key.Work_Type.Value;

                        $scope.populateTimeCodeArray(subTotalTimeArray, key);

                        subtotalObject.timecode = subTotalTimeArray;

                        subtotalObject.Duration = $scope.calculateDuration(subtotalObject, key);

                        if (subtotalObject.Duration.split(":")[0].length == 1) {

                            var hours = "0" + subtotalObject.Duration.split(":")[0];

                            subtotalObject.Duration = hours + ":" + subtotalObject.Duration.split(":")[1];
                        }

                        if (subtotalObject.Duration.split(":")[1].length == 1) {

                            var mins = "0" + subtotalObject.Duration.split(":")[1];

                            subtotalObject.Duration = subtotalObject.Duration.split(":")[0] + ":" + mins;
                        }

                        subTotalArray.push(subtotalObject);
                    }

                    var timeObject = $scope.getTimenewObj(key.Work_Type.Value, $filter("date")(key.Date, "dd-MM-yyyy "), key.Charge_Type.Value, key.Charge_Method.Value, key.Item.Value, key.Description, "", key.Duration);

                    timeObject.Duration = key.Duration;

                    var timecodearray = [];

                    angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecode, value) {

                        var codeobj = {};

                        if (key.Time_Code.Overtimeshiftcode == timecode.Overtimeshiftcode) {

                            codeobj[timecode.Overtimeshiftcode] = key.Duration;

                        } else {

                            codeobj[timecode.Overtimeshiftcode] = "";
                        }

                        timecodearray.push(codeobj);
                    });

                    timeObject.timecode = timecodearray;

                    $scope.summary.timeArray.push(timeObject)

                });

                grandtimeObject.timecode = grandTotalTimeArray;

                angular.forEach(subTotalArray, function (obj, value) {
                    $scope.summary.timeArray.push(obj);
                });

                $scope.summary.timeArray.push(grandtimeObject)
            }
        }
    }

    $scope.calculateDuration = function (obj, key) {

        obj.hours += key.DurationHours;

        obj.mins += key.DurationMinutes;

        var reminder = obj.mins % 60;

        obj.hours += Math.floor(obj.mins / 60);

        if (obj.mins >= 60)
            obj.mins = reminder;

        var duration = obj.hours + ":" + reminder;

        return obj.hours + ":" + reminder;

    }

    $scope.populateTimeCodeArray = function (timeArray, key) {

        angular.forEach(timeArray, function (timecode, value) {

            if (timecode.mins == undefined)
                timecode.mins = 0;

            if (timecode.hours == undefined)
                timecode.hours = 0;

            angular.forEach(timecode, function (shifkey, value) {

                if (value == key.Time_Code.Overtimeshiftcode) {

                    timecode[value] = $scope.calculateDuration(timecode, key);

                    if (timecode[value].split(":")[0].length == 1) {

                        var hours = "0" + timecode[value].split(":")[0];

                        timecode[value] = hours + ":" + timecode[value].split(":")[1]

                        var hours = "0" + timecode[value].split(":")[0];

                        timecode[value] = hours + ":" + timecode[value].split(":")[1];
                    }

                    if (timecode[value].split(":")[1].length == 1) {

                        var mins = "0" + timecode[value].split(":")[1];

                        timecode[value] = timecode[value].split(":")[0] + ":" + mins

                        var mins = "0" + timecode[value].split(":")[1];

                        timecode[value] = timecode[value].split(":")[0] + ":" + mins;
                    }
                }
            });
        });
    }

    $scope.getTimenewObj = function (worktype, date, chargetype, chargemethod, item, desc, commets, duration) {

        var timeObj =
            {
                "Date": date,
                "Charge_Type": chargetype,
                "Charge_Method": chargemethod,
                "Work_Type": worktype,
                "Item": item,
                "Description": desc,
                "Comments": commets,
                "Duration": duration,
                "mins": 0,
                "hours": 0
            }

        return timeObj;
    }

    $(function () {

        $("#datetimepickerStartDate").datetimepicker();

        $("#datetimepickerEndDate").datetimepicker();
    });

    var doc1 = jsPDF('p', 'mm', [700, 850]);

    $(function () {

        setTimeout(function () {

            $("#cmd").click(function () {


                var filePath = cordova.file.dataDirectory;

                valueService.openFile(filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", "application/pdf", function () {

                    $rootScope.apicall = true;

                    var promise = generatePDF();


                    promise.then(function () {

                        $rootScope.apicall = false;

                        var filePath = cordova.file.dataDirectory;

                        valueService.openFile(filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", "application/pdf");

                    });
                });
            });

        }, 1000);

        setTimeout(function () {

            $("#cmd1").click(function () {

                //doc1.save("Report_" + $scope.summary.taskObject.Task_Number + ".pdf");
                var filePath = cordova.file.dataDirectory;

                valueService.openFile(filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", "application/pdf", function () {

                    $rootScope.apicall = true;

                    var promise = generatePDF();

                    promise.then(function () {

                        $rootScope.apicall = true;

                        var filePath = cordova.file.dataDirectory;

                        valueService.openFile(filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", "application/pdf");
                    });
                });
            });
        }, 1000);
    });

    $scope.customersubmit = false;

    $scope.customerSubmit = function () {

        $scope.customersubmit = true;

        $scope.isSubmitted = true;
        $rootScope.apicall = true;
        var promise = generatePDF();

        promise.then(function () {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

                fs.root.getFile("Report_" + $scope.summary.taskObject.Task_Number + ".pdf", {
                    create: true,
                    exclusive: false
                }, function (fileEntry) {

                    fileEntry.file(function (file) {

                        var reader = new FileReader();

                        reader.onloadend = function () {

                            console.log("Successful file read: " + this.result);

                            $scope.reportBase64 = this.result.split(",")[1];
                            constantService.setCCEmailID(customerMail.value);
                            var email = {"Email": customerMail.value, "Task_Number": $scope.taskId}
                            localService.updateTaskEmail(email);
                            $scope.saveValues();
                            valueService.saveValues();

                            if (valueService.getNetworkStatus()) {

                                valueService.acceptTask(valueService.getTask().Task_Number);

                                var timeJSONData = [];
                                var expenseJSONData = [];
                                var materialJSONData = [];
                                var noteJSONData = [];
                                var attachmentJSONData = [];

                                var timeArray = $scope.timeArray;
                                var expenseArray = $scope.expenseArray;
                                var materialArray = $scope.materialArray;
                                var notesArray = $scope.notesArray;

                                for (var i = 0; i < timeArray.length; i++) {

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
                                        "start_date": moment.utc(timeArray[i].Date).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                                        "end_date": moment.utc(timeArray[i].Date).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                                        "charge_method": timeArray[i].Charge_Method_Id,
                                        "JobName": timeArray[i].Field_Job_Name_Id
                                    }

                                    timeJSONData.push(timeData);
                                }

                                for (var i = 0; i < expenseArray.length; i++) {

                                    var expenseData = {
                                        "taskId": expenseArray[i].Task_Number,
                                        "comments": expenseArray[i].Justification,
                                        "currency": expenseArray[i].Currency_Id.toString(),
                                        "chargeMethod": expenseArray[i].Charge_Method_Id.toString(),
                                        "ammount": expenseArray[i].Amount,
                                        "date": moment.utc(expenseArray[i].Date).format("YYYY-MM-DD"),
                                        "expenseItem": expenseArray[i].Expense_Type_Id.toString()
                                    }

                                    expenseJSONData.push(expenseData);
                                }

                                for (var i = 0; i < materialArray.length; i++) {

                                    angular.forEach(materialArray[i].Serial_Type, function (key) {

                                        var materialData = {
                                            "charge_method": materialArray[i].Charge_Type_Id.toString(),
                                            "task_id": materialArray[i].Task_Number,
                                            "item_description": materialArray[i].Description,
                                            "product_quantity": "1",
                                            "comments": "",
                                            "item": materialArray[i].ItemName,
                                            "serialin": key.in,
                                            "serialout": key.out,
                                            "serial_number": key.number
                                        }

                                        materialJSONData.push(materialData);
                                    });
                                }

                                for (var i = 0; i < notesArray.length; i++) {

                                    var noteData = {
                                        "Notes_type": notesArray[i].Note_Type_Id,
                                        "notes_description": notesArray[i].Notes,
                                        "task_id": notesArray[i].Task_Number,
                                        "mobilecreatedDate": moment.utc(notesArray[i].Date).format("YYYY-MM-DDTHH:mm:ss.000Z")
                                    };

                                    noteJSONData.push(noteData);
                                }

                                for (var i = 0; i < $scope.files.length; i++) {

                                    var attachmentObject = {
                                        "Data": $scope.files[i].base64,
                                        "FileName": $scope.files[i].filename,
                                        "Description": $scope.files[i].fileDisc,
                                        "Name": $scope.files[i].filename,
                                        "taskId": $rootScope.selectedTask.Task_Number,
                                        "contentType": $scope.files[i].contentType
                                    };

                                    attachmentJSONData.push(attachmentObject);
                                }

                                var reportObj = {
                                    "Data": $scope.reportBase64,
                                    "FileName": "Report_" + $scope.summary.taskObject.Task_Number + ".pdf",
                                    "Description": "Report_" + $scope.summary.taskObject.Task_Number + ".pdf",
                                    "Name": "Report_" + $scope.summary.taskObject.Task_Number + ".pdf",
                                    "taskId": $rootScope.selectedTask.Task_Number,
                                    "contentType": "application/pdf"
                                }

                                attachmentJSONData.push(reportObj);

                                var timeUploadJSON = {
                                    "Time": timeJSONData
                                };

                                var expenseUploadJSON = {
                                    "expense": expenseJSONData
                                };

                                var notesUploadJSON = {
                                    "Notes": noteJSONData
                                };

                                var materialUploadJSON = {
                                    "Material": materialJSONData
                                };

                                var attachmentUploadJSON = {
                                    "attachment": attachmentJSONData
                                };

                                cloudService.uploadTime(timeUploadJSON, function (response) {

                                    console.log("Uploaded Time " + JSON.stringify(response));

                                    cloudService.uploadExpense(expenseUploadJSON, function (response) {

                                        console.log("Uploaded Expense " + JSON.stringify(response));

                                        cloudService.uploadNote(notesUploadJSON, function (response) {

                                            console.log("Uploaded Notes " + JSON.stringify(response));

                                            cloudService.uploadMaterial(materialUploadJSON, function (response) {

                                                console.log("Uploaded Material " + JSON.stringify(response));

                                                if ($scope.files != undefined && $scope.files.length > 0) {

                                                    cloudService.createAttachment(attachmentUploadJSON, function (response) {

                                                        console.log("Uploaded Attachment " + JSON.stringify(response));
                                                        setTimeout(function () {

                                                            var formData = {
                                                                "taskid": $scope.taskId,
                                                                "taskstatus": "Completed",
                                                                "email": constantService.getCCEmailID(),
                                                                "requestDate": moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.000+00:00"),
                                                                "completeDate": moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.000+00:00"),
                                                                "followUp": $scope.engineerObject.followUp.toString(),
                                                                "salesQuote": $scope.engineerObject.salesQuote.toString(),
                                                                "salesVisit": $scope.engineerObject.salesVisit.toString(),
                                                                "salesLead": $scope.engineerObject.salesLead.toString(),
                                                                "followuptext": $scope.engineerObject.Follow_Up,
                                                                "sparequotetext": $scope.engineerObject.Spare_Quote,
                                                                "salesText": $scope.engineerObject.Sales_Visit,
                                                                "salesleadText": $scope.engineerObject.Sales_Head
                                                            };

                                                            cloudService.updateAcceptTask(formData, function (response) {

                                                                console.log("Task Completed " + JSON.stringify(response));

                                                                var taskObject = {
                                                                    Task_Status: "Completed",
                                                                    Task_Number: $scope.taskId,
                                                                    Submit_Status: "I"
                                                                };

                                                                localService.updateTaskSubmitStatus(taskObject);

                                                                cloudService.getTaskList(function (response) {

                                                                });
                                                            });

                                                        }, 3000);
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });


                            } else {

                                var taskObject = {
                                    Task_Status: "Completed",
                                    Task_Number: valueService.getTask().Task_Number,
                                    Submit_Status: "P"
                                };

                                localService.updateTaskSubmitStatus(taskObject);

                                localService.getTaskList(function (response) {

                                    constantService.setTaskList(response);
                                    $rootScope.apicall = false;
                                });
                            }

                        };

                        reader.readAsDataURL(file);
                    });
                });
            });

        }, function (reason) {

        });

    }

    $scope.SaveSign = function () {

        console.log("Inside save sign");

        console.log($rootScope.signature);

        $scope.summary.engineer = {};

        $scope.summary.engineer.signature = $rootScope.signature;


        $scope.selectedIndex = $scope.stages.findIndex(x => x.title == "Summary"
    )
        ;
        console.log($scope.selectedIndex);
    }

//Start Date Calendar functions
    $scope.today = function () {
        $scope.startDate = new Date();
    };

    $scope.today();

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: "yy",
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

// Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.openCalendar = function (index, stage) {

        switch (stage) {

            case "Time":

                for (var i = 0; i < $scope.timeArray.length; i++) {

                    if ($scope.timeArray[i] == index) {

                        $scope.timeArray[i].calendarOpened = true;
                    }
                }

            case "Expenses":

                for (var i = 0; i < $scope.expenseArray.length; i++) {

                    if ($scope.expenseArray[i] == index) {

                        $scope.expenseArray[i].calendarOpened = true;
                    }
                }

            case "Notes":

                for (var i = 0; i < $scope.notesArray.length; i++) {

                    if ($scope.notesArray[i] == index) {

                        $scope.notesArray[i].calendarOpened = true;
                    }
                }
        }
    };

    $scope.setDate = function (year, month, day) {
        $scope.startDate = new Date(year, month, day);
    };

    $scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd/MM/yyyy", "shortDate"];

    $scope.format = $scope.formats[2];

    $scope.altInputFormats = ["M!/d!/yyyy"];

    $scope.popup1 = {
        opened: false
    };

    function getDayClass(data) {

        var date = data.date, mode = data.mode;

        if (mode === "day") {

            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {

                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return "";
    }

    $scope.setDuration = function (index) {

        var d = new Date();

        d.setHours(8, 0, 0);

        $scope.timeArray[index].Duration = moment(d).format("hh:mm");

        $scope.timeArray[index].DurationHours = d.getHours()
    };

    $scope.setDurationHours = function (item) {

        if (item.Duration != undefined && item.Duration != "") {

            item.DurationHours = parseInt(item.Duration.split(":")[0]);

            item.DurationMinutes = parseInt(item.Duration.split(":")[1]);
        }
    };

    $scope.file = "";

    $scope.files = [];

    $scope.image = [];

    $scope.uploadImage = function (file) {

        // if (file != null)
        //     $scope.image.push(file);
        if (file != null) {

            var name = file.name.split(".")[0];

            var type = file.name.split(".")[1];

            var fileobj = {"filename": file.name, "fileDisc": name, "file": file, "filetype": type, "data": ""};

            var fileObject = null;

            Upload.base64DataUrl(file).then(function (urls) {

                console.log(urls);

                fileobj.data = urls;
                fileobj.contentType = fileobj.data.split(",")[0].split(";")[0].split(":")[1];
                fileobj.base64 = fileobj.data.split(",")[1];
                $scope.image.push(fileobj);

                console.log($scope.files);
                //  var fileData=urls.split(",")[1];
                //  console.log(fileData);
                //  var contentTypeOfFile= urls.split(",")[0].split(";")[0];
                //  console.log(contentTypeOfFile);
                // fileObject ={
                //   "Data":urls.split(",")[1],
                //   "FileName":name,
                //   "Description":name,
                //   "Name":name,
                //   "taskId":$rootScope.selectedTask.Task_Number,
                //   "contentType":contentTypeOfFile
                // };
                //  $scope.files.push(fileObject);
                //  console.log($scope.files);
            });
        }
    }

    $scope.uploadFiles = function (file) {

        if (file != null) {

            var name = file.name.split(".")[0];

            var type = file.name.split(".")[1];

            var fileobj = {"filename": file.name, "fileDisc": name, "file": file, "filetype": type, "data": ""};

            var fileObject = null;

            Upload.base64DataUrl(file).then(function (urls) {

                console.log(urls);

                fileobj.data = urls;
                fileobj.contentType = fileobj.data.split(",")[0].split(";")[0].split(":")[1];
                fileobj.base64 = fileobj.data.split(",")[1];
                $scope.files.push(fileobj);

                console.log($scope.files);
                //  var fileData=urls.split(",")[1];
                //  console.log(fileData);
                //  var contentTypeOfFile= urls.split(",")[0].split(";")[0];
                //  console.log(contentTypeOfFile);
                // fileObject ={
                //   "Data":urls.split(",")[1],
                //   "FileName":name,
                //   "Description":name,
                //   "Name":name,
                //   "taskId":$rootScope.selectedTask.Task_Number,
                //   "contentType":contentTypeOfFile
                // };
                //  $scope.files.push(fileObject);
                //  console.log($scope.files);
            });
        }
    }

    $scope.reviewSummary = function () {

        $scope.selectedIndex = $scope.stages.findIndex(x => x.title == "Customer Signature"
    )

    }

    function generatePDF() {

        var defer = $q.defer();
        var language=valueService.getLanguage();
        setTimeout(function () {
            if(language=="ch"){
            var canvas = document.getElementById('canvas');
              if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                var pdfimg='data:image/png;base64,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'
                var excelimg='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCwEGLDTCqNdaAAADfklEQVRo3u2ZTUhUURTHf8+vUsuK7MNKKCenCT/HohKkoo2gtQyiqCiCqDZFCxcVfRBRrqJFUARZUAS1aBGhrSQNIiiDEMrACKkIE1TKonJeC193zvsanZk7MxvP29zzce/5v3PvPee++wySI4MAdYSpYwXBRAbISchtDqsttzUUWbKRxN4gHgD5VBMmTB1VzEgianECmEPYchsiW5fbyQEsskIcpky/U38Ay5XbktS6lQCyWWWFuJZ56XIrAYxSoHG8AzRM2daki7tganqGAWiLs9e1rPQH3UY7Mg2gKNMAmAaQWDHypzd0CK6QBqCX7y67tdG0rncb2imEickGD83w/34Zn4JpAM5F+JGHgltHvUP/lB7VDrDVNV4VSwW3DICNLHbZ5Uab9qX0m5AwCzFu0/6wlelODbXAdO+CdhvSBzbdBaHZpaUYmV7bcJtws0bIh5ij5EV8SR2A9+QJCB1KflxIL2sqx6aB6bE0W2hV7U10AjBAkF+WrJpXrgPqCHNxHkgW0AQ8ZtDlYWd0GXrhGrWt22eYmOxTvEH3FDPhhskzoV8qbhPGWzHpFW+8d8qpOAkAEdaJN+7noOLm8lUnAL9MaHAFQ03STe4rzXkWopH8y/F69nDLal/kj9Wq41DM8ZqpElwpALvZ7LITn3b+W+Qzs11xee5rPTEFcW/DWMWohBMOyX7W+1qbJESxq6Fzrw/FsDVIkPzD0+/xzfRI9xQYMULXyBOrVcCY1VpBL/me1hOZ0LkIDwNXGXBZn2bmZBG4Lcwvi/bJmBGwUxKJaJBiZRxgXNz/5PEuHYnoGN9U+xxZnFXcb46glbzeRp7ta4lgEqFWyO7pi4DXIhyjkg+Ka6cRgMc0K9kS3rqSlMZyLA8eW4RcDn1U1zZ0A3hpSz8vhKZLyLN5nRoAfwkLN9sd2iahqyeSCgCtwkUOfQ5tjy3h3tABwF6OTeCM4soodyydWq7zSXE/PVb3FduHTZBLQAt9Lrs70TQfb8j8nmEPOEkkorTRNADdVzSnRL6EWQDc8LiimZUqAAGPQ1tFrA4Zn4JpAJkGMJppAPdy+CMvjJKm7jhsTbq4a5BHhfWfqIbCJFxPnIjiJllesyhXf4+K4x5JAwBJpepvYWlmAERpvgUlTDDmnkkZgCgVUmNBqbTdo6UNQJRyqbCg1KjjeVoByP4rrT2U4O/7f0/9ov/AQQ2NAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTAxVDA2OjQ0OjUyKzAxOjAwfVk/DQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0wMVQwNjo0NDo1MiswMTowMAwEh7EAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'


                //Customer Call heading
                ctx.fillStyle ="#000" ;
                ctx.font = '15px sans-serif';
                ctx.fillText('客户具体服务需求', 10,70);

                //Customer Call Labels and fields
                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('客户名', 20,98);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                ctx.fillText($scope.summary.taskObject.Customer_Name, 20,112);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('服务日期', 200,98);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                var start=  moment.utc($scope.summary.taskObject.times[0].Start_Date).utcOffset(constantService.getTimeZone()).format("DD/MM/YYYY")
                if(start)
                ctx.fillText(start, 200,112);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('结束日期', 350,98);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                var enddate=" ";
          if($scope.summary.taskObject.times[0].End_Date!="" && $scope.summary.taskObject.times[0].End_Date!=undefined)
          {
              enddate=moment.utc( $scope.summary.taskObject.times[0].End_Date).utcOffset(constantService.getTimeZone()).format("DD/MM/YYYY");
          }
                ctx.fillText(enddate, 350,112);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('服务持续时间', 500,98);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                if( $scope.summary.taskObject.times[0].Duration)
                ctx.fillText( $scope.summary.taskObject.times[0].Duration, 500,112);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('服务请求', 20,138);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                if($scope.summary.taskObject.Service_Request)
                ctx.fillText($scope.summary.taskObject.Service_Request, 20,152);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('现场服务号', 200,138);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                  if( $scope.summary.taskObject.Task_Number)
                ctx.fillText($scope.summary.taskObject.Task_Number, 200,152);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('工作描述', 350,138);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                ctx.fillText('To run the field', 350,152);

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('产品系列', 20,182);



                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('系统序列号/产品序列号', 200,182);


                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('标签#', 350,182);


                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText('原始订单号#', 500,182);



                var ibyvalue=196;
                if($scope.summary.taskObject.InstallBase){
                  angular.forEach($scope.summary.taskObject.InstallBase,function(key)
                  {
                    ctx.fillStyle ="#000" ;
                    ctx.font = '13px sans-serif ';
                      if(key.Product_Line)
                      ctx.fillText( key.Product_Line,20, ibyvalue)
                      else
                      ctx.fillText('NO VALUE',20, ibyvalue)


                      ctx.fillStyle ="#000" ;
                      ctx.font = '13px sans-serif ';
                      if(key.Serial_Number)
                      ctx.fillText(key.Serial_Number,200, ibyvalue )
                      else
                      ctx.fillText('NO VALUE',200, ibyvalue )

                      ctx.fillStyle ="#000" ;
                      ctx.font = '13px sans-serif ';
                      if(key.TagNumber)
                      ctx.fillText( key.TagNumber,350, ibyvalue)
                      else
                      ctx.fillText('NO VALUE',350, ibyvalue )

                      ctx.fillStyle ="#000" ;
                      ctx.font = '13px sans-serif ';
                      if(key.Original_PO_Number)
                      ctx.fillText( key.Original_PO_Number,450, ibyvalue)
                      else
                      ctx.fillText('NO VALUE',450, ibyvalue )
                      ibyvalue=ibyvalue+14;
                  });
                }


                var i = 0, xNotesField = 20, yNotesField = ibyvalue+35, rectNotesWidth = 650,
                    rectNotesHeight = 22 * $scope.summary.notesArray.length,
                    rectNotesX = 20, rectNotesY = 170;
                    var xNotesField1 = xNotesField, xNotesField2 = xNotesField1 + 150, yNotesField1 = yNotesField + 22,
                    yNotesField2, yNotesField1_val, yNotesField2_val;





                    ctx.fillStyle ="#000" ;
                    ctx.font = 'bold 13px sans-serif ';
                    ctx.fillText('备注类型', 20,yNotesField1);

                    ctx.fillStyle ="#000" ;
                    ctx.font = 'bold 13px sans-serif ';
                    ctx.fillText('备注', 200,yNotesField1);

                    ctx.fillStyle ="#000" ;
                    ctx.font = '15px sans-serif ';
                    ctx.fillText('备注', 10,yNotesField);

                    while (i < $scope.summary.notesArray.length) {
                        xNotesField1 = xNotesField;

                        yNotesField1_val = yNotesField1 + 14 * ++i;
                        xNotesField2 = xNotesField1 + 150;


                        ctx.fillStyle ="#000" ;
                        ctx.font = '13px sans-serif ';
                        ctx.fillText($scope.summary.notesArray[i - 1].Note_Type, 20,yNotesField1_val);


                        ctx.fillStyle ="#000" ;
                        ctx.font = '13px sans-serif ';
                        ctx.fillText($scope.summary.notesArray[i - 1].Notes, 200,yNotesField1_val);
                    }
                    rectNotesHeight=yNotesField1_val-yNotesField+10;


                                  var xAttachField = 25, yAttachField = yNotesField1_val  + 30, rectAttachWidth = 650,
                          rectAttachHeight = 135,xAttachField1=25;

                          ctx.fillStyle ="#000" ;
                          ctx.font = '15px sans-serif ';
                          ctx.fillText('附件', 10,yAttachField);

                          ctx.fillStyle= "#000" ;
                          ctx.strokeRect(10,yAttachField + 10,1010,rectAttachHeight);
                          angular.forEach($scope.files,function(file,value){

                            var attachfile = document.getElementById(file.filename);
                            var callback = function(image) {
                            if(!image) image = this;
                              ctx.drawImage(attachfile, xAttachField1, yAttachField+15);
                              if(file.filename.length>=20){
                                ctx.fillStyle ="#000" ;
                                ctx.font = '15px sans-serif ';
                                ctx.fillText(file.filename.substr(0,18)+'..', xAttachField1,yAttachField+125);
                              }

                              else {
                                ctx.fillStyle ="#000" ;
                                ctx.font = '15px sans-serif ';
                                ctx.fillText(file.filename, xAttachField1,yAttachField+125);
                              }
                              xAttachField1+=100;
                            };

                            if(attachfile.complete) {
                               callback(attachfile);
                            }else {
                               attachfile.onload = callback;
                            }

                          //     if(file.filetype!="pdf" && file.filetype!="xlsx" ){
                           //
                          //         var attachfile = document.getElementById(file.filename);
                          //         var callback = function(image) {
                          //  if(!image) image = this;
                          //           ctx.drawImage(attachfile, xAttachField1, yAttachField+15);
                          //           if(file.filename.length>=20){
                          //             ctx.fillStyle ="#000" ;
                          //             ctx.font = '15px sans-serif ';
                          //             ctx.fillText(file.filename.substr(0,18)+'..', xAttachField1,yAttachField+125);
                          //           }
                           //
                          //           else {
                          //             ctx.fillStyle ="#000" ;
                          //             ctx.font = '15px sans-serif ';
                          //             ctx.fillText(file.filename, xAttachField1,yAttachField+125);
                          //           }
                          //           xAttachField1+=100;
                          //         };
                           //
                          //         if(attachfile.complete) {
                          //            callback(attachfile);
                          //         }else {
                          //            attachfile.onload = callback;
                          //         }
                          //       }
                          //     else if(file.filetype=="pdf"){
                           //
                          //     var imgpdf = document.getElementById('pdf');
                          //             var callback = function(image) {
                          //      if(!image) image = this;
                           //
                          //      ctx.drawImage(image, xAttachField1, yAttachField+15);
                          //      if(file.filename.length>=20){
                          //        ctx.fillStyle ="#000" ;
                          //        ctx.font = '15px sans-serif ';
                          //        ctx.fillText(file.filename.substr(0,18)+'..', xAttachField1,yAttachField+125);
                          //      }
                           //
                          //      else {
                          //        ctx.fillStyle ="#000" ;
                          //        ctx.font = '15px sans-serif ';
                          //        ctx.fillText(file.filename, xAttachField1,yAttachField+125);
                          //      }
                          //     xAttachField1+=75;
                          //   }
                          //   if(imgpdf.complete) {
                          //      callback(imgpdf);
                          //   }else {
                          //      imgpdf.onload = callback;
                          //   }
                          //   }
                           //
                          //     else if(file.filetype=="xlsx"){
                          //     var attachfileexcel = new Image();
                          //     attachfileexcel.onload = function() {
                          //       ctx.drawImage(attachfileexcel, xAttachField1, yAttachField+15);
                          //       if(file.filename.length>=20){
                          //         ctx.fillStyle ="#000" ;
                          //         ctx.font = '15px sans-serif ';
                          //         ctx.fillText(file.filename.substr(0,18)+'..', xAttachField1,yAttachField+125);
                          //       }
                           //
                          //       else {
                          //         ctx.fillStyle ="#000" ;
                          //         ctx.font = '15px sans-serif ';
                          //         ctx.fillText(file.filename, xAttachField1,yAttachField+125);
                          //       }
                          //       xAttachField1+=75;
                          //     };
                          //     attachfileexcel.src = excelimg;
                          //     attachfileexcel.width="50";
                          //     attachfileexcel.height="40";
                          //   }

                          })

                var j = 0, xTimeField = 25, yTimeField = yAttachField + rectAttachHeight + 25, rectTimeWidth = 650,
        rectTimeHeight = 22 * $scope.summary.timeArray.length, yTimeFieldName = yTimeField + 20,
        yTimeFieldValue = yTimeField;

        ctx.fillStyle ="#000" ;
        ctx.font = '15px sans-serif ';
        ctx.fillText('时间', 10,yTimeField);

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 13px sans-serif ';
        ctx.fillText('日期', 20,yTimeFieldName);


        if($scope.userType=='C')
        {

            ctx.fillStyle ="#000" ;
            ctx.font = 'bold 13px sans-serif ';
            ctx.fillText('结算类型',100,yTimeFieldName);

            ctx.fillStyle ="#000" ;
            ctx.font = 'bold 13px sans-serif ';
            ctx.fillText('结算方式', 180,yTimeFieldName);

        }

        ctx.fillStyle ="#000" ;
        ctx.font = '13px sans-serif ';
        ctx.fillText('收费与否', 250,yTimeFieldName);

        var xTimeField1 = 290;
        if($scope.userType=='C')
        {
            angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecodeKey, value) {
                xTimeField1 = xTimeField1 + 50;

                ctx.fillStyle ="#000" ;
                ctx.font = 'bold 13px sans-serif ';
                ctx.fillText(timecodeKey.Overtimeshiftcode, xTimeField1,yTimeFieldName);

            });
        }

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 13px sans-serif ';
        ctx.fillText('服务持续时间', 700,yTimeFieldName);

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 13px sans-serif ';
        ctx.fillText('服务类别', 780,yTimeFieldName);

        ctx.fillStyle ="#000" ;
        ctx.font = '13px sans-serif ';
        ctx.fillText('路途-加班', 965,yTimeFieldName);

        ctx.fillStyle= "#000" ;
        ctx.strokeRect(10,yTimeField + 5,1010,rectTimeHeight);
        while (j < $scope.summary.timeArray.length) {

            yTimeFieldName = yTimeField + 20 * ++j;
            yTimeFieldValue = yTimeFieldName + 10;

            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            if ($scope.summary.timeArray[j - 1].Date)
            ctx.fillText($scope.summary.timeArray[j - 1].Date, 20,yTimeFieldValue);

            doc1.setFontSize(22)
            doc1.setFontType('normal')
            if($scope.userType=='C')
            {

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                if ($scope.summary.timeArray[j - 1].Charge_Type)
                ctx.fillText($scope.summary.timeArray[j - 1].Charge_Type, 100,yTimeFieldValue);

                ctx.fillStyle ="#000" ;
                ctx.font = '13px sans-serif ';
                  if ($scope.summary.timeArray[j - 1].Charge_Method)
                ctx.fillText($scope.summary.timeArray[j - 1].Charge_Method, 180,yTimeFieldValue);
            }

            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            if ($scope.summary.timeArray[j - 1].Work_Type)
            ctx.fillText( $scope.summary.timeArray[j - 1].Work_Type, 250,yTimeFieldValue);
            var a = 2;
            if($scope.userType=='C')
            {
                angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecodeKey, value) {

                    angular.forEach($scope.summary.timeArray[j - 1].timecode, function (key, value) {
                        console.log($scope.summary.timeArray[j - 1].timecode[value][timecodeKey.Overtimeshiftcode])
                        if ($scope.summary.timeArray[j - 1].timecode[value][timecodeKey.Overtimeshiftcode] != undefined) {


                            ctx.fillStyle ="#000" ;
                            ctx.font = '13px sans-serif ';
                            ctx.fillText($scope.summary.timeArray[j - 1].timecode[value][timecodeKey.Overtimeshiftcode].toString(), xTimeField1 - 50 * a,yTimeFieldValue);
                            a--;

                        }
                        else {

                        }

                    })

                })
            }

            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            ctx.fillText($scope.summary.timeArray[j - 1].Duration.toString(), 700,yTimeFieldValue);


            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            ctx.fillText( $scope.summary.timeArray[j - 1].Item, 780,yTimeFieldValue);


            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            ctx.fillText( $scope.summary.timeArray[j - 1].Description, 965,yTimeFieldValue);
        }

                //Expenses heading



                var k = 0, xExpenseField = 25, yExpenseField = yTimeField + rectTimeHeight + 25, rectExpenseWidth = 650,
        rectExpenseHeight = 22 * $scope.summary.expenseArray.length, yExpenseFieldName = yExpenseField + 20,
        yExpenseFieldValue;

        ctx.fillStyle ="#000" ;
        ctx.font = '15px sans-serif ';
        ctx.fillText('费用', 10,yExpenseField + 5);

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 12px sans-serif ';
        ctx.fillText('日期', 20,yExpenseFieldName);

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 12px sans-serif ';
        ctx.fillText('费用种类', 200,yExpenseFieldName);

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 12px sans-serif ';
        ctx.fillText('结算方式', 350,yExpenseFieldName);

        ctx.fillStyle ="#000" ;
        ctx.font = 'bold 12px sans-serif ';
        ctx.fillText('阐述', 500,yExpenseFieldName);

        while (k < $scope.summary.expenseArray.length) {

            yExpenseFieldValue = yExpenseFieldName + 15 * ++k;


            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            if ($scope.summary.expenseArray[k - 1].Date)
            ctx.fillText($scope.summary.expenseArray[k - 1].Date, 20,yExpenseFieldValue);

            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
              if ($scope.summary.expenseArray[k - 1].Expense_Type)
            ctx.fillText($scope.summary.expenseArray[k - 1].Expense_Type, 200,yExpenseFieldValue);


            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
              if ($scope.summary.expenseArray[k - 1].Charge_Method)
            ctx.fillText($scope.summary.expenseArray[k - 1].Charge_Method, 350,yExpenseFieldValue);


            ctx.fillStyle ="#000" ;
            ctx.font = '13px sans-serif ';
            if ($scope.summary.expenseArray[k - 1].Justification)
            ctx.fillText($scope.summary.expenseArray[k - 1].Justification, 500,yExpenseFieldValue);
        }
        rectExpenseHeight=yExpenseFieldValue-yExpenseFieldName+15;

        ctx.fillStyle= "#000" ;
        ctx.strokeRect(10,yExpenseField + 10,1010,rectExpenseHeight);




                var l = 0, xMaterialField = 25, yMaterialField = yExpenseField + rectExpenseHeight + 25,
          rectMaterialWidth = 650, rectMaterialHeight = 25 * $scope.summary.materialArray.length,
          yMaterialFieldName = yMaterialField + 20, yMaterialFieldValue;

          ctx.fillStyle ="#000" ;
          ctx.font = '15px sans-serif ';
          ctx.fillText('物料', 10,yMaterialField + 5);

          ctx.fillStyle ="#000" ;
          ctx.font = 'bold 13px sans-serif ';
          ctx.fillText('结算类型', 20,yMaterialFieldName);

          ctx.fillStyle ="#000" ;
          ctx.font = 'bold 13px sans-serif ';
          ctx.fillText('产品数量', 150,yMaterialFieldName);

          ctx.fillStyle ="#000" ;
          ctx.font = 'bold 13px sans-serif ';
          ctx.fillText('序列号#', 280,yMaterialFieldName);

          ctx.fillStyle ="#000" ;
          ctx.font = 'bold 13px sans-serif ';
          ctx.fillText('已更换产品序列号#', 510,yMaterialFieldName);

          ctx.fillStyle ="#000" ;
          ctx.font = 'bold 13px sans-serif ';
          ctx.fillText('原产品序列号#', 700,yMaterialFieldName);

          ctx.fillStyle ="#000" ;
          ctx.font = 'bold 13px sans-serif ';
          ctx.fillText('具体描述', 870,yMaterialFieldName);

          yMaterialFieldValue = yMaterialFieldName + 10;

          while (l < $scope.summary.materialArray.length) {
  var m=0,n=0,o=0;
              ++l;

              ctx.fillStyle ="#000" ;
              ctx.font = '13px sans-serif ';
              if ($scope.summary.materialArray[l - 1].Charge_Type)
              ctx.fillText($scope.summary.materialArray[l - 1].Charge_Type, 20,yMaterialFieldValue);


              ctx.fillStyle ="#000" ;
              ctx.font = ' 13px sans-serif ';
                  if ($scope.summary.materialArray[l - 1].Product_Quantity)
              ctx.fillText($scope.summary.materialArray[l - 1].Product_Quantity.toString(), 150,yMaterialFieldValue);

              ctx.fillStyle ="#000" ;
              ctx.font = ' 13px sans-serif ';
              if ($scope.summary.materialArray[l - 1].serialNumber[m]!=""){
              while(m<$scope.summary.materialArray[l - 1].serialNumber.length){
                ctx.textAlign = "start";
                yMaterialSerialNo=yMaterialFieldValue+15*m;
              ctx.fillText($scope.summary.materialArray[l - 1].serialNumber[m++], 280,yMaterialSerialNo);
            }
            }


              ctx.fillStyle ="#000" ;
              ctx.font = ' 13px sans-serif ';
              if ($scope.summary.materialArray[l - 1].serialIn[n]!=""){
              while(n<$scope.summary.materialArray[l - 1].serialIn.length){
                ctx.textAlign = "start";
                yMaterialSerialIn=yMaterialFieldValue+15*n;
              ctx.fillText($scope.summary.materialArray[l - 1].serialIn[n++], 510,yMaterialSerialIn);
}
}

              ctx.fillStyle ="#000" ;
              ctx.font = ' 13px sans-serif ';
                if ($scope.summary.materialArray[l - 1].serialOut[o]!=""){
                  while(o<$scope.summary.materialArray[l - 1].serialOut.length){
                    ctx.textAlign = "start";
                    yMaterialSerialOut=yMaterialFieldValue+15*o;
              ctx.fillText($scope.summary.materialArray[l - 1].serialOut[o++], 700,yMaterialSerialOut);
}
}

              ctx.fillStyle ="#000" ;
              ctx.font = ' 13px sans-serif ';
              if ($scope.summary.materialArray[l - 1].ItemName)
              ctx.fillText($scope.summary.materialArray[l - 1].ItemName, 870,yMaterialFieldValue);



              yMaterialFieldValue=yMaterialFieldValue + 10 * $scope.summary.materialArray[l-1].Product_Quantity;
          }
          rectMaterialHeight= yMaterialFieldValue-yMaterialFieldName+10;

          ctx.fillStyle= "#000" ;
          ctx.strokeRect(10,yMaterialField + 10,1010,rectMaterialHeight);



                var xSignField = 25, ySignField = yMaterialFieldValue + 20, rectSignWidth = 650,
                    rectSignHeight = 80;


                    ctx.fillStyle ="#000" ;
                    ctx.font = '15px sans-serif ';
                    ctx.fillText('签字', 10,ySignField + 5);

                    ctx.fillStyle= "#000" ;
                    ctx.strokeRect(10,ySignField + 10,1010,rectSignHeight);

                    ctx.fillStyle ="#000" ;
                    ctx.font = 'bold 13px sans-serif ';
                    ctx.fillText('工程师名字', 20,ySignField + 20);

                    ctx.fillStyle ="#000" ;
                    ctx.font = 'bold 13px sans-serif ';
                    ctx.fillText('客户名', 350,ySignField + 20);

                    ctx.fillStyle ="#000" ;
                    ctx.font = '13px sans-serif ';
                    ctx.fillText($scope.engineerName, 20,ySignField + 35);

                    ctx.fillStyle ="#000" ;
                    ctx.font = '13px sans-serif ';
                    ctx.fillText($scope.summary.taskObject.Customer_Name, 350,ySignField + 35);

                    var engineerSignature =document.getElementById('engineerSignature');

var callback1 = function(image) {
if(!image) image = this;
ctx.drawImage(image, 20,ySignField + 45,75,40);
}
if(engineerSignature.complete) {
callback1(engineerSignature);
}else {
engineerSignature.onload = callback1;
}


                ctx.fillStyle= "#000" ;
                ctx.strokeRect(10,80,1010,ibyvalue-60);

                ctx.fillStyle= "#000" ;
                ctx.strokeRect(10,yNotesField+5,1010,rectNotesHeight);//doc1.rect(20, yNotesField+5, rectNotesWidth, rectNotesHeight)
                var imgSign = document.getElementById('logo');
                        var callback = function(image) {
                 if(!image) image = this;
                 ctx.drawImage(image, 10, 5,140,40);
              }
              if(imgSign.complete) {
                 callback(imgSign);
              }else {
                 imgSign.onload = callback;
              }
              ctx.fillStyle ="#000" ;
              ctx.font = 'bold 18px sans-serif ';
              ctx.fillText('Field Service Summary Report', 270,25);

              ctx.fillStyle ="#000" ;
              ctx.font = '11px sans-serif ';
              ctx.fillText('艾默生过程控制有限公司', 670,12);
              ctx.fillText('上海市浦东新区金桥出口加工区新金桥路1277号，201206', 670,24);
              ctx.fillText('服务热线：400-820-1996', 670,36);

              ctx.fillStyle= "#000" ;
              ctx.strokeRect(10,0,1010,50);



              var imgData = canvas.toDataURL("image/png", 1.0);

                  doc1.addImage(imgData, 'JPEG', 5, 5,650,850);

                  doc1.save("Report_" + $scope.summary.taskObject.Task_Number + ".pdf");
}
            
            }
            else{
            var imgData = 'data:image/png;base64,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'
            var pdfimg = 'data:image/png;base64,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'
            var excelimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCwEGLDTCqNdaAAADfklEQVRo3u2ZTUhUURTHf8+vUsuK7MNKKCenCT/HohKkoo2gtQyiqCiCqDZFCxcVfRBRrqJFUARZUAS1aBGhrSQNIiiDEMrACKkIE1TKonJeC193zvsanZk7MxvP29zzce/5v3PvPee++wySI4MAdYSpYwXBRAbISchtDqsttzUUWbKRxN4gHgD5VBMmTB1VzEgianECmEPYchsiW5fbyQEsskIcpky/U38Ay5XbktS6lQCyWWWFuJZ56XIrAYxSoHG8AzRM2daki7tganqGAWiLs9e1rPQH3UY7Mg2gKNMAmAaQWDHypzd0CK6QBqCX7y67tdG0rncb2imEickGD83w/34Zn4JpAM5F+JGHgltHvUP/lB7VDrDVNV4VSwW3DICNLHbZ5Uab9qX0m5AwCzFu0/6wlelODbXAdO+CdhvSBzbdBaHZpaUYmV7bcJtws0bIh5ij5EV8SR2A9+QJCB1KflxIL2sqx6aB6bE0W2hV7U10AjBAkF+WrJpXrgPqCHNxHkgW0AQ8ZtDlYWd0GXrhGrWt22eYmOxTvEH3FDPhhskzoV8qbhPGWzHpFW+8d8qpOAkAEdaJN+7noOLm8lUnAL9MaHAFQ03STe4rzXkWopH8y/F69nDLal/kj9Wq41DM8ZqpElwpALvZ7LITn3b+W+Qzs11xee5rPTEFcW/DWMWohBMOyX7W+1qbJESxq6Fzrw/FsDVIkPzD0+/xzfRI9xQYMULXyBOrVcCY1VpBL/me1hOZ0LkIDwNXGXBZn2bmZBG4Lcwvi/bJmBGwUxKJaJBiZRxgXNz/5PEuHYnoGN9U+xxZnFXcb46glbzeRp7ta4lgEqFWyO7pi4DXIhyjkg+Ka6cRgMc0K9kS3rqSlMZyLA8eW4RcDn1U1zZ0A3hpSz8vhKZLyLN5nRoAfwkLN9sd2iahqyeSCgCtwkUOfQ5tjy3h3tABwF6OTeCM4soodyydWq7zSXE/PVb3FduHTZBLQAt9Lrs70TQfb8j8nmEPOEkkorTRNADdVzSnRL6EWQDc8LiimZUqAAGPQ1tFrA4Zn4JpAJkGMJppAPdy+CMvjJKm7jhsTbq4a5BHhfWfqIbCJFxPnIjiJllesyhXf4+K4x5JAwBJpepvYWlmAERpvgUlTDDmnkkZgCgVUmNBqbTdo6UNQJRyqbCg1KjjeVoByP4rrT2U4O/7f0/9ov/AQQ2NAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTExLTAxVDA2OjQ0OjUyKzAxOjAwfVk/DQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMS0wMVQwNjo0NDo1MiswMTowMAwEh7EAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'
            doc1.rect(20, 8, 650, 55)
            doc1.addImage(imgData, 'JPEG', 75, 15, 100, 40)
            doc1.setFontSize(40)
            doc1.setFontType('bold')
            doc1.text(250, 35, 'Field Service Summary Report')
            if ($scope.summary.taskObject.Task_Number.toString())
                doc1.text(250, 50, 'Field Job#' + $scope.summary.taskObject.Task_Number)
            doc1.setFontSize(20)
            doc1.setFontType('normal')
            doc1.text(500, 20, 'Emerson Process Management')
            doc1.text(500, 28, '(UNITED KINGDOM)')
            doc1.text(500, 36, 'Leicester')
            doc1.text(500, 44, 'United Kingdom')
            doc1.text(500, 52, 'Tel')
            doc1.text(500, 60, 'Fax: +44(0)122 2892896')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(25, 70, 'Customer Call Details')

            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(25, 85, 'Customer Name')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            if ($scope.summary.taskObject.Customer_Name)
                doc1.text(25, 95, $scope.summary.taskObject.Customer_Name)
            // console.log($scope.summary.taskObject.times[0].Start_Date.split(" ")[0]  | date : 'dd/MM/yyyy')
            //
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(200, 85, 'Start Date')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            var start = moment.utc($scope.summary.taskObject.times[0].Start_Date).utcOffset(constantService.getTimeZone()).format("DD/MM/YYYY")
            if (start)
                doc1.text(200, 95, start)
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(350, 85, 'End Date')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            var enddate = " ";
            if ($scope.summary.taskObject.times[0].End_Date != "" && $scope.summary.taskObject.times[0].End_Date != undefined) {
                enddate = moment.utc($scope.summary.taskObject.times[0].End_Date).utcOffset(constantService.getTimeZone()).format("DD/MM/YYYY");
            }
            doc1.text(350, 95, enddate);
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(475, 85, 'Duration')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            console.log($scope.summary.taskObject.times[0].Duration)
            if ($scope.summary.taskObject.times[0].Duration)
                doc1.text(475, 95, $scope.summary.taskObject.times[0].Duration)
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(25, 110, 'Service Request')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            if ($scope.summary.taskObject.Service_Request)
                doc1.text(25, 120, $scope.summary.taskObject.Service_Request)
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(200, 110, 'Field Job Request')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            if ($scope.summary.taskObject.Task_Number.toString())
                doc1.text(200, 120, $scope.summary.taskObject.Task_Number.toString())
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(350, 110, 'Job Description')
            doc1.setFontSize(22)
            doc1.setFontType('normal')
            if ($scope.summary.taskObject.Job_Description)
                doc1.text(350, 120, $scope.summary.taskObject.Job_Description)
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(25, 135, 'Product Line')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(200, 135, 'System ID/Serial #')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(350, 135, 'Tag #')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(450, 135, 'Original PO#')
            var ibyvalue = 145;
            angular.forEach($scope.summary.taskObject.InstallBase, function (key) {
                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if (key.Product_Line)
                    doc1.text(25, ibyvalue, key.Product_Line)
                else
                    doc1.text(25, ibyvalue, 'NO VALUE')


                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if (key.Serial_Number)
                    doc1.text(200, ibyvalue, key.Serial_Number)
                else
                    doc1.text(200, ibyvalue, 'NO VALUE')

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if (key.TagNumber)
                    doc1.text(350, ibyvalue, key.TagNumber)
                else
                    doc1.text(350, ibyvalue, 'NO VALUE')

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if (key.Original_PO_Number)
                    doc1.text(450, ibyvalue, key.Original_PO_Number)
                else
                    doc1.text(450, ibyvalue, 'NO VALUE')
                ibyvalue = ibyvalue + 10;
            })
            var customerRectHeight = ibyvalue - 70;
            doc1.rect(20, 75, 650, customerRectHeight)


            var i = 0, xNotesField = 25, yNotesField = ibyvalue + 20, rectNotesWidth = 650,
                rectNotesHeight = 22 * $scope.summary.notesArray.length,
                rectNotesX = 20, rectNotesY = 170;
            var xNotesField1 = xNotesField, xNotesField2 = xNotesField1 + 150, yNotesField1 = yNotesField + 22,
                yNotesField2, yNotesField1_val, yNotesField2_val;
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xNotesField1, yNotesField1, 'Note Type')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xNotesField2, yNotesField1, 'Note Description')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xNotesField, yNotesField, 'Notes')
            // doc1.rect(20, yNotesField+10, rectNotesWidth, rectNotesHeight)
            while (i < $scope.summary.notesArray.length) {
                xNotesField1 = xNotesField;
                //yNotesField1 = yNotesField + 22;
                yNotesField1_val = yNotesField1 + 10 * ++i;
                xNotesField2 = xNotesField1 + 150;

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.notesArray[i - 1].Note_Type)
                    doc1.text(xNotesField1, yNotesField1_val, $scope.summary.notesArray[i - 1].Note_Type)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.notesArray[i - 1].Notes)
                    doc1.text(xNotesField2, yNotesField1_val, $scope.summary.notesArray[i - 1].Notes)
            }
            rectNotesHeight = yNotesField1_val - yNotesField + 10;
            doc1.rect(20, yNotesField + 5, rectNotesWidth, rectNotesHeight)


            var xAttachField = 25, yAttachField = yNotesField1_val + 25, rectAttachWidth = 650,
                rectAttachHeight = 60, xAttachField1 = 25;
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xAttachField, yAttachField, 'Attachments')
            doc1.rect(20, yAttachField + 10, rectAttachWidth, rectAttachHeight)
            angular.forEach($scope.files, function (file, value) {
                // setTimeout(function () {
                if (file.filetype != "pdf" && file.filetype != "xlsx") {
                    doc1.addImage(file.data, 'JPEG', xAttachField1, yAttachField + 15, 50, 40)
                    // }, 1000);
                }
                else if (file.filetype == "pdf")
                    doc1.addImage(pdfimg, 'JPEG', xAttachField1, yAttachField + 15, 50, 40)
                else if (file.filetype == "xlsx")
                    doc1.addImage(excelimg, 'JPEG', xAttachField1, yAttachField + 15, 50, 40)
                doc1.setFontSize(16)
                doc1.setFontType('normal')
                if (file.fileDisc.length >= 20)
                    doc1.text(xAttachField1, yAttachField + 65, file.fileDisc.substr(0, 18) + '..')
                else {
                    doc1.text(xAttachField1, yAttachField + 65, file.fileDisc)
                }
                xAttachField1 += 60;
            })
            var j = 0, xTimeField = 25, yTimeField = yAttachField + rectAttachHeight + 20, rectTimeWidth = 650,
                rectTimeHeight = 22 * $scope.summary.timeArray.length, yTimeFieldName = yTimeField + 20,
                yTimeFieldValue = yTimeField;
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xTimeField, yTimeField, 'Time')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xTimeField, yTimeFieldName, 'Date')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xTimeField + 55, yTimeFieldName, 'Charge Type')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xTimeField + 110, yTimeFieldName, 'Charge method')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xTimeField + 175, yTimeFieldName, 'Work Type')
            //  doc1.text(xTimeField + 235, yTimeFieldName, 'Standard')
            var xTimeField1 = xTimeField + 195;
            angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecodeKey, value) {
                xTimeField1 = xTimeField1 + 40;
                doc1.setFontSize(22)
                doc1.setFontType('bold')
                doc1.text(xTimeField1, yTimeFieldName, timecodeKey.Overtimeshiftcode)
                // doc1.text(xTimeField + 275, yTimeFieldName, 'OT1')
                // doc1.text(xTimeField + 315, yTimeFieldName, 'OT2')
                // doc1.text(xTimeField + 355, yTimeFieldName, 'OT3')
            });
            doc1.text(xTimeField + 415, yTimeFieldName, 'Duration')
            doc1.text(xTimeField + 475, yTimeFieldName, 'Item')
            doc1.text(xTimeField + 539, yTimeFieldName, 'Description')
            doc1.rect(20, yTimeField + 5, rectTimeWidth, rectTimeHeight)
            while (j < $scope.summary.timeArray.length) {

                yTimeFieldName = yTimeField + 20 * ++j;
                yTimeFieldValue = yTimeFieldName + 10;
                // doc1.text(xTimeField, yTimeFieldName, 'Date')

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.timeArray[j - 1].Date)
                    doc1.text(xTimeField, yTimeFieldValue, $scope.summary.timeArray[j - 1].Date)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.timeArray[j - 1].Charge_Type)
                    doc1.text(xTimeField + 55, yTimeFieldValue, $scope.summary.timeArray[j - 1].Charge_Type)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.timeArray[j - 1].Charge_Method)
                    doc1.text(xTimeField + 110, yTimeFieldValue, $scope.summary.timeArray[j - 1].Charge_Method)

                doc1.setFontSize(22)

                doc1.setFontType('normal');

                if ($scope.summary.timeArray[j - 1].Work_Type)
                    doc1.text(xTimeField + 175, yTimeFieldValue, $scope.summary.timeArray[j - 1].Work_Type)
                var a = 2;

                angular.forEach($scope.timeArray[0].timeDefault.timeCode.values, function (timecodeKey, value) {

                    angular.forEach($scope.summary.timeArray[j - 1].timecode, function (key, value) {

                        console.log($scope.summary.timeArray[j - 1].timecode[value][timecodeKey.Overtimeshiftcode]);

                        if ($scope.summary.timeArray[j - 1].timecode[value][timecodeKey.Overtimeshiftcode] != undefined) {

                            //  doc1.text(xTimeField + 235, yTimeFieldName, timecodeKey.Overtimeshiftcode)
                            // xTimeField1=xTimeField1 +40;
                            // doc1.text(xTimeField1, yTimeFieldName, timecodeKey.Overtimeshiftcode)
                            // xTimeField1=xTimeField1-40*a;
                            doc1.setFontSize(22)
                            doc1.setFontType('normal')
                            doc1.text(xTimeField1 - 40 * a, yTimeFieldValue, $scope.summary.timeArray[j - 1].timecode[value][timecodeKey.Overtimeshiftcode].toString());
                            a--;

                        } else {

                            //  console.log("testsajhhhhhhhhhhhhhhhd")
                        }
                    });
                });
                // doc1.text(xTimeField + 235, yTimeFieldName, 'Standard')
                // doc1.text(xTimeField + 235, yTimeFieldValue, $scope.summary.timeArray[j-1].Shift_Code)
                // doc1.text(xTimeField + 275, yTimeFieldName, 'OT1')
                // doc1.text(xTimeField + 275, yTimeFieldValue, $scope.summary.timeArray[j-1].Time_Code)
                // doc1.text(xTimeField + 315, yTimeFieldName, 'OT2')
                // doc1.text(xTimeField + 315, yTimeFieldValue, $scope.summary.timeArray[j-1].Time_Code)
                // doc1.text(xTimeField + 355, yTimeFieldName, 'OT3')
                // doc1.text(xTimeField + 355, yTimeFieldValue, $scope.summary.timeArray[j-1].Time_Code)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.timeArray[j - 1].Duration)
                    doc1.text(xTimeField + 415, yTimeFieldValue, $scope.summary.timeArray[j - 1].Duration.toString())

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.timeArray[j - 1].Item)
                    doc1.text(xTimeField + 475, yTimeFieldValue, $scope.summary.timeArray[j - 1].Item)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.timeArray[j - 1].Comments)
                    doc1.text(xTimeField + 539, yTimeFieldValue, $scope.summary.timeArray[j - 1].Comments)
            }
            var k = 0, xExpenseField = 25, yExpenseField = yTimeField + rectTimeHeight + 20, rectExpenseWidth = 650,
                rectExpenseHeight = 22 * $scope.summary.expenseArray.length, yExpenseFieldName = yExpenseField + 20,
                yExpenseFieldValue;
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xExpenseField, yExpenseField + 5, 'Expenses')
            // doc1.rect(20, yExpenseField + 10, rectExpenseWidth, rectExpenseHeight)
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xExpenseField, yExpenseFieldName, 'Date')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xExpenseField + 150, yExpenseFieldName, 'Expense type')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xExpenseField + 300, yExpenseFieldName, 'Charge Method')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xExpenseField + 450, yExpenseFieldName, 'Justification')
            // yExpenseFieldValue = yExpenseFieldName + 10;
            while (k < $scope.summary.expenseArray.length) {
                // yExpenseFieldName =  ;
                yExpenseFieldValue = yExpenseFieldName + 10 * ++k;


                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.expenseArray[k - 1].Date)
                    doc1.text(xExpenseField, yExpenseFieldValue, $scope.summary.expenseArray[k - 1].Date)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.expenseArray[k - 1].Expense_Type)
                    doc1.text(xExpenseField + 150, yExpenseFieldValue, $scope.summary.expenseArray[k - 1].Expense_Type)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.expenseArray[k - 1].Charge_Method)
                    doc1.text(xExpenseField + 300, yExpenseFieldValue, $scope.summary.expenseArray[k - 1].Charge_Method)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.expenseArray[k - 1].Justification)
                    doc1.text(xExpenseField + 450, yExpenseFieldValue, $scope.summary.expenseArray[k - 1].Justification)
            }
            rectExpenseHeight = yExpenseFieldValue - yExpenseFieldName + 15;
            doc1.rect(20, yExpenseField + 10, rectExpenseWidth, rectExpenseHeight);

            var l = 0, xMaterialField = 25, yMaterialField = yExpenseField + rectExpenseHeight + 20,
                rectMaterialWidth = 650, rectMaterialHeight = 25 * $scope.summary.materialArray.length,
                yMaterialFieldName = yMaterialField + 20, yMaterialFieldValue;

            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xMaterialField, yMaterialField + 5, 'Materials')
            // doc1.rect(20, yMaterialField + 10, rectMaterialWidth, rectMaterialHeight)
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(25, yMaterialFieldName, 'Charge type')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(80, yMaterialFieldName, 'Quantity')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(140, yMaterialFieldName, 'Serial#')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(200, yMaterialFieldName, 'Serial In#')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(260, yMaterialFieldName, 'Serial Out#')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(320, yMaterialFieldName, 'Item Name')
            doc1.text(380, yMaterialFieldName, 'Description')
            yMaterialFieldValue = yMaterialFieldName + 10;

            while (l < $scope.summary.materialArray.length) {
                // yMaterialFieldName =  ;
                // yMaterialFieldValue = yMaterialFieldValue + 10 *
                ++l;
                doc1.setFontSize(22)
                doc1.setFontType('normal')

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].Charge_Type)
                    doc1.text(25, yMaterialFieldValue, $scope.summary.materialArray[l - 1].Charge_Type)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].Product_Quantity)
                    doc1.text(80, yMaterialFieldValue, $scope.summary.materialArray[l - 1].Product_Quantity.toString())

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].serialNumber)
                    doc1.text(140, yMaterialFieldValue, $scope.summary.materialArray[l - 1].serialNumber)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].serialIn)
                    doc1.text(200, yMaterialFieldValue, $scope.summary.materialArray[l - 1].serialIn)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].serialOut)
                    doc1.text(260, yMaterialFieldValue, $scope.summary.materialArray[l - 1].serialOut)
                // doc1.text(320, yMaterialFieldName, 'Serial Activity')
                // doc1.text(320, yMaterialFieldValue, $scope.summary.materialArray[l-1].Charge_Type)
                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].ItemName)
                    doc1.text(320, yMaterialFieldValue, $scope.summary.materialArray[l - 1].ItemName)

                doc1.setFontSize(22)
                doc1.setFontType('normal')
                if ($scope.summary.materialArray[l - 1].Description)
                    doc1.text(380, yMaterialFieldValue, $scope.summary.materialArray[l - 1].Description)
                // doc1.text(460, yMaterialFieldName, 'Comments')
                // doc1.text(460, yMaterialFieldValue, $scope.summary.materialArray[l-1].Charge_Type)
                yMaterialFieldValue = yMaterialFieldValue + 10 * $scope.summary.materialArray[l - 1].Product_Quantity;
            }

            rectMaterialHeight = yMaterialFieldValue - yMaterialFieldName + 10;
            doc1.rect(20, yMaterialField + 10, rectMaterialWidth, rectMaterialHeight)

            var xSignField = 25, ySignField = yMaterialField + rectMaterialHeight + 20, rectSignWidth = 650,
                rectSignHeight = 80;

            doc1.setFontSize(22)
            doc1.setFontType('bold')
            doc1.text(xSignField, ySignField + 5, 'Signature')
            doc1.rect(20, ySignField + 10, rectSignWidth, rectSignHeight)
            doc1.text(50, ySignField + 20, 'ENGINEER NAME')
            doc1.text(250, ySignField + 20, 'CUSTOMER NAME')
            doc1.text(50, ySignField + 35, $scope.engineerName);

            if ($scope.summary.engineer != undefined && $scope.summary.engineer.signature)
                doc1.addImage($scope.summary.engineer.signature, 'JPEG', 50, ySignField + 45, 75, 40);
            doc1.text(250, ySignField + 35, $scope.summary.taskObject.Customer_Name);

            if ($rootScope.signature)
                doc1.addImage($rootScope.signature, 'JPEG', 250, ySignField + 45, 75, 40);
            //                 doc1.save("Report_" + $scope.summary.taskObject.Task_Number + ".pdf");

            if ($rootScope.local) {

                var filePath = cordova.file.dataDirectory;

                $rootScope.reposrtpath = filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf";

                console.log("FILE PATH  " + filePath);

                $scope.value = doc1.output("datauri");

                valueService.saveBase64File(filePath, "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", $scope.value, "application/pdf", defer);

                //  valueService.openFile(filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", "application/pdf");

            } else {

                var filePath = cordova.file.dataDirectory;

                $rootScope.reposrtpath = filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf";

                console.log("FILE PATH  " + filePath);

                $scope.value = doc1.output("datauri");

                valueService.saveBase64File(filePath, "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", $scope.value, "application/pdf", defer.resolve());

                // valueService.openFile(filePath + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf", "application/pdf");

            }
            }
        }, 1000)

        return defer.promise


    }

    $scope.sendMail = function () {

        if ($scope.reportBase64 != "" && $scope.reportBase64 != undefined) {

            var base64parts = $scope.reportBase64.split(',');

            base64parts[0] = "base64:" + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf" + "//";

            var file = "app://local/" + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf";

            var compatibleAttachment = base64parts + $scope.reportBase64;

            cordova.plugins.email.open({
                to: constantService.getUserEmailId(),
                cc: constantService.getCCEmailID(),
                subject: 'Report',
                body: '',
                attachments: [compatibleAttachment]
            });

        } else {

            var promise = generatePDF();

            promise.then(function () {

                var base64parts = $scope.value.split(',');

                base64parts[0] = "base64:" + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf" + "//";

                var file = "app://local/" + "Report_" + $scope.summary.taskObject.Task_Number + ".pdf";

                var compatibleAttachment = base64parts + $scope.value;

                cordova.plugins.email.open({
                    to: constantService.getUserEmailId(),
                    cc: constantService.getCCEmailID(),
                    subject: 'Report',
                    body: '',
                    attachments: [compatibleAttachment]
                });
            });
        }
    };

    $scope.deleteAttachment = function () {
        $scope.files.splice(this.$index, 1);
    };
});
