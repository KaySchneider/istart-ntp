'use strict';
var app = angular.module('istartMetroDirective');

app.directive('istartOptionsMenu', function() {
    return {
        restrict: 'E',
        templateUrl: '../html/views/optionsMenuItem.html',
        controller: ['$scope', '$window','i18n', function($scope, $window, i18n) {
            $scope.translate = function(msg) {
                return i18n.chrome.getMessage(msg);
            };

            $scope.addNewTile = function() {
                //open here an dialog to open an new modal where the user
                //can configure the new tile
            };

            $scope.addNewSearchTile = function() {
                //opens a gallery where the user can choose from different live tiles
            };

            $scope.menuEntrys = [
                {
                    label: $scope.translate('addNewTile'),
                    action: $scope.addNewTile
                },
                {
                    label: $scope.translate('addNewSearchTile'),
                    action: $scope.addNewSearchTile,
                    attribute: 'add-new-tile'

                }
            ];
        }],
        link: function(scope, element, attrs) {

        }
    }
});