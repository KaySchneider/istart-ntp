'use strict';
/**
 * Created by ikay on 09.02.15.
 *
 */
'use strict';
var app = angular.module('istartMetroDirective');
app.directive('appSettings', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: true, //use own scope
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http',
            function ($scope, $mdDialog, $rootScope, $window, $q, $http, fileSystem) {
                var ps = $scope;
                $scope.edit=false;

                /**
                 * request the file system to store an image from DataURL
                 * @type {*[]}
                 */


                $scope.DialogController = ['$scope', '$mdDialog', '$window','fileSystem',
                    function($scope, $mdDialog, $window, fileSystem) {
                        $scope.bgImageForm = null;
                        $scope.fs =  fileSystem;
                        $scope.uploadfile =function() {
                            console.log($scope.bgImageForm);
                            console.log('UPLOAD FILE');
                            var fr = new FileReader();
                            fr.onloadend  = (function (sd) {
                                console.log(sd);
                                $scope.fs.writeFile(sd,$scope.bgImageForm[0]);
                            });
                            //that.rawFile = filename[0];
                            fr.readAsDataURL($scope.bgImageForm[0]);
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
                        templateUrl: '../html/views/appSettings.html',
                        targetEvent: ev
                    })
                        .then(function () {
                            //the app settings... maybe we should use an global service at this point

                        }, function () {
                            //do nothing when cancel
                        });
                }
            }],
        link: function(scope, element, attrs) {
            /**
             * TODO: add edit mode for tiles
             */
            if('mode' in attrs.$attr) {
                scope.edit = true;

            }
            angular.element(element).on('click', function($event) {
                scope.showAdvanced($event);
            });
        }
    }
});
