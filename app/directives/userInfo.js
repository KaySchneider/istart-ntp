'use strict';
(function() {
    var app = angular.module('istartMetroDirective');
    app.directive('userInfo', function() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl:'../html/templates/userInfo.html',
            controller:['$scope','istartApi', '$rootScope', '$mdToast', 'matrix',
            function($scope, istartApi , $rootScope, $mdToast, matrix) {
                $scope.loggedIn=false;
                $scope.usernamae="";

                $scope.getRemoteTiles = function() {
                    istartApi.getRemoteTiles()
                        .then(function(data) {

                        });
                };

                $scope.insertTiles = function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('load the data')
                            .position('top left right')

                    );
                    matrix.getLocalData()
                        .then(function(items){
                            console.log(items);
                            $mdToast.show(
                                $mdToast.simple()
                                    .content('start upload data to the server :)')
                                    .position('top left right')

                            );
                            istartApi.insertTiles(items);
                        })

                };

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
                var removeBackendSyny = $rootScope.$on();

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


