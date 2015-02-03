'use strict';
/**
 * Created by ikay on 12.01.15.
 */
var app = angular.module('istartMetroDirective');
app.directive('searchWidget', function() {
    return {
        restrict: 'A',
        controller: ['$scope', 'loadpage',function($scope, loadpage) {
            $scope.startSearch = function() {
                $scope.checkConfigLoadPage(angular.element($scope.element[0]).val(),$scope.element);
            };
            $scope.replacement =  '{{search}}';
            $scope.checkConfigLoadPage = function(searchQuery, element) {
                var domain = $scope.config.domain;
                var currentTld = $scope.config.tld[0];
                var paramSearch = $scope.config.url.replace($scope.replacement, searchQuery);
                var openMe =domain + '.' + currentTld + paramSearch;
                if(!loadpage.checkUrl(openMe)) {
                    openMe = 'https://' + openMe;
                }
                loadpage.loadPage(openMe).then(function(data) {
                    /**
                     * clear the search form input field
                     */
                    angular.element(element[0]).val('');
                });
            }
            $scope.$on('$destroy', function(){
                angular.element($scope.element).off('keydown');
            });
        }],
        link: function(scope, element, attrs) {
            scope.element = element;
            angular.element(element[0]).on('keydown', function(event, attrs) {
                switch(event.keyCode) {
                    case 13: //enter
                        console.log('start search enter');
                        scope.checkConfigLoadPage(angular.element(element[0]).val(), element);
                       break;
                    case 27: //esc
                        angular.element(element[0]).val('');
                        break;
                }
            });
        }
    }
});