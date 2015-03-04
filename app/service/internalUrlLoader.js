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
app.factory('internalUrlLoader', ['$window','analytics',function ($window, analytics) {

    var loadDownloadPage = function() {
        chrome.tabs.create({
            url:'chrome://downloads'
        });
        analytics.track('internalUrlLoader', 'state', {value:'downloads'});
    };

    var loadBookmarks = function() {
        chrome.tabs.create({
            url:'chrome://bookmarks'
        });
        analytics.track('internalUrlLoader', 'state', {value:'bookmarks'});
    };

    var originalNewTab = function() {
        /**
         * loads the new tab page
         */
        chrome.tabs.create({
            url: 'chrome-search://local-ntp/local-ntp.html'
        });
        analytics.track('internalUrlLoader', 'state', {value:'newtabchrome'});
    };

    var loadExtensionPage = function() {
        /**
         * TODO: read the config and check if the user want to load this page
         * into a new tab or inside the current tab
         */
        chrome.tabs.create({
            url:'chrome://extensions'
        });
        analytics.track('internalUrlLoader', 'state', {value:'extensions'});
    };
    /**
     * returns the current apps list!
     */
    return {
        'extensions':loadExtensionPage,
        'downloads':loadDownloadPage,
        'bookmarks': loadBookmarks,
        'ntp':originalNewTab
    };
}]);



//internatUrlLoader
