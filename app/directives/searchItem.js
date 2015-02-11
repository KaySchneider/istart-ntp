'use strict';
/**
 * Created by ikay on 12.01.15.
 */
var app = angular.module('istartMetroDirective');
app.directive('searchWidget', function() {
    return {
        restrict: 'A',
        controller: ['$scope', 'loadpage', 'analytics',function($scope, loadpage, analytics) {
            $scope.startSearch = function() {
                $scope.checkConfigLoadPage(angular.element($scope.element[0]).val(),$scope.element);
            };
            $scope.replacement =  '{{search}}';
            $scope.addReplace = '{{tag}}';
            $scope.checkConfigLoadPage = function(searchQuery, element) {
                var domain = $scope.config.domain;
                var currentTld = $scope.config.tld[0];
                var currentTag = '';
                if($scope.config.defaultld) {
                    currentTld = $scope.config.defaultld;
                }
                if($scope.config.tag) {
                    try {
                        currentTag = $scope.config.tag[currentTld];
                    } catch(e) {

                    }
                }
                console.log($scope.tileInfo);
                var paramSearch = $scope.config.url.replace($scope.replacement, searchQuery).replace($scope.addReplace, currentTag);

                var openMe =domain + '.' + currentTld + paramSearch;

                if(!loadpage.checkUrl(openMe)) {
                    openMe = 'https://' + openMe;
                }

                loadpage.loadPage(openMe).then(function(data) {
                    /**
                     * clear the search form input field
                     */
                    element.val('');
                });
            };
            $scope.$on('$destroy', function(){
                $scope.element.off('keydown');
            });
        }],
        link: function(scope, element, attrs) {
            scope.element = element;
            console.log(element.parent().parent().parent().parent().parent().parent());
            element.parent().parent().parent().parent().parent().parent().on('click', function(event) {
              //console.log('CLICK', scope.editMode, event);
                //console.log(event.offsetX <= 51, event.offsetX,  event.offsetY);
                //if(scope.editMode!=true && event.offsetY <= 51) {
                    //console.log('LOAD');
                    //scope.checkConfigLoadPage(element.val(), element);
                //}
            });
            element.on('keydown', function(event, attrs) {
                switch(event.keyCode) {
                    case 13: //enter
                        console.log('start search enter');
                        scope.checkConfigLoadPage(element.val(), element);
                       break;
                    case 27: //esc
                        element.val('');
                        break;
                }
            });
        }
    }
});