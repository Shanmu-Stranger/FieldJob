app.controller('taskOverFlowController', function($scope, $http, $state, $rootScope,cloudService,valueService,constantService) {
    $scope.myVar = false;
    $rootScope.Islogin = true;
    $rootScope.closed = false;
    $scope.ProductQuantity = 1;
    $scope.isFutureDate = valueService.getIfFutureDateTask();
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
    };
    $scope.taskId=$rootScope.selectedTask.Task_Number;
    $scope.taskDetails=$rootScope.selectedTask;
    valueService.setTaskId($scope.taskDetails.Task_Number);
    var date=new Date();
    date.setMonth(date.getMonth()-1);
    var endDate =new Date();
    endDate.setDate(endDate.getDate()+7);
    $scope.form = {
        resourceId: valueService.getResourceId(),
        startDate: date.toISOString(),
        endDate: endDate.toISOString(),
        header: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==',
            'oracle-mobile-backend-id': 'cc9a9b83-02ff-4be1-8b70-bccb3ac6c592'
        }
    };
    // activate();
    // function activate(){
    //     getDebriefStagesInfo();
    // }
    // function getDebriefStagesInfo(){
    //     var notesArray=[];
    //     cloudService.getNoteListCloud($scope.form,function(response){
    //         console.log('*****Notes Response*****');
    //         console.log(response.Notes);


    //         angular.forEach(response.Notes,function(key,value)
    //         {
    //             var noteObj={}
    //             if(key.Task_Number==$scope.taskId)
    //             {
    //                 noteObj.Created_By = key.Created_By;
    //                 noteObj.Start_Date = key.Start_Date;
    //                 noteObj.Notes      = key.Notes;
    //                 noteObj.Notes_type = key.Notes_type;
    //                 notesArray.push(noteObj);
    //             }
    //         })

    //         $scope.taskDetails.Notes=notesArray;


    //     })
    // }
    displayMap();

    function displayMap(){
      //setTimeout(function(){


      //  var getCountryByCurr = valueService.getTechProResponse().technicianProfile[0].Currency;
      console.log('****dff***');
      console.log(valueService.getTask());
        if (valueService.getTask().Country =="People's Republic of China") {
          var map = new BMap.Map("allmap");
          map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

          map.addControl(new BMap.MapTypeControl({
          mapTypes:[
              BMAP_NORMAL_MAP,
              BMAP_HYBRID_MAP
          ]}));
          map.setCurrentCity("??");
          map.enableScrollWheelZoom(true);
            $scope.chinaUser = true;
        }
        else{
             $scope.chinaUser = false;
        }
        //}, 3000);
    }
    if ($rootScope.local) {

        // getTask();

    } else {

       // getAttachments();
    }
    $(function () {

        var mapClose=true;
        var firstload=true
        var map
        $('#mapToggle').click(function () {

            if(firstload)
            {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: -34.397, lng: 150.644},
                    zoom: 8
                });
                firstload=false;
                codeAddress($scope.taskDetails.Zip_Code);
                // codeAddress("600097");
            }
            if(mapClose)
            {
                if ($scope.chinaUser == false) {
                    document.getElementById('map').style.display="block";
                    google.maps.event.trigger(document.getElementById('map'),'resize')
                    mapClose=false;
                }else{
                     document.getElementById('allmap').style.display="block";
                      mapClose=false;
                }

            }
            else{
                if ($scope.chinaUser == false) {
                document.getElementById('map').style.display="none";
                mapClose=true;
                }else{
                     document.getElementById('allmap').style.display="none";
                      mapClose=true;
                }
            }
        }

    )
    function codeAddress(address) {
        // alert("hi code add" +address);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            //  alert("successfull")
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                var latlng = new google.maps.LatLng(latitude, longitude);
                map.setCenter(latlng);
                //map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                /*alert("Geocode was not successful for the following reason: " + status);*/
            }
        });
    }
});
cloudService.getContactListCloud($scope.form, function(response) {
    var contactArray=[];
    var contactsEmailID = [];
    angular.forEach(response.Contacts,function(key,value)
    {
        var contactObj={}
        if(key.Task_Number==$scope.taskId)
        {
            contactObj.Contact_Name=key.Contact_Name;
            contactObj.Home_Phone=key.Home_Phone;
            contactObj.Mobile_Phone=key.Mobile_Phone;
            contactObj.Fax_Phone=key.Fax_Phone;
            contactObj.Office_Phone=key.Office_Phone;
            contactObj.Email=key.Email;
            contactArray.push(contactObj);
        }
    })
    $scope.taskDetails.Contacts=contactArray;
    console.log('****Contacts obj****');
    console.log(contactArray);
    constantService.setUserEmailId(contactArray);
    //console.log(constantService.getUserEmailId());

})
cloudService.getInstallBaseListCloud($scope.form,function(response)
{
    console.log(response);
    angular.forEach(response.InstallBase,function(key,value)
    {
        var contactObj={}
        if(key.Task_Number==$scope.taskId)
        {
            $scope.taskDetails.Product_Line=key.Product_Line;
            $scope.taskDetails.Serial_Number=key.Serial_Number;
            $scope.taskDetails.tagNo=key.TagNumber;
            $scope.taskDetails.orginalNo=key.Original_PO_Number;
            $rootScope.selectedTask=$scope.taskDetails;
            valueService.setTask($scope.taskDetails);
        }
    });
}
)
// function getAttachments()
// {
//     cloudService.getFileIds(valueService.getResourceId(),$scope.form,function(response){
//         if(response.Attachments_Info!=undefined && response.Attachments_Info.length>0)
//         {
//             angular.forEach(response.Attachments_Info,function(key,value)
//             {
//                 if(key.Task_Id==$scope.taskId )
//                 {
//                     $scope.Attachments=key.Attachments;
//                     angular.forEach($scope.Attachments,function(key,value)
//                     {
//                         download(key,function(response)
//                         {
//                             key.base64Code=response;
//                         });
//                     });
//                 }
//             });
//         }
//     });
// }

