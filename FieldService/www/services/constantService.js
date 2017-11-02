(function () {

    'use strict';

    app.service('constantService', constantService);

    constantService.$inject = ['$http', '$rootScope', '$window', '$location', 'localService'];

    function constantService($http, $rootScope, $window, $location, localService) {

        var service = {};

        var resourceId = null;

        var contentType = 'application/json';

        var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==";

        var taskBackEndId = "cc9a9b83-02ff-4be1-8b70-bccb3ac6c592";

        var chargeBackEndId = "7172e7e3-d292-4bb3-be0b-1e475c6f66a7";

        var shiftBackEndId = "4b2f8c2d-f6d1-4957-8add-b0d471cdaea4";

        var fieldBackEndId = "b861a04a-de53-4c76-9430-3f485c21c5f4";

        var materialBackEndId = "0686fd58-8150-4264-ac09-348f79436fb9";

        var ofscBackEndId = "557f06cf-1dda-42f1-a8a8-afc52f823904";

        var startDate = new Date();

        var emailId=null;
        var timeZone=null;

        startDate.setMonth(startDate.getMonth() - 1);

        var startDateISOFormat=startDate.toISOString();

        var endDate = new Date();

        endDate.setDate(endDate.getDate() + 7);

        var endDateISOFormat=endDate.toISOString();

        var contactsEmail = [];
        var contactsCCEmail = null;

        service.setResourceId = setResourceId;
        service.getResourceId = getResourceId;

        service.getStartDate = getStartDate;
        service.getEndDate = getEndDate;

        service.getAuthor = getAuthor;
        service.getTaskBackId = getTaskBackId;
        service.getChargeBackId = getChargeBackId;
        service.getFieldBackId = getFieldBackId;
        service.getShiftBackId = getShiftBackId;
        service.getMaterialBackId = getMaterialBackId;
        service.setUserEmailId=setUserEmailId;
        service.getUserEmailId=getUserEmailId;
        service.getContentType = getContentType;
        service.setCCEmailID = setCCEmailID;
        service.getCCEmailID = getCCEmailID;
        service.getOfscBackId = getOfscBackId;
        service.setTimeZone=setTimeZone;
        service.getTimeZone=getTimeZone;
        return service;

        function setResourceId(id) {
            emailId = id;
        };

        function getResourceId() {

            return emailId;
        };
        
        function setTimeZone(zone) {
            timeZone = zone;
        };

        function getTimeZone() {

            return timeZone;
        };

        function setUserEmailId(id) {
           // resourceId = id;
           for (var i = 0; i < id.length; i++) {
                contactsEmail.push(id[i].Email);
           }
           console.log(contactsEmail);

        };

        function getUserEmailId() {

            return contactsEmail;
        };

        function setCCEmailID(email) {
           
            contactsCCEmail = email;
            console.log(contactsCCEmail);
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

        function getContentType() {

            return contentType;
        };
    }
})();
