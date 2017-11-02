app.controller('myTaskController', function ($scope, $compile, $timeout, uiCalendarConfig, $rootScope, $state, $http, cloudService, localService, valueService,$filter) {

    if (valueService.getNetworkStatus()) {

        localService.getPendingTaskList(function (response) {

            angular.forEach(response, function (item) {

                valueService.submitDebrief(item.Task_Number);

            });
        });
    }

    $scope.showSearchTaskDiv = false;

    // valueService.setResourceId("5");

    $rootScope.Islogin = true;

    $rootScope.headerName = 'Field Service';

    $rootScope.selectedCategory = 'Field Service';

    var eventsArray = [];

    if ($rootScope.local) {

        getTask();

    } else {

        getTaskListCloud();
    }

    function getTask() {

        localService.getTaskList(function (response) {

            $scope.myTaskDetails = response;

            setEventArray(response);

            eventInit();
        });
    }

    function getTaskListCloud() {

        var date = new Date();

        date.setMonth(date.getMonth() - 1);

        var endDate = new Date();

        endDate.setDate(endDate.getDate() + 7);

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

        cloudService.getTaskListCloud($scope.form, function (response) {

            if (response != null) {

                $scope.myTaskDetails = response.TaskDetails;

                setEventArray(response.TaskDetails);

                eventInit();
            }
        });
    }

    function setEventArray(response) {

        if(response != null && response.length > 0) {

            response.forEach(function (item) {

                var startDate = item.Start_Date.split(' ');
                var startDateTime = startDate[0] + "T" + startDate[1];

                var endDate = item.End_Date.split(' ');
                var endDateTime = endDate[0] + "T" + endDate[1];

                var customerInfo = item.Customer_Name + "\n" + item.Street_Address + "\n" + item.City + "\n" + item.State + "\n" + item.Zip_Code;

              //  if (item.Task_Status == 'Accepted' || item.Task_Status == 'Assigned'||) {

                    eventsArray.push({
                        title: customerInfo,
                        textEscape: true,
                        start: startDateTime,
                        end: endDateTime,
                        Task_Number: item.Task_Number,
                        Task_Status: item.Task_Status,
                        Job_Description: item.Job_Description,
                        Start_Date: item.Start_Date,
                        End_Date: item.End_Date,
                        Assigned: item.Assigned,
                        Service_Request: item.Service_Request,
                        Expense_Method: item.Expense_Method,
                        Labor_Method: item.Labor_Method,
                        Travel_Method: item.Travel_Method,
                        Material_Method: item.Material_Method,
                        Duration: item.Duration,
                        Customer_Name: item.Customer_Name,
                        Street_Address: item.Street_Address,
                        City: item.City,
                        State: item.State,
                        Zip_Code: item.Zip_Code,
                        Expense_Method: item.Expense_Method,
                        Labor_Method: item.Labor_Method,
                        Travel_Method: item.Travel_Method,
                        Material_Method: item.Material_Method
                    });
              //  }
            });
        }
    }

    function eventInit() {
        //Set time range for technician based on duration from techpro API call
        var minTimeVal = "07:00:00";
        /*var minTimeFormat = minTimeVal.split(':');
        var hour = parseInt(minTimeFormat[0]);
        var min = parseInt(minTimeFormat[1]);
        var sec = parseInt(minTimeFormat[2]);
        var duration = parseInt(valueService.getUserType().duration);
        hour +=  duration;
        var maxTimeVal = hour.toString() + ":" + min.toString() +":" + sec.toString();*/
        var maxTimeVal = "24:00:00";

        $("fc-left").addClass("col-md-4");

        /*$('.showTaskList').hide();*/

        $('#calendar').fullCalendar({
            customButtons: {
                monthButton: {
                    text: 'month',
                    click: function () {
                        $scope.showMonth = true;
                    }
                },
                myCalendar: {
                    text: 'My Calendar',
                    click: function (item) {
console.log(item);
                        /*$(document).ready(function () {

                            if ($('.showTaskList').is(":visible")) {

                                $('.showTaskList').hide();
                                $('.fc-view-container').show();
                                $('#calendar > div.fc-toolbar.fc-header-toolbar > div.fc-center > div').show();
                                $('.fc-toolbar.fc-header-toolbar').show();
                                $('.showMonth').show();
                            }
                        });*/
                        $state.go('myTask');
                    }
                },
                myTask: {
                    text: 'My Field Job',
                    click: function () {

                        /*if ($('.fc-view-container').is(":visible")) {

                            $('.fc-view-container').hide();
                            $('#calendar > div.fc-toolbar.fc-header-toolbar > div.fc-center > div').hide();
                            $('.fc-toolbar.fc-header-toolbar').hide();
                            $('.showMonth').hide();
                            $('.showTaskList').show();
                            $rootScope.tabClicked = true;
                        }*/
                        $state.go('myFieldJob');
                        $rootScope.tabClicked = true;
                        $rootScope.selectedItem=2;
                    }
                }
            },
            header: {
                left: 'myCalendar,myTask',
                right: 'prev,title,next today',
                center: 'agendaWeek,agendaDay,month'
            },
            //defaultDate: '2017-09-12',
            defaultView: 'agendaWeek',
            navLinks: true,
            editable: false,
            eventLimit: true,
              views: {
                 month: {
                   eventLimit: 2
                 }
             },
            allDaySlot: false,
            minTime: minTimeVal,
            maxTime: maxTimeVal,
            events: eventsArray,
            eventClick: function (event, jsEvent, view) {
                console.log(event);

                $rootScope.selectedTask = event;

                valueService.setTask(event);

                $rootScope.selectedItem = 3;

                $rootScope.showTaskDetail = true;
                if(event.Task_Status == 'Field Job Completed' || event.Task_Status == 'Completed')
                {
                    $rootScope.completedTask=true;
                    $state.go('debrief');
                }
                else
                $state.go('taskOverFlow');
            },
            eventRender: function (event, element) {

                if (event.Task_Status == 'Completed') {
                    element.addClass("completedEvent");
                } else if (event.Task_Status == 'Accepted'){
                    element.addClass("acceptedEvent");
                }
                else {
                    element.addClass("assignedEvent");
                } 
                    
            }
        });
    }

    $scope.goToDate = function () {

        console.log($scope.selectedDate);

        if ($scope.selectedDate) {

            var date = new Date($scope.selectedDate).toDateString("yyyy-MM-dd");

            $('#calendar').fullCalendar('gotoDate', date);
        }
    }

    $scope.today = function () {

        $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {

        $scope.dt = null;
    };

    $scope.options = {

        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    // Disable weekend selection
    /*function disabled(data) {
        var date = data.date,
        mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }*/

    $scope.toggleMin = function () {
        $scope.options.minDate = $scope.options.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.setDate = function (year, month, day) {

        $scope.dt = new Date(year, month, day);
    };

    var tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    var afterTomorrow = new Date(tomorrow);

    afterTomorrow.setDate(tomorrow.getDate() + 1);

    $scope.events = [{date: tomorrow, status: 'full'}, {date: afterTomorrow, status: 'partially'}];

    function getDayClass(data) {

        var date = data.date,
            mode = data.mode;

        if (mode === 'day') {

            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {

                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.onAcceptCall = function () {

        $state.go('Task Overflow');
    }

    $scope.query = {

        order: 'name',
        limit: 9,
        page: 1
    };

    $scope.changeSearch = function (data) {

        $scope.taskInput = data;
    }

    $scope.changeTaskStatus = function (taskStatus) {

        console.log(taskStatus);

        if (taskStatus == "All") {

            $scope.selectedTaskStatus = undefined;

        } else {

            $scope.selectedTaskStatus = taskStatus;
        }
    }

    $scope.getStatus = ["All", "Assigned", "Accepted", "Completed"];

    $scope.searchTask = function () {

        $scope.showSearchTaskDiv = !$scope.showSearchTaskDiv;
    }

    $scope.onclickOfTask = function (task) {

        console.log(task);

        $scope.selectedTask = task;

        valueService.setTask(task);
        $rootScope.completedTask=false;
        
        $scope.notFutureDate = valueService.checkIfFutureDayTask(task);
        valueService.setIfFutureDateTask($scope.notFutureDate);
        switch (task.Task_Status) {

            case 'Field Job Completed':
                //$rootScope.showDebrief = true;
                $scope.showStartWork = false;
                $scope.showDebriefBtn = true;
                //$rootScope.showTaskDetail = true;
                $rootScope.showAccept = false;
                $rootScope.completedTask=true;
                break;

            case 'Completed':
                //$rootScope.showDebrief = true;
                $scope.showStartWork = false;
                $scope.showDebriefBtn = true;
                //$rootScope.showTaskDetail = true;
                $rootScope.completedTask=true;
                $rootScope.showAccept = false;
                break;

            case 'Assigned':
                $scope.showStartWork = true;
                $rootScope.showAccept = true;
                $scope.showDebriefBtn = false;
                //$rootScope.showDebrief = false;
                // $rootScope.showTaskDetail = true;
                break;

            case 'Accepted':
                $scope.showStartWork = true;
                $scope.showDebriefBtn = true;
                $rootScope.showAccept = false;
                //$rootScope.showDebrief = true;
                //$rootScope.showTaskDetail = true;
                break;

            /*case 'Rejected':
            $scope.showStartWork = false;
            $scope.showDebrief = false;
            break;*/
            default:
                break;
        }
    }

    

    $scope.calendarView = function () {
        $state.go('myTask');
        $rootScope.selectedItem=1;

    }

    $scope.startWork = function () {

        $state.go('taskOverFlow');
    }

    $rootScope.showTaskOrDebrief = function (id) {

        $rootScope.selectedItem = id;

        $rootScope.selectedTask = $scope.selectedTask;

        if (id == 3) {

            $rootScope.showTaskDetail = true;
            $rootScope.selectedCategory = 'Field Job Overview';

        } else {

            $rootScope.showDebrief = true;
            $rootScope.selectedCategory = 'Field Job#' + $rootScope.selectedTask.Task_Number;
            $state.go('debrief');
            if ($scope.selectedTask.Task_Status =='Assigned') {
                var formData = {
                "Taskstatus": [{
                    "taskId": $rootScope.selectedTask.Task_Number,
                    "taskStatus": "Accepted"
                }]
            };

            var header ={
                'Content-Type': 'application/json',
                'Authorization': 'Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==',
                'oracle-mobile-backend-id': 'a0f02e4c-cc58-4aa7-bba9-78e57a000b59'
            };

            cloudService.acceptTask(formData,header,function (response) {

                console.log(response);
            });
            }

        }
    }
});
