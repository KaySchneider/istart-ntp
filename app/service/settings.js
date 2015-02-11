'use strict';
/**
 * app settings factory
 * stores the custom user settings and shares it app wide
 */
var app  = angular.module('istart');
app.factory('appSettings', ['$q',function ($q) {
    var settings = function() {
        var config=null;
        this.save = function() {
            chrome.storage.local.set('options', JSON.stringify(config));
        };
        this.loadOptions = function() {
            chrome.storage.local.get('options', function(settings) {
                var settingsArr=null;
                try {
                    settingsArr = JSON.parse(settings.settings);
                } catch(e) {

                }
            });
        };

        this.background = function() {

        };
        /**
         * receive all the apps
         */
        var defer = $q.defer();

        return defer.promise;
    };

    /**
     * returns the current apps list!
     */
    return {
        apps: function() {
            return getAppsList();
        }
    }
}]);


