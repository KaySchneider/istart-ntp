'use strict';

var app = angular.module('istartMetroDirective');
app.directive('loadSmartDirective', function() {
    return {
        restrict: 'E',
        scope: {
            tile:'=tile'
        },
        controller: ['$scope','$compile', function($scope, $compile) {
            $scope.html = $compile('<'+$scope.tile.directive+' tile=\'tileInfo\'></'+$scope.tile.directive+'>')($scope);
            $scope.add = function() {
              $scope.el.html($scope.html);
            };
        }],
        link: function(scope, element, attrs) {
            console.log(element, 'ELEMENT');
            scope.el = element;
            scope.add();
        }

    }
});
app.directive('facebookInfo', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'views/facebookInfos.html',
        controller: ['$scope','$http', '$timeout', function($scope, $http, $timeout) {


            $scope.loadDataFB = function() {
                var url = 'https://www.facebook.com/desktop_notifications/counts.php?latest=0&latest_read=0';
                $http.get(url)
                    .success(function(data) {
                        try {
                            if(typeof data == 'object') {
                                $scope.messagesCount = data.inbox.unread;
                                $scope.infoCount = data.notifications.num_unread;
                                $timeout($scope.loadDataFB, 60000);
                            }
                        } catch(e) {
                            //user is not logged in
                            //$timeout($scope.loadDataFB, 900000);
                        }
                    })
                    .error(function(e) {
                        console.log(e);
                    });
            };
            if(navigator.onLine===true) {
                $timeout($scope.loadDataFB, 1000);
            }
        }]


    }
});
