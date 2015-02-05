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
app.factory('internalUrlLoader', ['$window',function ($window) {

    var loadDownloadPage = function() {
        chrome.tabs.create({
            url:'chrome://downloads'
        });
    };

    var loadBookmarks = function() {
        chrome.tabs.create({
            url:'chrome://bookmarks'
        });
    };

    var loadExtensionPage = function() {
        /**
         * TODO: read the config and check if the user want to load this page
         * into a new tab or inside the current tab
         */
        chrome.tabs.create({
            url:'chrome://extensions'
        });
    };
    /**
     * returns the current apps list!
     */
    return {
        'extensions':loadExtensionPage,
        'downloads':loadDownloadPage,
        'bookmarks': loadBookmarks
    };
}]);



//internatUrlLoader
