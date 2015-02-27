'use strict';
/**
 * Created by ikay on 12.01.15.
 */
var app = angular.module('istartMetroDirective');
app.directive('globalSearchDirective', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '../html/templates/globalSearch.html',
        controller: ['$scope','globalSearchService', 'appLauncher', 'loadpage', '$compile',
        function( $scope, globalSearchService, appLauncher, loadpage, $compile ) {
            $scope.searchActive=false;
            $scope.gsearchQuery="";
            $scope.resultArea=angular.element('#globalSearchResults');
            $scope.launchApp = function(appId) {
                appLauncher
                    .launch({id:appId})
                    .then(function(res) {
                        //console.log(res, 'app launcher');
                    });
            };

            $scope.loadPage = function(url) {
                console.log("LOAD");
                loadpage.loadPage(url)
                    .then(function(result) {
                        //console.log(result);
                    });
            };

            var getLaunchLink = function(url, label) {
                var link = document.createElement('li');
                link.setAttribute('ng-click', "loadPage('"+url+"')");
                var label = document.createTextNode(label);
                link.appendChild(label);
                return link;
            };

            var getLaunchApp = function(appId, label) {
                var link = document.createElement('li');
                link.setAttribute('ng-click', "launchApp('"+appId+"')");
                var label = document.createTextNode(label);
                link.appendChild(label);
                return link;
            };

            var printResult =function( resultList ) {
                var documentFragment = new DocumentFragment();
                var ul = document.createElement('ul');
                for(var index in resultList) {
                    var item = resultList[index];
                    if(item.dateAdded) {
                        //is bookmark
                        var el = getLaunchLink(item.url, item.title);
                        ul.appendChild(el);
                    } else if(item.w && item.link) {
                        //is iStart link tile
                        var el = getLaunchLink(item.link, item.label || item.name);
                        ul.appendChild(el);
                    } else if(item.isApp === true) {
                        //is app
                        var el = getLaunchApp(item.id, item.name);
                        ul.appendChild(el);
                    }
                }

                $scope.resultArea.html("");
                $scope.resultArea.html($compile(documentFragment.appendChild(ul))($scope));

            };

            $scope.$watch('gsearchQuery', function() {
                if($scope.gsearchQuery.length == 0) {
                    $scope.searchActive=false;
                    return;
                }
                $scope.searchActive=true;
                globalSearchService.query($scope.gsearchQuery)
                    .then(function(resultList) {
                        printResult(resultList);
                    });
            });

        }],
        link: function(scope, element, attrs) {

        }
    }
});

