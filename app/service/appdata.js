'use strict';
/**
 * var manifest = chrome.runtime.getManifest();
 console.log(manifest.name);
 console.log(manifest.version);
 */
var app  = angular.module('istart');
app.factory('appdata', ['$q',function ($q) {
    var manifest = chrome.runtime.getManifest();

    /**
     * returns the current apps list!
     */
    return {
       manifest:manifest
    }
}]);


