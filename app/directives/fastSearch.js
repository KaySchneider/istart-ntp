/**
 * Created by ikay on 12.01.15.
 */
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');

app.directive('fastSearch', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/search.html',
        controller: ['$scope','matrix', function($scope, matrix) {
            $scope.searchArray = []; //an array wich we search for the data. This should be an flat array
            $scope.buildSearchIndex = function(rawMatrix) {
                console.log(rawMatrix);
                /**
                 * we need only the names and domains from the matrix!
                 * create new elements this are simple icons! to search for
                 */
            };
            matrix.getLocalData()
                .then(function(data) {
                    if(data == false) {
                        return;
                        /**
                         * TODO: implement an watcher for the loca Data
                         */
                    }
                    $scope.buildSearchIndex(data);
                });
        }],
        link: function(scope, element, attrs) {
          console.log(element, 'top Search');
        }

    }
});

