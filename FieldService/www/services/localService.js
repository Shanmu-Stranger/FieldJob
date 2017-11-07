(function () {

    "use strict";

    app.factory("localService", localService);

    localService.$inject = ["$http", "$rootScope", "$window", "$location"];

    function localService($http, $rootScope, $window, $location) {

        var service = {};

        var db;

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {

            db = sqlitePlugin.openDatabase({
                name: "emerson.sqlite",
                location: "default"
            });
        }

        service.getUser = getUser;
        service.insertUser = insertUser;
        service.updateUser = updateUser;
        service.deleteUser = deleteUser;

        service.insertTaskList = insertTaskList;
        service.insertInstallBaseList = insertInstallBaseList;
        service.insertContactList = insertContactList;
        service.insertNoteList = insertNoteList;
        service.insertAttachmentList = insertAttachmentList;
        service.insertProjectList = insertProjectList;

        service.insertOverTimeList = insertOverTimeList;
        service.insertShiftCodeList = insertShiftCodeList;

        service.insertFieldJobNameList = insertFieldJobNameList;
        service.insertChargeTypeList = insertChargeTypeList;
        service.insertChargeMethodList = insertChargeMethodList;

        service.insertWorkTypeList = insertWorkTypeList;
        service.insertItemList = insertItemList;
        service.insertCurrencyList = insertCurrencyList;

        service.insertExpenseTypeList = insertExpenseTypeList;
        service.insertNoteTypeList = insertNoteTypeList;

        service.insertTimeList = insertTimeList;
        service.insertExpenseList = insertExpenseList;
        service.insertMaterialList = insertMaterialList;
        service.insertNotesList = insertNotesList;
        service.insertEngineerList = insertEngineerList;

        service.deleteInstallBase = deleteInstallBase;
        service.deleteContact = deleteContact;
        service.deleteNote = deleteNote;
        service.deleteAttachment = deleteAttachment;

        service.deleteOverTime = deleteOverTime;
        service.deleteShiftCode = deleteShiftCode;

        service.deleteChargeType = deleteChargeType;
        service.deleteChargeMethod = deleteChargeMethod;
        service.deleteFieldJobName = deleteFieldJobName;

        service.deleteWorkType = deleteWorkType;
        service.deleteItem = deleteItem;
        service.deleteCurrency = deleteCurrency;

        service.deleteExpenseType = deleteExpenseType;
        service.deleteNoteType = deleteNoteType;

        service.deleteTime = deleteTime;
        service.deleteExpense = deleteExpense;
        service.deleteMaterial = deleteMaterial;
        service.deleteNotes = deleteNotes;
        service.deleteEngineer = deleteEngineer;

        service.getTaskList = getTaskList;
        service.getInstallBaseList = getInstallBaseList;
        service.getContactList = getContactList;
        service.getNoteList = getNoteList;
        service.getAttachmentList = getAttachmentList;
        service.getProjectList = getProjectList;

        service.getOverTimeList = getOverTimeList;
        service.getShiftCodeList = getShiftCodeList;

        service.getChargeTypeList = getChargeTypeList;
        service.getChargeMethodList = getChargeMethodList;
        service.getFieldJobNameList = getFieldJobNameList;

        service.getWorkTypeList = getWorkTypeList;
        service.getItemList = getItemList;
        service.getCurrencyList = getCurrencyList;

        service.getExpenseTypeList = getExpenseTypeList;
        service.getNoteTypeList = getNoteTypeList;

        service.getTimeList = getTimeList;
        service.getExpenseList = getExpenseList;
        service.getMaterialList = getMaterialList;
        service.getNotesList = getNotesList;
        service.getEngineer = getEngineer;

        service.updateTaskSubmitStatus = updateTaskSubmitStatus;

        service.getPendingTaskList = getPendingTaskList;
        service.getAcceptTaskList = getAcceptTaskList;

        return service;

        function insertTaskList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Task WHERE Task_Number = " + responseList[i].Task_Number;

                        //console.log("TASK  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("TASK LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateTask(responseList[i]);

                            } else {

                                insertTask(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("TASK SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("TASK SELECT TRANSACTION ERROR: " + error.message);
                    });

                    console.log("TASK OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateTask(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Task SET Job_Description = ?, Duration = ?, Task_Status = ?, Customer_Name =?, Street_Address = ?, City = ?, State = ?, Country = ?, Zip_Code = ?, Expense_Method = ?, Labor_Method = ?, Travel_Method = ?, Material_Method = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?  WHERE Task_Number = ?";

                insertValues.push(responseList.Job_Description);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Task_Status);
                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Street_Address);
                insertValues.push(responseList.City);
                insertValues.push(responseList.State);
                insertValues.push(responseList.Country);
                insertValues.push(responseList.Zip_Code);
                insertValues.push(responseList.Expense_Method);
                insertValues.push(responseList.Labor_Method);
                insertValues.push(responseList.Travel_Method);
                insertValues.push(responseList.Material_Method);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Task_Number);

                //console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertTask(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Task VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Job_Description);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Task_Status);
                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Street_Address);
                insertValues.push(responseList.City);
                insertValues.push(responseList.State);
                insertValues.push(responseList.Country);
                insertValues.push(responseList.Zip_Code);
                insertValues.push(responseList.Expense_Method);
                insertValues.push(responseList.Labor_Method);
                insertValues.push(responseList.Travel_Method);
                insertValues.push(responseList.Material_Method);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);

                if (responseList.Task_Status == "Field Job Completed") {

                    insertValues.push("I");

                } else {

                    insertValues.push("A");
                }

                //console.log("TASK INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("TASK INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("TASK INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("TASK INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function updateTaskSubmitStatus(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Task SET Task_Status = ?, Submit_Status = ?  WHERE Task_Number = ?";

                insertValues.push(responseList.Task_Status);
                insertValues.push(responseList.Submit_Status);
                insertValues.push(responseList.Task_Number);

                //console.log("TASK UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("TASK ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("TASK UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("TASK UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertInstallBaseList(response) {

            var responseList = response.InstallBase;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM InstallBase WHERE Installed_Base_ID = " + responseList[i].Installed_Base_ID + " AND Task_Number = " + responseList[i].Task_Number;

                        //console.log("INSTALLBASE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("INSTALLBASE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateInstallBase(responseList[i]);

                            } else {

                                insertInstallBase(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("INSTALLBASE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("INSTALLBASE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("INSTALLBASE OBJECT =====> " + JSON.stringify(responseList));

                })(i);
            }
        };

        function updateInstallBase(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE InstallBase SET Product_Line = ?, Serial_Number = ?, TagNumber = ?, Original_PO_Number =?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?  WHERE Installed_Base_ID = ? AND Task_Number = ?";

                insertValues.push(responseList.Product_Line);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.TagNumber);
                insertValues.push(responseList.Original_PO_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Installed_Base_ID);
                insertValues.push(responseList.Task_Number);

                //console.log("INSTALLBASE UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("INSTALLBASE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("INSTALLBASE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("INSTALLBASE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertInstallBase(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO InstallBase VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Installed_Base_ID);
                insertValues.push(responseList.Product_Line);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.TagNumber);
                insertValues.push(responseList.Original_PO_Number);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);

                //console.log("INSTALLBASE INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("INSTALLBASE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("INSTALLBASE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("INSTALLBASE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertContactList(response) {

            var responseList = response.Contacts;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Contact WHERE Contact_ID = " + responseList[i].Contact_ID + " AND Task_Number = " + responseList[i].Task_Number;

                        //console.log("CONTACT  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("CONTACT LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateContact(responseList[i]);

                            } else {

                                insertContact(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("CONTACT SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("CONTACT SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("CONTACT OBJECT =====> " + JSON.stringify(responseList));

                })(i);
            }
        };

        function updateContact(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Contact SET Customer_Name = ?, Contact_Name = ?, Home_Phone = ?, Mobile_Phone =?, Fax_Phone = ?, Office_Phone = ?, Email = ?, Foreign_Key = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?  WHERE Contact_ID = ? AND Task_Number = ?";

                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Contact_Name);
                insertValues.push(responseList.Home_Phone);
                insertValues.push(responseList.Mobile_Phone);
                insertValues.push(responseList.Fax_Phone);
                insertValues.push(responseList.Office_Phone);
                insertValues.push(responseList.Email);
                insertValues.push(responseList.Foreign_Key);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.Contact_ID);
                insertValues.push(responseList.Task_Number);

                //console.log("CONTACT UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("CONTACT ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("CONTACT UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CONTACT UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertContact(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Contact VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Contact_ID);
                insertValues.push(responseList.Customer_Name);
                insertValues.push(responseList.Contact_Name);
                insertValues.push(responseList.Home_Phone);
                insertValues.push(responseList.Mobile_Phone);
                insertValues.push(responseList.Fax_Phone);
                insertValues.push(responseList.Office_Phone);
                insertValues.push(responseList.Email);
                insertValues.push(responseList.Foreign_Key);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);

                //console.log("CONTACT INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("CONTACT INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("CONTACT INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CONTACT INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertNoteList(response) {

            var responseList = response.Notes;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Note WHERE ID = " + responseList[i].ID + " AND Task_Number = " + responseList[i].Task_Number;

                        //console.log("NOTE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("NOTE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateNote(responseList[i]);

                            } else {

                                insertNote(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("NOTE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("NOTE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("NOTE OBJECT =====> " + JSON.stringify(responseList));

                })(i);
            }
        };

        function updateNote(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Note SET Notes = ?, Notes_type = ?, Created_By = ?, Service_Request = ?, Assigned = ?, Start_Date = ?, End_Date = ?  WHERE ID = ? AND Task_Number =?";

                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Notes_type);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);
                insertValues.push(responseList.ID);
                insertValues.push(responseList.Task_Number);

                //console.log("NOTE UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("NOTE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("NOTE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("NOTE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertNote(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Note VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Notes_type);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Service_Request);
                insertValues.push(responseList.Assigned);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.End_Date);

                //console.log("NOTE INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("Note INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("NOTE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("NOTE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertAttachmentList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Attachment WHERE Attachment_Id = " + responseList[i].Attachment_Id + " AND Task_Number = " + responseList[i].Task_Number;

                        //console.log("ATTACHMENT  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("ATTACHMENT LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateAttachment(responseList[i]);

                            } else {

                                insertAttachment(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("ATTACHMENT SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("ATTACHMENT SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("ATTACHMENT OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateAttachment(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Attachment SET File_Name = ?, File_Type = ?, File_Path = ?, Type = ?, AttachmentType = ? WHERE Attachment_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.File_Type);
                insertValues.push(responseList.File_Path);
                insertValues.push(responseList.Type);
                insertValues.push(responseList.AttachmentType);
                insertValues.push(responseList.Attachment_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("ATTACHMENT ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("ATTACHMENT UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ATTACHMENT UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertAttachment(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Attachment VALUES (?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Attachment_Id);
                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.File_Type);
                insertValues.push(responseList.File_Path);
                insertValues.push(responseList.Type);
                insertValues.push(responseList.AttachmentType);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("ATTACHMENT INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("ATTACHMENT INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ATTACHMENT INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertProjectList(response) {

            var responseList = response.Project;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    if (i < responseList.length - 1) {

                        insertProject(responseList[i]);

                        updateProject(responseList[i]);

                    } else {

                        insertProject(responseList[i]);

                        updateProject(responseList[i]);
                    }

                    //console.log("PROJECT OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateProject(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Project SET Clarity_Contact = ?, P_ProjectManager = ?, P_Company = ?, P_ProjectNumber =?, Requested = ?  WHERE ID = ?";

                insertValues.push(responseList.Clarity_Contact);
                insertValues.push(responseList.P_ProjectManager);
                insertValues.push(responseList.P_Company);
                insertValues.push(responseList.P_ProjectNumber);
                insertValues.push(responseList.Requested);
                insertValues.push(responseList.ID);

                //console.log("PROJECT UPDATE VALUES =====> " + insertValues);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("PROJECT ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("PROJECT UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("PROJECT UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertProject(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Project VALUES (?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Clarity_Contact);
                insertValues.push(responseList.P_ProjectManager);
                insertValues.push(responseList.P_Company);
                insertValues.push(responseList.P_ProjectNumber);
                insertValues.push(responseList.Requested);

                //console.log("PROJECT INSERT VALUES =====> " + insertValues);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("PROJECT INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("PROJECT INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("PROJECT INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertOverTimeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var insertValues = [];

                        var sqlSelect = "SELECT * FROM OverTime WHERE OverTime_Shift_Code_ID = " + responseList[i].OverTime_Shift_Code_ID + " AND Task = " + responseList[i].Task;

                        //console.log("OVERTIME  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("OVERTIME LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateOverTime(responseList[i]);

                            } else {

                                insertOverTime(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("OVERTIME SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("OVERTIME SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("OVERTIME OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateOverTime(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE OverTime SET Overtimeshiftcode = ?, Technician_ID = ?, Field_Job_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?  WHERE OverTime_Shift_Code_ID = ? AND Task = ?";

                insertValues.push(responseList.Overtimeshiftcode);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(responseList.OverTime_Shift_Code_ID);
                insertValues.push(responseList.Task);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("OVERTIME ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("OVERTIME UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("OVERTIME UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertOverTime(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO OverTime VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.OverTime_Shift_Code_ID);
                insertValues.push(responseList.Overtimeshiftcode);
                insertValues.push(responseList.Task);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("OVERTIME INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("OVERTIME INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("OVERTIME INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertShiftCodeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ShiftCode WHERE Shift_Code_ID = " + responseList[i].Shift_Code_ID + " AND TaskNumber = " + responseList[i].TaskNumber;

                        //console.log("SHIFTCODE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("SHIFTCODE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateShiftCode(responseList[i]);

                            } else {

                                insertShiftCode(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("SHIFTCODE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("SHIFTCODE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("SHIFTCODE OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateShiftCode(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ShiftCode SET ShiftCodeName = ?, Technician_ID = ?, Field_Job_ID = ?, Start_Date = ?, Date_Completed = ?, Project = ?  WHERE Shift_Code_ID = ? AND TaskNumber = ?";

                insertValues.push(responseList.ShiftCodeName);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Shift_Code_ID);
                insertValues.push(responseList.TaskNumber);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("SHIFTCODE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("SHIFTCODE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("SHIFTCODE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertShiftCode(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ShiftCode VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Shift_Code_ID);
                insertValues.push(responseList.ShiftCodeName);
                insertValues.push(responseList.TaskNumber);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Field_Job_ID);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(responseList.Project);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("SHIFTCODE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("SHIFTCODE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("SHIFTCODE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertChargeTypeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ChargeType WHERE ID = " + responseList[i].ID;

                        //console.log("CHARGETYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("CHARGETYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateChargeType(responseList[i]);

                            } else {

                                insertChargeType(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("CHARGETYPE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("CHARGETYPE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("CHARGETYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateChargeType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ChargeType SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("CHARGETYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("CHARGETYPE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CHARGETYPE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertChargeType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ChargeType VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("CHARGETYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("CHARGETYPE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CHARGETYPE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertChargeMethodList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ChargeMethod WHERE ID = " + responseList[i].ID;

                        //console.log("CHARGEMETHOD  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("CHARGEMETHOD LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateChargeMethod(responseList[i]);

                            } else {

                                insertChargeMethod(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("CHARGEMETHOD SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("CHARGEMETHOD SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("CHARGEMETHOD OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateChargeMethod(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ChargeMethod SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("CHARGEMETHOD ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("CHARGEMETHOD UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CHARGEMETHOD UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertChargeMethod(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ChargeMethod VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("CHARGEMETHOD INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("CHARGEMETHOD INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CHARGEMETHOD INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertFieldJobNameList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM FieldJobName WHERE TaskCode = " + responseList[i].TaskCode + " AND Task = " + responseList[i].Task;

                        //console.log("FIELDJOBNAME  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("FIELDJOBNAME LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateFieldJobName(responseList[i]);

                            } else {

                                insertFieldJobName(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("FIELDJOBNAME SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("FIELDJOBNAME SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("FIELDJOBNAME OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateFieldJobName(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE FieldJobName SET JobName = ?, Technician_ID = ?, Project = ?, Start_Date = ?, Date_Completed = ?  WHERE TaskCode = ? AND Task = ?";

                insertValues.push(responseList.JobName);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);
                insertValues.push(responseList.TaskCode);
                insertValues.push(responseList.Task);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("FIELDJOBNAME ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("FIELDJOBNAME UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("FIELDJOBNAME UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertFieldJobName(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO FieldJobName VALUES (?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.TaskCode);
                insertValues.push(responseList.JobName);
                insertValues.push(responseList.Task);
                insertValues.push(responseList.Technician_ID);
                insertValues.push(responseList.Project);
                insertValues.push(responseList.Start_Date);
                insertValues.push(responseList.Date_Completed);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("FIELDJOBNAME INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("FIELDJOBNAME INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("FIELDJOBNAME INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertWorkTypeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM WorkType WHERE ID = " + responseList[i].ID;

                        //console.log("WORKTYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("WORKTYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateWorkType(responseList[i]);

                            } else {

                                insertWorkType(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("WORKTYPE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("WORKTYPE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("WORKTYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateWorkType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE WorkType SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("WORKTYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("WORKTYPE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("WORKTYPE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertWorkType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO WorkType VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("WORKTYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("WORKTYPE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("WORKTYPE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertItemList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Item WHERE ID = " + responseList[i].ID;

                        //console.log("ITEM  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("ITEM LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateItem(responseList[i]);

                            } else {

                                insertItem(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("ITEM SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("ITEM SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("ITEM OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateItem(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Item SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("ITEM ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("ITEM UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ITEM UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertItem(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Item VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("ITEM INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("ITEM INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ITEM INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertCurrencyList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Currency WHERE ID = " + responseList[i].ID;

                        //console.log("CURRENCY  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("CURRENCY LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateCurrency(responseList[i]);

                            } else {

                                insertCurrency(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("CURRENCY SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("CURRENCY SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("CURRENCY OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateCurrency(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Currency SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("CURRENCY ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("CURRENCY UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CURRENCY UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertCurrency(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Currency VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("CURRENCY INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("CURRENCY INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("CURRENCY INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertExpenseTypeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM ExpenseType WHERE ID = " + responseList[i].ID;

                        //console.log("EXPENSETYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("EXPENSETYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateExpenseType(responseList[i]);

                            } else {

                                insertExpenseType(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("EXPENSETYPE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("EXPENSETYPE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("EXPENSETYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateExpenseType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE ExpenseType SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("EXPENSETYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("EXPENSETYPE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("EXPENSETYPE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertExpenseType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO ExpenseType VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("EXPENSETYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("EXPENSETYPE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("EXPENSETYPE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertNoteTypeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM NoteType WHERE ID = " + responseList[i].ID;

                        //console.log("NOTETYPE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("NOTETYPE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateNoteType(responseList[i]);

                            } else {

                                insertNoteType(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("NOTETYPE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("NOTETYPE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("NOTETYPE OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateNoteType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE NoteType SET Value = ?  WHERE ID = ?";

                insertValues.push(responseList.Value);
                insertValues.push(responseList.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("NOTETYPE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("NOTETYPE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("NOTETYPE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertNoteType(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO NoteType VALUES (?, ?)";

                insertValues.push(responseList.ID);
                insertValues.push(responseList.Value);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("NOTETYPE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("NOTETYPE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("NOTETYPE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertTimeList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Time WHERE Time_Id = " + responseList[i].Time_Id;

                        //console.log("TIME  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("TIME LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateTime(responseList[i]);

                            } else {

                                insertTime(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("TIME SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("TIME SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("TIME OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateTime(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Time SET timeDefault = ?, Field_Job_Name = ?, Field_Job_Name_Id = ?, Charge_Type = ?, Charge_Type_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Work_Type = ?, Work_Type_Id = ?, Item = ?, Item_Id = ?, Description = ?, Time_Code = ?, Time_Code_Id = ?, Shift_Code = ?, Shift_Code_Id = ?, Date = ?, Duration = ?, Comments = ?  WHERE Time_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.timeDefault);
                insertValues.push(responseList.Field_Job_Name);
                insertValues.push(responseList.Field_Job_Name_Id);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Work_Type);
                insertValues.push(responseList.Work_Type_Id);
                insertValues.push(responseList.Item);
                insertValues.push(responseList.Item_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.Time_Code);
                insertValues.push(responseList.Time_Code_Id);
                insertValues.push(responseList.Shift_Code);
                insertValues.push(responseList.Shift_Code_Id);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Comments);
                insertValues.push(responseList.Time_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("TIME ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("TIME UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("TIME UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertTime(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Time VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Time_Id);
                insertValues.push(responseList.timeDefault);
                insertValues.push(responseList.Field_Job_Name);
                insertValues.push(responseList.Field_Job_Name_Id);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Work_Type);
                insertValues.push(responseList.Work_Type_Id);
                insertValues.push(responseList.Item);
                insertValues.push(responseList.Item_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.Time_Code);
                insertValues.push(responseList.Time_Code_Id);
                insertValues.push(responseList.Shift_Code);
                insertValues.push(responseList.Shift_Code_Id);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Duration);
                insertValues.push(responseList.Comments);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("TIME INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("TIME INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("TIME INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertExpenseList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Expense WHERE Expense_Id = " + responseList[i].Expense_Id;

                        //console.log("EXPENSE  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("EXPENSE LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateExpense(responseList[i]);

                            } else {

                                insertExpense(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("EXPENSE SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("EXPENSE SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("EXPENSE OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateExpense(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Expense SET expenseDefault = ?, Date = ?, Expense_Type = ?, Expense_Type_Id = ?, Amount = ?, Currency = ?, Currency_Id = ?, Charge_Method = ?, Charge_Method_Id = ?, Justification = ? WHERE Expense_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.expenseDefault);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Expense_Type);
                insertValues.push(responseList.Expense_Type_Id);
                insertValues.push(responseList.Amount);
                insertValues.push(responseList.Currency);
                insertValues.push(responseList.Currency_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Justification);
                insertValues.push(responseList.Expense_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("EXPENSE ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("EXPENSE UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("EXPENSE UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertExpense(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Expense VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Expense_Id);
                insertValues.push(responseList.expenseDefault);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Expense_Type);
                insertValues.push(responseList.Expense_Type_Id);
                insertValues.push(responseList.Amount);
                insertValues.push(responseList.Currency);
                insertValues.push(responseList.Currency_Id);
                insertValues.push(responseList.Charge_Method);
                insertValues.push(responseList.Charge_Method_Id);
                insertValues.push(responseList.Justification);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("EXPENSE INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("EXPENSE INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("EXPENSE INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertMaterialList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Material WHERE Material_Id = " + responseList[i].Material_Id;

                        //console.log("MATERIAL  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("MATERIAL LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateMaterial(responseList[i]);

                            } else {

                                insertMaterial(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("MATERIAL SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("MATERIAL SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("MATERIAL OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateMaterial(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Material SET materialDefault = ?, Charge_Type = ?, Charge_Type_Id = ?, Description = ?, ItemName = ?, Product_Quantity = ?, Serial_Number = ?, Serial_In = ?, Serial_Out = ? WHERE Material_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.materialDefault);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.ItemName);
                insertValues.push(responseList.Product_Quantity);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.Serial_In);
                insertValues.push(responseList.Serial_Out);
                insertValues.push(responseList.Material_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("MATERIAL ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("MATERIAL UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("MATERIAL UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertMaterial(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Material VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Material_Id);
                insertValues.push(responseList.materialDefault);
                insertValues.push(responseList.Charge_Type);
                insertValues.push(responseList.Charge_Type_Id);
                insertValues.push(responseList.Description);
                insertValues.push(responseList.ItemName);
                insertValues.push(responseList.Product_Quantity);
                insertValues.push(responseList.Serial_Number);
                insertValues.push(responseList.Serial_In);
                insertValues.push(responseList.Serial_Out);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("MATERIAL INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("MATERIAL INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("MATERIAL INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertNotesList(response) {

            var responseList = response;

            for (var i = 0; i < responseList.length; i++) {

                (function (i) {

                    db.transaction(function (transaction) {

                        var sqlSelect = "SELECT * FROM Notes WHERE Notes_Id = " + responseList[i].Notes_Id;

                        //console.log("NOTES  ====> " + sqlSelect);

                        transaction.executeSql(sqlSelect, [], function (tx, res) {

                            var rowLength = res.rows.length;

                            //console.log("NOTES LENGTH ====> " + rowLength);

                            if (rowLength > 0) {

                                updateNotes(responseList[i]);

                            } else {

                                insertNotes(responseList[i]);
                            }

                        }, function (tx, error) {

                            //console.log("NOTES SELECT ERROR: " + error.message);
                        });

                    }, function (error) {

                        //console.log("NOTES SELECT TRANSACTION ERROR: " + error.message);
                    });

                    //console.log("NOTES OBJECT =====> " + JSON.stringify(responseList[i]));

                })(i);
            }
        };

        function updateNotes(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Notes SET noteDefault = ?, Note_Type = ?, Note_Type_Id = ?, Date = ?, Created_By = ?, Notes = ? WHERE Notes_Id = ? AND Task_Number = ?";

                insertValues.push(responseList.noteDefault);
                insertValues.push(responseList.Note_Type);
                insertValues.push(responseList.Note_Type_Id);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Notes_Id);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("NOTES ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("NOTES UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("NOTES UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertNotes(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Notes VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Notes_Id);
                insertValues.push(responseList.noteDefault);
                insertValues.push(responseList.Note_Type);
                insertValues.push(responseList.Note_Type_Id);
                insertValues.push(responseList.Date);
                insertValues.push(responseList.Created_By);
                insertValues.push(responseList.Notes);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("NOTES INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("NOTES INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("NOTES INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function insertEngineerList(response) {

            var responseList = response;

            db.transaction(function (transaction) {

                var sqlSelect = "SELECT * FROM Engineer WHERE Engineer_Id = " + responseList.Engineer_Id;

                //console.log("ENGINEER  ====> " + sqlSelect);

                transaction.executeSql(sqlSelect, [], function (tx, res) {

                    var rowLength = res.rows.length;

                    //console.log("ENGINEER LENGTH ====> " + rowLength);

                    if (rowLength > 0) {

                        updateEngineer(responseList);

                    } else {

                        insertEngineer(responseList);
                    }

                }, function (tx, error) {

                    //console.log("ENGINEER SELECT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ENGINEER SELECT TRANSACTION ERROR: " + error.message);
            });

            //console.log("ENGINEER OBJECT =====> " + JSON.stringify(responseList));

        };

        function updateEngineer(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE Engineer SET Follow_Up = ?, Spare_Quote= ?, Sales_Visit = ?, Sales_Head =?, Sign_File_Path =?, File_Name =?, Task_Number = ?  WHERE Engineer_Id = ?";

                insertValues.push(responseList.Follow_Up);
                insertValues.push(responseList.Spare_Quote);
                insertValues.push(responseList.Sales_Visit);
                insertValues.push(responseList.Sales_Head);
                insertValues.push(responseList.Sign_File_Path);
                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.Task_Number);
                insertValues.push(responseList.Engineer_Id);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("ENGINEER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("ENGINEER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ENGINEER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertEngineer(responseList) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO Engineer VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(responseList.Engineer_Id);
                insertValues.push(responseList.Follow_Up);
                insertValues.push(responseList.Spare_Quote);
                insertValues.push(responseList.Sales_Visit);
                insertValues.push(responseList.Sales_Head);
                insertValues.push(responseList.Sign_File_Path);
                insertValues.push(responseList.File_Name);
                insertValues.push(responseList.Task_Number);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("ENGINEER INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("ENGINEER INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("ENGINEER INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteInstallBase() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM InstallBase";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("INSTALLBASE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteContact() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Contact";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("CONTACT DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNote() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Note";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("NOTE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteShiftCode() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ShiftCode";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("SHIFTCODE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteOverTime() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM OverTime";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("OVERTIME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteChargeType() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ChargeType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("CHARGETYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteChargeMethod() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ChargeMethod";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("CHARGEMETHOD DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteFieldJobName() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM FieldJobName";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("FIELDJOBNAME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteWorkType() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM WorkType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("WORKTYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteItem() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Item";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("ITEM DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteCurrency() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM Currency";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("CURRENCY DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteExpenseType() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM ExpenseType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("EXPENSETYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNoteType() {

            db.transaction(function (transaction) {

                var sqlDelete = "DELETE FROM NoteType";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("NOTETYPE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteTime(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Time WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("TIME DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteExpense(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Expense WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("EXPENSE DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteMaterial(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Material WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("MATERIAL DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteNotes(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Notes WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("NOTES DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteAttachment(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Attachment WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("ATTACHMENT DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteEngineer(taskId) {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM Engineer WHERE Task_Number = " + taskId;

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("ENGINEER DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function insertUser(userObject) {

            //console.log("USER INSERT OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlInsert = "INSERT INTO User VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                insertValues.push(userObject.ID);
                insertValues.push(userObject.ClarityID);
                insertValues.push(userObject.Currency);
                insertValues.push(userObject.Default_View);
                insertValues.push(userObject.Email);

                insertValues.push(userObject.Language);
                insertValues.push(userObject.Name);
                insertValues.push(userObject.OFSCId);
                insertValues.push(userObject.Password);
                insertValues.push(userObject.Time_Zone);

                insertValues.push(userObject.Type);
                insertValues.push(userObject.User_Name);
                insertValues.push(userObject.Work_Day);
                insertValues.push(userObject.Work_Hour);
                insertValues.push(userObject.Last_updated);

                transaction.executeSql(sqlInsert, insertValues, function (tx, res) {

                    //console.log("USER INSERT ID: " + res.insertId);

                }, function (tx, error) {

                    //console.log("USER INSERT ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("USER INSERT TRANSACTION ERROR: " + error.message);
            });
        };

        function updateUser(userObject) {

            //console.log("USER UPDATE OBJECT =====> " + JSON.stringify(userObject));

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlUpdate = "UPDATE User SET User_Name = ?  WHERE ID = ?";

                insertValues.push(userObject.User_Name);
                insertValues.push(userObject.ID);

                transaction.executeSql(sqlUpdate, insertValues, function (tx, res) {

                    //console.log("USER ROW AFFECTED: " + res.rowsAffected);

                }, function (tx, error) {

                    //console.log("USER UPDATE ERROR: " + error.message);
                });

            }, function (error) {

                //console.log("USER UPDATE TRANSACTION ERROR: " + error.message);
            });
        };

        function deleteUser() {

            db.transaction(function (transaction) {

                var insertValues = [];

                var sqlDelete = "DELETE FROM User";

                transaction.executeSql(sqlDelete);

            }, function (error) {

                //console.log("USER DELETE TRANSACTION ERROR: " + error.message);
            });
        };

        function getUser(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM User", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET USER DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET USER SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET USER TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getTaskList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Task", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET TASK DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET TASK SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET TASK TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getPendingTaskList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Task WHERE Submit_Status = ?", ["P"], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET TASK PENDING DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET TASK PENDING SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET TASK PENDING TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getAcceptTaskList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Task WHERE Submit_Status = ?", ["A"], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET TASK ACCEPT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET TASK ACCEPT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET TASK ACCEPT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getInstallBaseList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM InstallBase WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET INSTALLBASE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET INSTALLBASE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET INSTALLBASE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getContactList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Contact WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET CONTACT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET CONTACT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET CONTACT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getNoteList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Note WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET NOTE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET NOTE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET NOTE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getProjectList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Project", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET PROJECT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET PROJECT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET PROJECT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getOverTimeList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM OverTime WHERE Task = ?", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET OVERTIME DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET OVERTIME SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET OVERTIME TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getShiftCodeList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ShiftCode  WHERE TaskNumber = ?", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET SHIFTCODE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET SHIFTCODE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET SHIFTCODE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getChargeTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ChargeType", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET CHARGETYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET CHARGETYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET CHARGETYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getChargeMethodList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ChargeMethod", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET CHARGEMETHOD DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET CHARGEMETHOD SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET CHARGEMETHOD TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getFieldJobNameList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM FieldJobName", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET FIELDJOBNAME DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET FIELDJOBNAME SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET FIELDJOBNAME TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getWorkTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM WorkType", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET WORKTYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET WORKTYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET WORKTYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getItemList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Item", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET ITEM DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET ITEM SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET ITEM TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getCurrencyList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Currency", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET CURRENCY DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET CURRENCY SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET CURRENCY TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getExpenseTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM ExpenseType", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET EXPENSETYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET EXPENSETYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET EXPENSETYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getNoteTypeList(callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM NoteType", [], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET NOTETYPE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET NOTETYPE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET NOTETYPE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getTimeList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Time WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET TIME DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET TIME SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET TIME TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getExpenseList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Expense WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET EXPENSE DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET EXPENSE SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET EXPENSE TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getMaterialList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Material WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET MATERIAL DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET MATERIAL SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET MATERIAL TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getNotesList(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Notes WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET NOTES DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET NOTES SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET NOTES TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getAttachmentList(taskId, type, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Attachment WHERE Task_Number = ? AND Type = ?", [taskId, type], function (tx, res) {

                    var rowLength = res.rows.length;

                    for (var i = 0; i < rowLength; i++) {

                        value.push(res.rows.item(i));
                    }

                    //console.log("GET ATTACHMENT DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET ATTACHMENT SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET ATTACHMENT TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };

        function getEngineer(taskId, callback) {

            var value = [];

            return db.transaction(function (transaction) {

                transaction.executeSql("SELECT * FROM Engineer WHERE Task_Number = ? ", [taskId], function (tx, res) {

                    var rowLength = res.rows.length;

                    var value = res.rows.item(0);

                    //console.log("GET ENGINEER DB ==========> " + JSON.stringify(value));

                    callback(value);

                }, function (tx, error) {

                    //console.log("GET ENGINEER SELECT ERROR: " + error.message);

                    callback(value);
                });

            }, function (error) {

                //console.log("GET ENGINEER TRANSACTION ERROR: " + error.message);

                callback(value);
            });
        };
    }

})();
