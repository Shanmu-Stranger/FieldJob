(function () {

    'use strict';

    app.service('constantService', constantService);

    constantService.$inject = ['$http', '$rootScope', '$window', '$location', 'localService'];

    function constantService($http, $rootScope, $window, $location, localService) {

        var service = {};

        var userObject = {};

        var resourceId = null;

        var timeZone = null;

        var contactsEmail = [];

        var taskList = [];

        var contactsCCEmail = null;

        var contentType = 'application/json';

        DEV
        var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==";

        var taskBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var chargeBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var shiftBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var fieldBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var materialBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var ofscBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var acceptBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";

        var expenseBackEndId = "1900984d-1b99-4ede-988e-06e0ba319276";


        // //SIT
        //
        // var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFVEVTVEVOVl9NT0JJTEVfQU5PTllNT1VTX0FQUElEOm9ma3U1ZG4xUHZscS5t";
        //
        // var taskBackEndId = "b043c17e-7dcd-41a5-abc6-39fa2f8ab0a6";
        //
        // var chargeBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        //
        // var shiftBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        //
        // var fieldBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        //
        // var materialBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        //
        // var ofscBackEndId = "b043c17e-7dcd-41a5-abc6-39fa2f8ab0a6";
        //
        // var acceptBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";
        //
        // var expenseBackEndId = "e4ecc164-2b7a-49ab-a00c-8ea1209d7886";

        var stagesArray = {};

        var startDate = new Date();

        startDate.setDate(startDate.getDate() - 15);

        var startDateISOFormat = startDate.toISOString();

        var endDate = new Date();

        endDate.setDate(endDate.getDate() + 15);

        var endDateISOFormat = endDate.toISOString();

        service.setResourceId = setResourceId;
        service.getResourceId = getResourceId;

        service.setUser = setUser;
        service.getUser = getUser;

        service.getStartDate = getStartDate;
        service.getEndDate = getEndDate;

        service.setTaskList = setTaskList;
        service.getTaskList = getTaskList;

        service.getContentType = getContentType;
        service.getAuthor = getAuthor;

        service.getTaskBackId = getTaskBackId;
        service.getChargeBackId = getChargeBackId;
        service.getFieldBackId = getFieldBackId;
        service.getShiftBackId = getShiftBackId;
        service.getMaterialBackId = getMaterialBackId;
        service.getOfscBackId = getOfscBackId;
        service.getAcceptBackId = getAcceptBackId;

        service.setUserEmailId = setUserEmailId;
        service.getUserEmailId = getUserEmailId;

        service.setCCEmailID = setCCEmailID;
        service.getCCEmailID = getCCEmailID;

        service.setTimeZone = setTimeZone;
        service.getTimeZone = getTimeZone;

        service.setStagesArray = setStagesArray;
        service.getStagesArray = getStagesArray;

        service.onDeviceReady = onDeviceReady;
        service.getExpenseTypeBackendId = getExpenseTypeBackendId;

        return service;

        function getExpenseTypeBackendId() {
            return expenseBackEndId;
        }

        function setResourceId(id) {
            resourceId = id;
        };

        function getResourceId() {
            return resourceId;
        };

        function setUser(user) {

            userObject = user;

            setTimeZone(userObject.Time_Zone);

            $rootScope.uName = userObject.Name;
        };

        function getUser() {
            return userObject;
        };

        function setTimeZone(zone) {
            timeZone = zone;
        };

        function getTimeZone() {

            return timeZone;
        };

        function setUserEmailId(id) {

            for (var i = 0; i < id.length; i++) {

                contactsEmail.push(id[i].Email);
            }
        };

        function getUserEmailId() {

            return contactsEmail;
        };

        function setCCEmailID(email) {

            contactsCCEmail = email;
        };

        function getCCEmailID() {

            return contactsCCEmail;
        };

        function getStartDate() {

            return startDateISOFormat;
        };

        function getEndDate() {

            return endDateISOFormat;
        };

        function setTaskList(response) {

            taskList = response;
        };

        function getTaskList() {

            return taskList;
        };

        function getAuthor() {

            return authKey;
        };

        function getTaskBackId() {

            return taskBackEndId;
        };

        function getChargeBackId() {

            return chargeBackEndId;
        };

        function getFieldBackId() {

            return fieldBackEndId;
        };

        function getShiftBackId() {

            return shiftBackEndId;
        };

        function getMaterialBackId() {

            return materialBackEndId;
        };

        function getOfscBackId() {

            return ofscBackEndId;
        };

        function getAcceptBackId() {

            return acceptBackEndId;
        };

        function getContentType() {

            return contentType;
        };

        function setStagesArray(stages) {
            stagesArray = stages;
        };

        function getStagesArray() {
            return stagesArray;
        };


        function onDeviceReady() {

            localService.deleteTaskList();
            localService.deleteInternalList();
            localService.deleteInstallBase();
            localService.deleteContact();
            localService.deleteNote();

            localService.deleteOverTime();
            localService.deleteShiftCode();

            localService.deleteChargeType();
            localService.deleteChargeMethod();
            localService.deleteFieldJobName();

            localService.deleteWorkType();
            localService.deleteItem();
            localService.deleteCurrency();

            localService.deleteExpenseType();
            localService.deleteNoteType();

            localService.deleteTimeList();
            localService.deleteExpenseList();
            localService.deleteNotesList();
            localService.deleteMaterialList();
            localService.deleteAttachmentList();
            localService.deleteEngineerList();

            localService.deleteUser();

        };
    }
})();
