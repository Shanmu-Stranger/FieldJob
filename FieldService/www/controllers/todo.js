app.controller('todoController', function ($scope, $http, $state, $rootScope, cloudService, valueService, localService) {

    $scope.myVar = false;

    $rootScope.Islogin = true;

    $rootScope.closed = false;

    $scope.ProductQuantity = 1;
    $scope.isFutureDateInTodo = valueService.getIfFutureDateTask();
    $scope.toggle = function () {

        $scope.myVar = !$scope.myVar;
    };

    $scope.noteArray = valueService.getTaskNotes();

    console.log("NOTE ARRAY " + $scope.noteArray);

    $scope.attachmentArray = valueService.getTaskAttachment();
    $scope.attachments=[];
    angular.forEach($scope.attachmentArray,function (attachment) {
        var attachmentObject={};
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            fs.root.getFile(attachment.File_Name, {create: true, exclusive: false}, function (fileEntry) {

                fileEntry.file(function (file) {

                    var reader = new FileReader();

                    reader.onloadend = function () {

                        console.log("Successful file read: " + this.result);

                        attachment.base64 = this.result.split(",")[1];

                        attachment.contentType = attachment.File_Type;

                        attachment.filename = attachment.File_Name.split(".")[0];
                        attachment.Date_Created = attachment.Created_Date;
                        
                        attachment.filetype = attachment.File_Name.split(".")[1];
                        $scope.$apply()
                        // if (attachment.AttachmentType == "D") {

                         //   $scope.attachments.push(attachmentObject);

                        // } else if (attachment.AttachmentType == "M") {
                        //
                        //     $scope.image.push(attachmentObject)
                        // }
                    };

                    reader.readAsDataURL(file);
                });
            });
        });
    })

    $scope.openResource = function (item) {

        valueService.openFile(item.File_Path + item.File_Name, item.File_Type);
    };

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
