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

        var contactsCCEmail = null;

        var contentType = 'application/json';

        var authKey = "Basic QTQ3MjE0NF9FTUVSU09OTU9CSUxFQ0xPVURfTU9CSUxFX0FOT05ZTU9VU19BUFBJRDpZLm81amxkaHVtYzF2ZQ==";

        var taskBackEndId = "cc9a9b83-02ff-4be1-8b70-bccb3ac6c592";

        var chargeBackEndId = "7172e7e3-d292-4bb3-be0b-1e475c6f66a7";

        var shiftBackEndId = "4b2f8c2d-f6d1-4957-8add-b0d471cdaea4";

        var fieldBackEndId = "b861a04a-de53-4c76-9430-3f485c21c5f4";

        var materialBackEndId = "0686fd58-8150-4264-ac09-348f79436fb9";

        var ofscBackEndId = "557f06cf-1dda-42f1-a8a8-afc52f823904";

        var acceptBackEndId = "a0f02e4c-cc58-4aa7-bba9-78e57a000b59";

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

        return service;

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
    }
})();
