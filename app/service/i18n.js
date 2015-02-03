'use strict';
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
app.factory('i18n', ['$window',function ($window) {

    /**
     * returns the current apps list!
     */
    return {
        chrome: chrome.i18n
    }
}]);


