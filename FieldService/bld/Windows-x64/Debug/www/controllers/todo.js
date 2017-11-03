app.controller('todoController', function ($scope, $http, $state, $rootScope, cloudService, valueService, localService) {

    $scope.myVar = false;

    $rootScope.Islogin = true;

    $rootScope.closed = false;

    $scope.ProductQuantity = 1;

    $scope.toggle = function () {

        $scope.myVar = !$scope.myVar;
    };

    if ($rootScope.local) {

        localService.getNoteList(valueService.getTask().Task_Number, function (response) {

            $scope.noteArray = response;

        });

        localService.getAttachmentList(valueService.getTask().Task_Number, "O", function (response) {

            $scope.attachmentArray = response;

        });

    } else {

        getDebriefStagesInfo();

        getAttachments();
    }

    $scope.openResource = function (item) {

        valueService.openFile(item.File_Path + item.File_Name, item.File_Type);
    };

    $scope.taskId = valueService.getTask().Task_Number;

    function getDebriefStagesInfo() {

        var notesArray = [];

        cloudService.getNoteListCloud(function (response) {

            angular.forEach(response.Notes, function (key, value) {

                var noteObj = {};

                if (key.Task_Number == $scope.taskId) {

                    noteObj.Created_By = key.Created_By;
                    noteObj.Start_Date = key.Start_Date;
                    noteObj.Notes = key.Notes;
                    noteObj.Notes_type = key.Notes_type;

                    notesArray.push(noteObj);
                }
            });

            $scope.noteArray = notesArray;
        });
    }

    function getAttachments() {

        cloudService.getFileIds(function (response) {

            if (response.Attachments_Info != undefined && response.Attachments_Info.length > 0) {

                angular.forEach(response.Attachments_Info, function (key, value) {

                    if (key.Task_Id == $scope.taskId) {

                        $scope.Attachments = key.Attachments;

                        angular.forEach($scope.Attachments, function (key, value) {

                            download(key, function (response) {

                                key.base64Code = response;
                            });
                        });
                    }
                });
            }
        });
    }

    function download(resource, callback) {

        cloudService.downloadAttachment($scope.taskId, resource.Attachments_Id, function (response) {

            callback(response.data);
        });
    }

    $scope.contacts = [
        {name: "Santiago Munez", No: "+(832)534678", email: "Santiago.munex@rolce.com"},
        {name: "Munex Montanio", No: "+(832)534678", email: "Santiago.munex@rolce.com"}
    ];

    $scope.tasks = [];

    $scope.defaultTasks = ["1/2 SOCKET", "Cage Retainer Tool", "Power Torque Erench", "Plyers", "3/4 SOCKET"];

    $scope.goToBack = function () {
        $state.go('myTask');
    }

    $scope.add = function () {
        $scope.tasks.push($scope.title);
        //$scope.title='';
        $scope.TodoForm.title.$setPristine();
        $scope.TodoForm.title.$setPristine(true);
        $scope.title = '';
    };

    $scope.delete = function () {
        $scope.tasks.splice(this.$index, 1);
    };

    $scope.items = [];

    $scope.addItem = function () {
        $scope.items.push($scope.item);
        $scope.MaterialForm.item.$setPristine();
        $scope.MaterialForm.item.$setPristine(true);
        $scope.item = '';
    };

    $scope.deleteItem = function () {
        $scope.items.splice(this.$index, 1);
    };

    $scope.mapClicked = function () {
        $scope.mapIsClicked = !$scope.mapIsClicked;
    }
});

