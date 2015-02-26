'use strict';
var app = angular.module('istartMetroDirective');
app.directive('basicRssFeed', function() {
    return {
        restrict: 'E',
        templateUrl: '../html/templates/rssTile.html',
        controller: ['$scope','rssService','$timeout', function($scope, rssService, $timeout){
            var feedUrl='http://www.reddit.com/.rss';
            $scope.loadMe= function() {
                rssService.parseFeed(feedUrl).then(function(res){
                    try {
                        if(res.data.responseData) {
                            $scope.feeds=res.data.responseData.feed.entries;
                        }
                    } catch(e) {
                        console.error(e);
                    }
                });
            };
            $timeout($scope.loadMe, 1000);
        }]
    }
});

