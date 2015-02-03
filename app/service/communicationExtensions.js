'use strict';
/**
 * this file is needed for the
 * communication with the other extensions
 * outside from this
 */
'use strict';
var app  = angular.module('istart');
app.factory('backgroundMessage', ['$q', '$window',function ($q, $window) {
    /**
     * receive here the message
     * @param url
     */
    var sendMessage = function () {
        this.listener = [];
        this.listenerIds = [];
        this.port = null;

        this.getMessageSkeleton = function (backendMethodToCall, additionalData) {
          var msg = {
              call: backendMethodToCall
          };
          if(additionalData) {
              angular.extend(msg, msg, additionalData);
          }
          return msg;
        };

        this.generateUniqueId = function() {
            var guid = $window.guid();
            if(this.listenerIds.indexOf( guid, 0) !==  -1 ) {
                return this.generateUniqueId();
            } else {
                return guid;
            }
        };

        /**
         * adds the listeners to the object
         * returns the defer to return it to the caller
         * @returns {*}
         */
        this.addListener = function() {
            var defer = $q.defer();

            var uid = this.generateUniqueId();
            this.listenerIds.push(uid);
            this.listener[uid] = {id: uid, defer:defer};

            return {defer: defer.promise, uid: uid};
        };

        this.resolveListener = function(uid, message) {
            try {
                this.listener[uid].defer.resolve(message);
            } catch(e) {
                console.log(e, 'Error inside resolveListener');
            }
        };

        this.openPort = function() {
            var that = this;
            var port = chrome.runtime.connect({name: "knockknock"});
            port.onMessage.addListener(function(msg) {
                console.log(msg);
                if(msg.uid) {
                    that.resolveListener(msg.uid, msg);
                }
            });
            this.port = port;
        };

        /**
         * here we send a message
         * we should create here an message uniqe id
         *
         */
        this.connect = function(message) {
            var deferId = this.addListener();
            this.port.postMessage({message: message, uid:deferId.uid});
            return deferId.defer;
        };
    };
    if(!senderObject) {
        /**
         * bad implementation of an singleton in js!
         * @type {sendMessage}
         */
        var senderObject = new sendMessage();
        senderObject.openPort();
        console.log(senderObject);
    }


    return {
        message: senderObject
    };
}]);

/**
 * TODO: move this part to global window functions file
 */
window.guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();


