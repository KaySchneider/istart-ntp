'use strict';
(function() {
    var app = angular.module('istartMetroDirective');
    app.directive('userInfo', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl:'../html/templates/userInfo.html',
            controller:['$scope','istartApi', '$rootScope', '$mdToast',
            function($scope, istartApi , $rootScope, $mdToast) {
                $scope.loggedIn=false;
                $scope.usernamae="";

                $scope.logout = function() {
                    var toast = $mdToast.show(
                        $mdToast.simple()
                            .content('logout in progress ')
                            .position('top left right')

                    );
                    istartApi.logout()
                        .then(function() {
                            $mdToast.hide();
                        });
                };
                $scope.loadUserInfo = function() {
                    istartApi.getMe().then(function(userDta) {
                       console.log(userDta);
                        if(userDta.code == 401) {
                            //not logged in, maybe we make this different to reduce the server last
                            $scope.loggedIn= false;
                            console.log('NOT LOGGED IN');
                        } else {
                            $scope.loggedIn= true;
                            $scope.username=userDta.username;
                            console.log('LOGGED IN');
                            if(!$scope.$digest) {
                                $scope.$apply();
                            }
                        }
                    });
                };

                var removeList = $rootScope.$on('usernamechanged', function(ev,patchObject) {
                    $scope.username=patchObject.username;
                });
                var removeLogoutList = $rootScope.$on('userLogout', function(ev) {
                    $scope.username="";
                    $scope.loggedIn=false;
                });
                var removeLoginList = $rootScope.$on('userLoggedIn', function(ev) {
                    console.log('WHAaAAT');
                    $scope.loadUserInfo();
                });

                $scope.$on('$destroy', function() {
                    removeList();
                    removeLogoutList();
                    removeLoginList();
                });
                $scope.loadUserInfo();
            }]
        }
    });
})();


