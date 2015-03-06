'use strict';
/**
 * shows an modal where the user
 * can create an account or direct sign in into
 * the iStart backend!
 */
var app = angular.module('istartMetroDirective');
app.directive('signIn', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: true,
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http', 'analytics',
            function ($scope, $mdDialog, $rootScope, $window, $q, $http, analytics ) {
                var ps = $scope;
                $scope.edit=false;
                $scope.DialogController = ['$scope', '$mdDialog', '$window','analytics','istartApi', '$mdToast', '$rootScope',
                    function($scope, $mdDialog, $window, analytics, istartApi, $mdToast, $rootScope) {
                        analytics.track('showUserLogin', 'system');
                        $scope.user = {
                            username:'',
                            email:'',
                            password:''
                        };
                        $scope.error="";
                        $scope.showError=false;
                        $scope.load=false;
                        /**
                         * TODO: create a global toast service???
                         * For styling error and success toast ??
                         * @param msg
                         */
                        $scope.showErrorToast = function(msg) {
                            $mdToast.show(
                                $mdToast.simple()
                                    .content(msg)
                                    .position('top left right')
                                    .hideDelay(3000)
                            );
                        };

                        $scope.showSuccessToast = function(msg) {
                            $mdToast.show(
                                $mdToast.simple()
                                    .content(msg)
                                    .position('top left right')
                                    .hideDelay(3000)
                            );
                        };

                        $scope.login = function () {
                            istartApi.login($scope.user)
                                .then(function(user) {
                                    $scope.showSuccessToast('Welcome back ' + user.username);
                                    console.log(user);
                                    $mdDialog.hide();
                                }, function(rejected) {
                                    $scope.showErrorToast('error during login! Wrong credentials.... :/ ');
                                });
                        };

                        //create user
                        $scope.register =function() {
                            $scope.load=true;
                            istartApi.register($scope.user)
                                .then(function(res) {
                                    if(res.error) {
                                        $scope.error=res.message || 'Unknown error please restart the app';
                                        $scope.showError=true;
                                        $scope.showErrorToast($scope.error);
                                    } else {
                                        $scope.showSuccessToast('profile is updated :)');
                                    }
                                    $scope.load=false;

                                });

                        };

                        $scope.hide = function() {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                        $scope.answer = function(answer) {
                            console.log('CLOSE');
                            $mdDialog.hide(answer);
                        };

                    }];
                $scope.showAdvanced = function (ev) {
                    $mdDialog.show({
                        controller: $scope.DialogController,
                        templateUrl: '../html/templates/signIn.html',
                        targetEvent: ev
                    })
                        .then(function (tileConfig) {

                        }, function () {
                            //do nothing when cancel
                        });
                }
            }],
        link: function(scope, element, attrs) {
            /**
             * TODO: add edit mode for tiles
             */

            angular.element(element).on('click', function($event) {
                scope.showAdvanced($event);
            });
        }
    }
});
