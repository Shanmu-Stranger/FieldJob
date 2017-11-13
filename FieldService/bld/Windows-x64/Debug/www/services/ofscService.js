(function () {

    'use strict';

    app.factory('ofscService', ofscService);

    ofscService.$inject = ['$http', '$rootScope', '$window', '$location', 'constantService'];

    function ofscService($http, $rootScope, $window, $location, constantService) {

        var url = conf.apiUrl;

        var service = {};

        service.activate_resource = activate_resource;
        service.start_activity = start_activity;
        service.complete_activity = complete_activity;

        return service;

        function activate_resource(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'OFSCActions/activate_resource?resourceId=' + data.resourceId + '&date=' + data.date,
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": "9baa9146-6abd-4375-a454-827de596f83a"
                }

            }).success(function (response) {

                if (response != undefined) {

                    console.log('Activate Resource Response', JSON.stringify(response));
                }

                callback(response);

            }).error(function (error) {

                console.log('Activate Resource Error', JSON.stringify(error));

                callback(error);
            });
        }

        function start_activity(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'OFSCActions/start_activity',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getOfscBackId()
                },
                data: data

            }).success(function (response) {

                console.log('start_activity Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('start_activity Error', JSON.stringify(error));

                callback(error);
            });
        }

        function complete_activity(data, callback) {

            return $http({

                method: 'POST',
                url: url + 'OFSCActions/complete_activity',
                headers: {
                    "Content-Type": constantService.getContentType(),
                    "Authorization": constantService.getAuthor(),
                    "oracle-mobile-backend-id": constantService.getOfscBackId()
                },
                data: data

            }).success(function (response) {

                console.log('complete_activity Response', JSON.stringify(response));

                callback(response);

            }).error(function (error) {

                console.log('complete_activity Error', JSON.stringify(error));

                callback(error);
            });
        }
    }
})();
