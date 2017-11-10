(function() {

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
      taskList: [],
      installBase: [],
      contacts: [],
      taskNotes: [],
      taskAttachment: [],
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
      currency: [],
      expenseType: [],
      noteType: []
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

    service.setTaskList = setTaskList;
    service.getTaskList = getTaskList;

    service.setInstallBase = setInstallBase;
    service.getInstallBase = getInstallBase;

    service.getContact = getContact;
    service.getTaskNotes = getTaskNotes;
    service.getTaskAttachment = getTaskAttachment;

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

    service.getExpenseType = getExpenseType;
    service.getNoteType = getNoteType;

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
    service.acceptTask = acceptTask;

    service.checkIfFutureDayTask = checkIfFutureDayTask;
    service.setIfFutureDateTask = setIfFutureDateTask;
    service.getIfFutureDateTask = getIfFutureDateTask;

    service.syncData = syncData;

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

      if (getUser().ClarityID == "1" || getUser().ClarityID != "") {

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

      localService.getInstallBaseList(taskObject.Task_Number, function(response) {

        debrief.installBase = response;
      });

      localService.getContactList(taskObject.Task_Number, function(response) {

        debrief.contacts = response;
      });

      localService.getNoteList(taskObject.Task_Number, function(response) {

        debrief.taskNotes = response;
      });

      localService.getAttachmentList(taskObject.Task_Number, "O", function(response) {

        debrief.taskAttachment = response;
      });

      localService.getTimeList(taskObject.Task_Number, function(response) {

        debrief.time = response;
      });

      localService.getExpenseList(taskObject.Task_Number, function(response) {

        debrief.expense = response;
      });

      localService.getMaterialList(taskObject.Task_Number, function(response) {

        debrief.material = response;
      });

      localService.getNotesList(taskObject.Task_Number, function(response) {

        debrief.notes = response;
      });

      localService.getAttachmentList(taskObject.Task_Number, "D", function(response) {

        debrief.attachment = response;
      });

      localService.getEngineer(taskObject.Task_Number, function(response) {

        debrief.engineer = response;
      });

      localService.getOverTimeList(taskObject.Task_Number, function(response) {

        debrief.overTime = response;
      });

      localService.getShiftCodeList(taskObject.Task_Number, function(response) {

        debrief.shiftCode = response;
      });

      localService.getChargeTypeList(function(response) {

        debrief.chargeType = response;
      });

      localService.getChargeMethodList(function(response) {

        debrief.chargeMethod = response;
      });

      localService.getFieldJobNameList(taskObject.Task_Number, function(response) {

        debrief.fieldName = response;
      });

      localService.getWorkTypeList(function(response) {

        debrief.workType = response;
      });

      localService.getItemList(function(response) {

        debrief.item = response;
      });

      localService.getCurrencyList(function(response) {

        debrief.currency = response;
      });

      localService.getExpenseTypeList(function(response) {

        debrief.expenseType = response;
      });

      localService.getNoteTypeList(function(response) {

        debrief.noteType = response;
      });
    };

    function getTask() {

      return debrief.task;
    };

    function setTaskList() {

      localService.getTaskList(function(response) {

        debrief.taskList = response;
      });
    };

    function getTaskList() {
      return debrief.taskList;
    };

    function setInstallBase(installBaseObject) {

      debrief.installBase = installBaseObject;
    };

    function getInstallBase() {

      return debrief.installBase;
    };

    function getContact() {

      return debrief.contacts;
    };

    function getTaskNotes() {

      return debrief.taskNotes;
    };

    function getTaskAttachment() {

      return debrief.taskAttachment;
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

    function getExpenseType() {

      return debrief.expenseType;
    };

    function getNoteType() {

      return debrief.noteType;
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

      var blob = new Blob(byteArrays, {
        type: contentType
      });

      return blob;
    };

    function saveBase64File(folderpath, filename, content, contentType, defer) {

      var DataBlob = b64toBlob(content, contentType);

      console.log("START WRITING");

      window.resolveLocalFileSystemURL(folderpath, function(dir) {

        console.log("ACCESS GRANTED");

        dir.getFile(filename, {
          create: true
        }, function(file) {

          console.log("FILE CREATED SUCCESSFULLY");

          file.createWriter(function(fileWriter) {

            console.log("WRITING CONTENT TO FILE");

            fileWriter.write(DataBlob);
            if (defer != null)
              defer.resolve();

          }, function() {

            console.log("UNABLE TO SAVE " + folderpath);
          });
        });
      });
    };

    function saveFile(folderpath, filename, file) {

      var DataBlob = file;

      console.log("START WRITING");

      window.resolveLocalFileSystemURL(folderpath, function(dir) {

        console.log("ACCESS GRANTED");

        dir.getFile(filename, {
          create: true
        }, function(file) {

          console.log("FILE CREATED SUCCESSFULLY");

          file.createWriter(function(fileWriter) {

            console.log("WRITING CONTENT TO FILE");

            fileWriter.write(DataBlob);

          }, function() {

            console.log("UNABLE TO SAVE " + folderpath);
          });
        });
      });
    };

    function openFile(filePath, fileType, callback) {

      cordova.plugins.fileOpener2.open(filePath, fileType, {

        error: function(e) {
          console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
          if (callback != null && callback != undefined) {
            callback();
          }
        },
        success: function() {
          console.log('File opened successfully');
        }
      });
    };

    function copyDatabaseFile(dbName) {

      var sourceFileName = cordova.file.applicationDirectory + 'www/db/' + dbName;

      var targetDirName = cordova.file.dataDirectory;

      console.log("DB PATH", targetDirName);

      return Promise.all([

        new Promise(function(resolve, reject) {

          resolveLocalFileSystemURL(sourceFileName, resolve, reject);
        }),

        new Promise(function(resolve, reject) {

          resolveLocalFileSystemURL(targetDirName, resolve, reject);
        })

      ]).then(function(files) {

        var sourceFile = files[0];

        var targetDir = files[1];

        return new Promise(function(resolve, reject) {

          targetDir.getFile(dbName, {}, resolve, reject);

        }).then(function() {

          console.log("File already copied");

        }).catch(function() {

          console.log("File doesn't exist, copying it");

          return new Promise(function(resolve, reject) {

            sourceFile.copyTo(targetDir, dbName, resolve, reject);

          }).then(function() {

            console.log("File copied");
          });
        });
      });
    };

    function acceptTask(taskId) {

      var formData = {
        "taskid": taskId,
        "taskstatus": "Accepted",
        "requestDate": moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.000+00:00")
      };

      cloudService.updateAcceptTask(formData, function(response) {

        console.log(JSON.stringify(response));

        var taskObject = {
          Task_Status: "Accepted",
          Task_Number: taskId,
          Submit_Status: "A",
          Date: new Date()
        };

        localService.updateTaskSubmitStatus(taskObject);

        cloudService.getTaskList(function(response) {

        });
      });
    };

    function submitDebrief(taskObject, taskId) {

      var timeArray = [];
      var expenseArray = [];
      var materialArray = [];
      var notesArray = [];
      var attachmentArray = [];

      var timeJSONData = [];
      var expenseJSONData = [];
      var materialJSONData = [];
      var noteJSONData = [];
      var attachmentJSONData = [];

      acceptTask(taskId);

      localService.getTimeList(taskId, function(response) {

        timeArray = response;

        if (timeArray.length > 0) {

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
              "start_date": moment.utc(new Date(timeArray[i].Date)).format("YYYY-MM-DDTHH:mm:ss.000Z"),
              "end_date": moment.utc(new Date(timeArray[i].Date)).format("YYYY-MM-DDTHH:mm:ss.000Z"),
              "charge_method": timeArray[i].Charge_Method_Id,
              "JobName": timeArray[i].Field_Job_Name_Id
            }

            timeJSONData.push(timeData);
          }

          localService.getExpenseList(taskId, function(response) {

            expenseArray = response;

            if (expenseArray.length > 0) {

              for (var i = 0; i < expenseArray.length; i++) {

                var expenseData = {
                  "taskId": expenseArray[i].Task_Number,
                  "comments": expenseArray[i].Justification,
                  "currency": expenseArray[i].Currency_Id.toString(),
                  "chargeMethod": expenseArray[i].Charge_Method_Id.toString(),
                  "ammount": expenseArray[i].Amount,
                  "date": moment.utc(new Date(expenseArray[i].Date)).format("YYYY-MM-DD"),
                  "expenseItem": expenseArray[i].Expense_Type_Id.toString()
                  // "chargeType": "2",
                  // "billable": "true"
                }

                expenseJSONData.push(expenseData);
              }

              localService.getMaterialList(taskId, function(response) {

                materialArray = response;

                if (materialArray.length > 0) {

                  angular.forEach(materialArray, function(item) {

                    var serialIn, serialOut, serialNo;

                    if (item.Serial_In != undefined) {

                      serialIn = item.Serial_In.split(",");
                    }

                    if (item.Serial_Out != undefined) {

                      serialOut = item.Serial_Out.split(",");
                    }

                    if (item.Serial_Number != undefined) {

                      serialNo = item.Serial_Number.split(",")
                    }

                    item.Serial_Type = [];

                    if (serialNo != undefined && serialNo.length > 0) {

                      angular.forEach(serialNo, function(serail) {

                        var serialTypeObject = {};

                        serialTypeObject.in = "";
                        serialTypeObject.out = "";
                        serialTypeObject.number = serail;

                        if (serialTypeObject.number != "")
                          item.Serial_Type.push(serialTypeObject);
                      });
                    }

                    if (serialIn != undefined && serialIn.length > 0 && serialOut != undefined && serialOut.length > 0) {

                      var index = 0;

                      angular.forEach(serialIn, function(serial) {

                        var serialTypeObject = {};

                        serialTypeObject.in = serial;
                        serialTypeObject.out = serialOut[index];
                        serialTypeObject.number = "";

                        if (serialTypeObject.in != "")
                          item.Serial_Type.push(serialTypeObject);

                        index++;
                      });
                    }
                    angular.forEach(item.Serial_Type, function(key) {

                      var materialData = {
                        "charge_method": item.Charge_Type_Id.toString(),
                        "task_id": item.Task_Number,
                        "item_description": item.Description,
                        "product_quantity": "1",
                        "comments": "",
                        "item": item.ItemName,
                        "serialin": key.in,
                        "serialout": key.out,
                        "serial_number": key.number
                        // "service_activity": "serveact",
                        // "charge_type": "2"
                      }

                      materialJSONData.push(materialData);
                    });
                  });

                  localService.getNotesList(taskId, function(response) {

                    notesArray = response;

                    if (notesArray.length > 0) {

                      for (var i = 0; i < notesArray.length; i++) {

                        var noteData = {
                          "Notes_type": notesArray[i].Note_Type_Id,
                          "notes_description": notesArray[i].Notes,
                          "task_id": notesArray[i].Task_Number,
                          "mobilecreatedDate": moment.utc(new Date(notesArray[i].Date)).format("YYYY-MM-DDTHH:mm:ss.000Z")
                        };

                        noteJSONData.push(noteData);
                      }

                      localService.getAttachmentList(taskId, "D", function(response) {

                        attachmentArray = response;

                        if (attachmentArray.length > 0) {

                          var promises = [];

                          angular.forEach(attachmentArray, function(attachment) {

                            var deferred = $q.defer();

                            console.log(attachment);

                            var attachmentObject = {};

                            attachmentObject.taskId = attachment.Task_Number;
                            attachmentObject.contentType = attachment.File_Type;
                            attachmentObject.FileName = attachment.File_Name.split(".")[0];
                            attachmentObject.Description = attachment.File_Name.split(".")[0];
                            attachmentObject.Name = attachment.File_Name.split(".")[0];

                            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

                              fs.root.getFile(attachment.File_Name, {
                                create: true,
                                exclusive: false
                              }, function(fileEntry) {

                                fileEntry.file(function(file) {

                                  var reader = new FileReader();

                                  reader.onloadend = function() {

                                    attachmentObject.Data = this.result.split(",")[1];

                                    attachmentJSONData.push(attachmentObject);

                                    deferred.resolve(attachmentObject);
                                  };

                                  reader.readAsDataURL(file);
                                });
                              });
                            });

                            promises.push(deferred.promise);

                          });

                          $q.all(promises).then(

                            function(response) {
                              console(attachmentJSONData);
                            },

                            function(error) {}
                          );

                          // angular.forEach(attachmentArray, function(attachment) {
                          //
                          //   var attachmentObject = {};
                          //
                          //   attachmentObject.taskId = attachment.Task_Number;
                          //   attachmentObject.contentType = attachment.File_Type;
                          //   attachmentObject.FileName = attachment.File_Name.split(".")[0];
                          //   attachmentObject.Description = attachment.File_Name.split(".")[0];
                          //   attachmentObject.Name = attachment.File_Name.split(".")[0];
                          //
                          //   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
                          //
                          //     fs.root.getFile(attachment.File_Name, {
                          //       create: true,
                          //       exclusive: false
                          //     }, function(fileEntry) {
                          //
                          //       fileEntry.file(function(file) {
                          //
                          //         var reader = new FileReader();
                          //
                          //         reader.onloadend = function() {
                          //
                          //           attachmentObject.Data = this.result.split(",")[1];
                          //
                          //           attachmentJSONData.push(attachmentObject);
                          //         };
                          //
                          //         reader.readAsDataURL(file);
                          //       });
                          //     });
                          //   });
                          // });

                          localService.getEngineer(taskId, function(response) {

                            if (response != undefined) {

                              var formData = {
                                "taskid": taskId,
                                "taskstatus": "Completed",
                                "email": taskObject.Email,
                                "requestDate": moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                                "completeDate": moment.utc(new Date()).format("YYYY-MM-DDTHH:mm:ss.000Z"),
                                "followUp": response.followUp + "",
                                "salesQuote": response.salesQuote + "",
                                "salesVisit": response.salesVisit + "",
                                "salesLead": response.salesLead + "",
                                "followuptext": response.Follow_Up,
                                "sparequotetext": response.Spare_Quote,
                                "salesText": response.Sales_Visit,
                                "salesleadText": response.Sales_Head
                              };

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

                              cloudService.uploadTime(timeUploadJSON, function(response) {

                                console.log("Uploaded Time " + JSON.stringify(response));

                                cloudService.uploadExpense(expenseUploadJSON, function(response) {

                                  console.log("Uploaded Expense " + JSON.stringify(response));

                                  cloudService.uploadNote(notesUploadJSON, function(response) {

                                    console.log("Uploaded Notes " + JSON.stringify(response));

                                    cloudService.uploadMaterial(materialUploadJSON, function(response) {

                                      console.log("Uploaded Material " + JSON.stringify(response));

                                      cloudService.createAttachment(attachmentUploadJSON, function(response) {

                                        console.log("Uploaded Attachment " + JSON.stringify(response));

                                        cloudService.updateAcceptTask(formData, function(response) {

                                          console.log("Task Completed " + JSON.stringify(response));

                                          var taskObject = {
                                            Task_Status: "Completed",
                                            Task_Number: taskId,
                                            Submit_Status: "I"
                                          };

                                          localService.updateTaskSubmitStatus(taskObject);

                                          cloudService.getTaskList(function(response) {

                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    };

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
    };

    function syncData() {

      cloudService.getTaskList(function(response) {

      });

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

    };
  }
})();
