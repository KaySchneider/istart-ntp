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
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http', 'permissionCheck',
            function ($scope, $mdDialog, $rootScope, $window, $q, $http, fileSystem, permissionCheck) {
                var ps = $scope;
                $scope.edit=false;


                /**
                 * request the file system to store an image from DataURL
                 * @type {*[]}
                 */
                $scope.DialogController = ['$scope', '$mdDialog', '$window','fileSystem','appSettings','$http',
                    '$rootScope', 'permissionCheck',
                    function($scope, $mdDialog, $window, fileSystem, appSettings, $http, $rootScope, permissionCheck) {
                        $scope.bgImageForm = "";
                        $scope.fs =  fileSystem;
                        $scope.appSettings= appSettings;
                        $scope.backgroundOptions;
                        /**
                         * add small gallery for background images!
                         * Maybe we didnt habe enough place inside our form
                         * @type {Array}
                         */
                        $scope.bgImages=[];
                        $http.get('../app/defaultBgImages.json').success(function(data) {
                            console.log(data);
                        });

                        $scope.mouseWheelActive=false;
                        $scope.$watch('mouseWheelActive', function() {
                           appSettings.settings.setmouseWheelActive($scope.mouseWheelActive);
                        });

                        $scope.globalSearchActive=false;
                        $scope.$watch('globalSearchActive', function() {
                            permissionCheck.checkPerm('bookmarks')
                                .then(function(has) {
                                    if(has === false) {
                                        //we need this permissions!
                                        chrome.permissions.request({
                                            permissions: ['bookmarks']
                                        }, function(granted) {
                                            // The callback argument will be true if the user granted the permissions.
                                            if (granted) {
                                                console.log("OKAY LETS DO IT!");
                                            } else {
                                                console.log("WARGH");
                                            }
                                    });
                                 }
                                });
                            appSettings.settings.setGlobalSearch($scope.globalSearchActive);

                        });

                        appSettings.settings.background().then(function(settings) {
                            $scope.backgroundOptions=settings;
                            if(!settings.backgroundSize) {
                                $scope.backgroundOptions.backgroundSize="";
                            }
                            if(!settings.backgroundRepeat) {
                                $scope.backgroundOptions.backgroundRepeat="";
                            }
                        });

                        /**
                         * TODO: add here the background Options and sizing options with an
                         * watcher and setter inside the settings service model!"! START TOMORROW
                         */
                        $scope.$watch('backgroundOptions.backgroundSize', function() {
                            console.log('changed');
                            appSettings.settings.setBackgroundSize($scope.backgroundOptions.backgroundSize);
                        });

                        $scope.$watch('backgroundOptions.backgroundRepeat', function() {
                            console.log('changed');
                            appSettings.settings.setBackgroundRepeat($scope.backgroundOptions.backgroundRepeat);
                        });

                        appSettings.settings.globalSearch().then(
                            function(settings) {
                                $scope.globalSearchActive=settings.active;
                            });

                        appSettings.settings.mouseWheel().then(
                            function(settings) {
                                $scope.mouseWheelActive = settings.active;
                            });

                        $scope.fileNameChanged = function(data) {
                            console.log(data);
                        };

                        $scope.backgroundSizeOptions = appSettings.settings.backgroundSizeOptions;
                        $scope.backgroundRepeatOptions = appSettings.settings.backgroundRepeatOptions;




                        $scope.uploadfile =function() {
                            console.log('UPLOAD FILE');
                            var fr = new FileReader();
                            fr.onloadend  = (function (sd) {
                                console.log(sd);
                                $scope.fs.writeFile(sd,$scope.bgImageForm[0])
                                    .then(function(fileNameUrl) {
                                        console.log('THE FILENAME URL IS: ' + fileNameUrl);
                                        $scope.appSettings.settings.setBackgroundImage('url(' + fileNameUrl + ')');
                                        $rootScope.$broadcast('changeBackground');
                                        $mdDialog.hide();
                                    });//gets the entrys urls
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
                        $scope.close =function( ) {
                            $mdDialog.hide();
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

