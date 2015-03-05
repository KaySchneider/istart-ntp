'use strict';
(function() {
    var app = angular.module('istartMetroDirective');
    app.directive('userInfo', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl:'../html/templates/userInfo.html',
            controller:['$scope','istartApi', '$rootScope',
            function($scope, istartApi , $rootScope) {
                $scope.loggedIn=false;
                $scope.usernamae="";
                istartApi.getMe().then(function(userDta) {
                   console.log(userDta);
                    if(userDta.code == 401) {
                        //not logged in, maybe we make this different to reduce the server last
                        $scope.loggedIn= false;
                    } else {
                        $scope.loggedIn= true;
                        $scope.username=userDta.username;
                    }
                });
                var removeList = $rootScope.$on('usernamechanged', function(ev,patchObject) {
                    $scope.username=patchObject.username;
                });
                $scope.$on('$destroy', function() {
                    removeList();
                });
            }]
        }
    });
})();


