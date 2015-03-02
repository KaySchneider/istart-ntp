'use strict';
var app  = angular.module('istart');
app.factory('loadpage', ['$q','analytics',function ($q, analytics) {
    var loadPage = function (url) {
        console.log(url);
        /**
         * TODO: use here the config object to check if
         * the new pages should load inside a new page
         * TODO: implement here the tracking logic! to track the actions inside the app
         */
        var defer = $q.defer();
        analytics.track('loadPage', 'link', {value:url});
        chrome.tabs.create({
            url: url,
            active: true
        }, function(result) {
            defer.resolve(result);
        });
        return defer.promise;
    };

    /**
     * check if the url to load is valid and complete url
     */
    var checkUrlCompleted = function(url) {
        var test = new RegExp('^(http|https)://', 'i');
        return test.test(url);
    };

    return {
        loadPage: function(url) {
            return loadPage(url);
        },
            checkUrl: function(url) {
            return checkUrlCompleted(url);
        }
    };
}]);
