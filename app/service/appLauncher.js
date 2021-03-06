'use strict';
//chrome.management.launchApp(string id, function callback)
/**
 *  Chrome Apps auslesen
 *  mit aktueller matrix abgleichen ob die App schon darin enthalten ist
 *  wenn nicht dann der aktuellen Matrix an das Ende hinzufügen
 * Bevor dies Realisiert werden kann muss das message passing perfektioniert werden
 * wie wir die Messages von der Background Page in die Frontend Page bekommen.
 * So können wir auch die Ladezeiten beschleunigen!!
 **/
'use strict';
var app  = angular.module('istart');
app.factory('appLauncher', ['$q','analytics',function ($q, analytics) {
    var launchApp = function(appConfigObject) {
        /**
         * receive all the apps
         * trackMe('chromeapp','launched', {value:this.args[0]});
         */
        analytics.track('launchApp', 'launched', {value:appConfigObject.id});
        var defer = $q.defer();
        chrome.management.launchApp(appConfigObject.id, function(status) {
            defer.resolve(status);
            analytics.track('launchAppOK', 'system');
        });
        return defer.promise;
    };

    /**
     * returns the current apps list!
     */
    return {
        launch: function(appConfig) {
            return launchApp(appConfig);
        }
    }
}]);