function download(resource,callback)
{
    cloudService.downloadAttachment($scope.form,$scope.taskId,resource.Attachments_Id,function(response)
    {
        callback(response.data);
    })
}
$scope.download=function(resource)
{
    cloudService.downloadAttachment($scope.form,$scope.taskId,resource.Attachments_Id,function(response)
    {
       // callback(response.data);

    base64DownloadFactory.download('data:'+resource.Content_type+','+response.data+',', 'MyFileHello', 'pdf')
})
}
// $http.get("app/json/installBase.json").then(function(response) {
//     console.log(response.data);
//     angular.forEach(response.data.InstallBase,function(key,value)
//     {
//         var contactObj={}
//         if(key.Task_Number==$scope.taskId)
//         {
//             $scope.taskDetails.Product_Line=key.Product_Line;
//             $scope.taskDetails.Serial_Number=key.Serial_Number;
//             $scope.taskDetails.tagNo=key.tagNo;
//             $scope.taskDetails.orginalNo=key.orginalNo;

//         }
//     });
// });
$scope.contacts = [
    { name: "Santiago Munez", No: "+(832)534678", email: "Santiago.munex@rolce.com" },
    { name: "Munex Montanio", No: "+(832)534678", email: "Santiago.munex@rolce.com" }
];

$scope.tasks = [];
$scope.defaultTasks = ["1/2 SOCKET", "Cage Retainer Tool", "Power Torque Erench", "Plyers", "3/4 SOCKET"];

//  $scope.resourcesFiles=["doc1","doc2","doc3"];

$scope.goToBack = function() {
    $state.go('myTask');
}

$scope.add = function() {
    $scope.tasks.push($scope.title);
    //$scope.title='';
    $scope.TodoForm.title.$setPristine();
    $scope.TodoForm.title.$setPristine(true);
    $scope.title = '';

};

$scope.delete = function() {
    $scope.tasks.splice(this.$index, 1);
};


$scope.items = [];
$scope.addItem = function() {
    $scope.items.push($scope.item);
    $scope.MaterialForm.item.$setPristine();
    $scope.MaterialForm.item.$setPristine(true);
    $scope.item = '';
};
$scope.deleteItem = function() {
    $scope.items.splice(this.$index, 1);

};
//  $scope.startWork = function(){
//       $state.go('debrief')
//   }
$scope.accept = function() {
    //$rootScope.showDebrief = true;
    // var formData={
    //   "taskId":$rootScope.selectedTask.Task_Number,
    //   "taskStatus":"Assigned"
    // }
    // cloudService.acceptTask(formData,function(response){
    //    console.log(response);
    // });
}
// $scope.toggle=function()
// {
//   if( $rootScope.closed)
//   {
//      $rootScope.closed=false;
//   }
//   else
//   {
//      $rootScope.closed=true;
//   }
// }
    $scope.openResources=function(type,name,data){
        var folderpath = cordova.file.dataDirectory;
        savebase64AsImageFile(folderpath, name, data, type);
        cordova.plugins.fileOpener2.open(
            folderpath+name, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
            type,
            {
                error : function(e) {
                    console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                },
                success : function () {
                    console.log('file opened successfully');
                }
            }
        );
    }

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
    }


    function savebase64AsImageFile(folderpath,filename,content,contentType){

        console.log("FOLDER PATH  "+folderpath)

        var DataBlob = b64toBlob(content,contentType);

        console.log("Starting to write the file :3");

        window.resolveLocalFileSystemURL(folderpath, function(dir) {
            console.log("Access to the directory granted succesfully");
            dir.getFile(filename, {create:true}, function(file) {
                console.log("File created succesfully.");
                file.createWriter(function(fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.write(DataBlob);
                }, function(){
                    alert('Unable to save file in path '+ folderpath);
                });
            });
        });
    }

    $scope.mapClicked = function(){
        $scope.mapIsClicked = !$scope.mapIsClicked;
    }
});
