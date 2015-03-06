'use strict';
/**
 * edit the user Profile, at the starting point only the username can be changed!!
 *
 */
var app = angular.module('istartMetroDirective');
app.directive('editUserProfile', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: true,
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http', 'analytics',
            function ($scope, $mdDialog, $rootScope, $window, $q, $http, analytics ) {
                var ps = $scope;
                $scope.edit=false;
                $scope.DialogController = ['$scope', '$mdDialog', '$window','analytics','istartApi', '$mdToast',
                    function($scope, $mdDialog, $window, analytics, istartApi, $mdToast) {
                        analytics.track('showEditUserProfile', 'system');
                        $scope.user = {
                            username:''
                        };
                        $scope.error="";
                        $scope.showError=false;
                        $scope.load=true;
                        istartApi.getMe().then(function(userdata) {
                            $scope.load=false;
                            $scope.user.username = userdata.username;
                        });

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

                        //patchUser
                        $scope.close =function() {
                            $scope.load=true;
                            istartApi.patchUser($scope.user)
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
                        templateUrl: '../html/templates/editUserProfile.html',
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