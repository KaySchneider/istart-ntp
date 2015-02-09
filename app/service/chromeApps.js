'use strict';
/**
*  Chrome Apps auslesen
*  mit aktueller matrix abgleichen ob die App schon darin enthalten ist
*  wenn nicht dann der aktuellen Matrix an das Ende hinzufügen
 * Bevor dies Realisiert werden kann muss das message passing perfektioniert werden
 * wie wir die Messages von der Background Page in die Frontend Page bekommen.
 * So können wir auch die Ladezeiten beschleunigen!!
**/
var app  = angular.module('istart');
app.factory('chromeApp', ['$q',function ($q) {
    var getAppsList = function() {
        /**
         * receive all the apps
         */
        var defer = $q.defer();
        chrome.management.getAll(function(apps) {
            apps.sort(function(a,b) {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
            defer.resolve(apps);
        });
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

