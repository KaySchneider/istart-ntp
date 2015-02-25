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
    var appTypes = ['hosted_app','packaged_app', 'legacy_packaged_app'];
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

    var getActiveAppList = function() {
      var defer = $q.defer();
        chrome.management.getAll(function(apps) {
            var appList=[];
            for(var item in apps) {
                var app = apps[item];
                if(appTypes.indexOf(app.type) > -1) {
                    appList.push(app);
                }
            }
            appList.sort(function(a,b) {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
            var tmp=[];
            for(var item in appList) {
                tmp.append([appList[item]]);
            }
            defer.resolve(tmp);
        });
        return defer.promise;
    };

    /**
     * returns the current apps list!
     */
    return {
        apps: function() {
            return getAppsList();
        },
        active: function() {
            return getActiveAppList();
        }
    }
}]);

