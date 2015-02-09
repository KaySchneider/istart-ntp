'use strict';

var app = angular.module('istartMetroDirective');
app.directive('mostTimeSpendOn', function() {
    return {
        templateUrl: 'views/mostTimeSpendOn.html',
        restrict: 'E',
        replace: false,
        scope: true,
        link: function (scope, element, attrs) {

        },
        controller: ['$scope' , '$rootScope','matrix', '$http','backgroundMessage','loadpage',
        function ($scope, $rootScope,matrix, $http, backgroundMessage, loadpage) {
            //TODO: imlement here the rootScope config! if we should show this items
            $scope.ma = matrix;
            $scope.msg = backgroundMessage;
            $scope.load=loadpage;
            $scope.loadPage = function(url) {
                $scope.load.loadPage(url)
                    .then(function(item) {
                        console.log(item);
                    });
            };
            $scope.mostRecentPages=[];
            $scope.ma.getPagesMostTimeSpend().then(function(data) {
                if(data!=false) {

                    $scope.mostRecentPages = data.splice(0,4);;
                }
            });
        }]
    }
});
