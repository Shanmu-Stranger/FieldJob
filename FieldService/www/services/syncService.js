(function () {

    'use strict';

    app.factory('syncService', syncService);

    syncService.$inject = ['$http', '$rootScope', '$window', '$location', 'constantService'];

    function syncService($http, $rootScope, $window, $location, constantService) {

        var url = conf.apiUrl;

        var service = {};

        service.getOffline_Contacts = getOffline_Contacts;
        service.getOffline_Notes = getOffline_Notes;
        service.getOffline_Field = getOffline_Field;
        service.getOffline_Overtimeshiftcode = getOffline_Overtimeshiftcode;
        service.getOffline_Project = getOffline_Project;
        service.getOffline_ShiftCode = getOffline_ShiftCode;
        service.getOffline_TaskName = getOffline_TaskName;

        return service;


        function getOffline_Contacts(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'Offline_Contacts/offline_contacts',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('Offline_Contacts Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('Offline_Contacts Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getOffline_Notes(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'Offline_Notes/offline_notes',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('Offline_Notes Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('Offline_Notes Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getOffline_Field(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'Offline_FileID/offline_fileId',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('Offline_FileID Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('Offline_FileID Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getOffline_Overtimeshiftcode(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'offline_overtimeshiftcode/overtimeshiftcode_offline',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('OverTime ShiftCode Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('OverTime ShiftCode Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getOffline_Project(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'offline_project/project_offline',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('Offline_Project Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('Offline_Project Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getOffline_ShiftCode(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'offline_shiftcode/shiftcode_offline',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('offline_shiftcode Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('offline_shiftcode Error', JSON.stringify(error));

                callback(error);
            });
        }

        function getOffline_TaskName(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'offline_taskName/taskName_offline',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getChargeBackId()
                },
                data: data

            }).success(function (response) {

                console.log('offline_taskName Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('offline_taskName Error', JSON.stringify(error));

                callback(error);
            });
        }
    }
})();
