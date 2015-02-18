'use strict';
var app  = angular.module('istart');
app.factory('getUrlThumbnail', ['backgroundMessage', '$q',
function (backgroundMessage, $q) {
    var msg = backgroundMessage;
    var loadtest = function(url) {
        var dataUrl=false;
        msg.message.connect(
            msg.message.getMessageSkeleton('getThumbnail', {hostname:url})
        ).then(function(data) {
               dataUrl=data.thumbnail;
               return dataUrl;
            });
    };

    var returnItem = function(item) {
        return item;
    };
    /**
     * returns the current apps list!
     */
    return {
        getThumb:loadtest
    }
}]);
