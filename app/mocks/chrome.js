//console.log(chrome, window.chrome);
var use = false;
if(use===false) {
    var chrome =  {

    };

    chrome.i18n = {};
    chrome.i18n.getMessage = function(message) {
        return message;
    };
    chrome.extension={};
    chrome.extension.getUrl = function(items) {
        return items;
    };


    chrome.management = {};

    chrome.management.launchApp = function(appId, callback) {
        callback(true);
    };

    chrome.management.getAll = function(callback) {
        return false;//return a list with well defined chrome applications! for expect testing
        //but we can override this in before test case method
    };

    chrome.runtime = {};
    chrome.runtime.connect={};
    chrome.runtime.fakelisteners=[];
    chrome.runtime.callFakeListeners = function(msg) {
        for(var index in chrome.runtime.connect.fakelisteners) {
            chrome.runtime.fakelisteners[index](msg);
        }
    };
    chrome.runtime.connect=function(object) {
        //mock a port object
        return {
            onMessage: {
                addListener:function(listener){
                   chrome.runtime.fakelisteners.push(listener);
                }
            },
            postMessage: function(){
                /**
                 * simulate here the backend script....
                 */
                switch(arguments[0].message.call) {
                    case 'saveMatrix':
                        console.log(arguments[0].message.matrix);
                        chrome.storage.local.set({'istart':JSON.stringify(arguments[0].message.matrix)});
                        chrome.runtime.callFakeListeners({uid:arguments[0].uid});
                        break;
                }
            }
        };
    };
    chrome.runtime.onMessage = {};

    chrome.runtime.onMessage.addListener = function() {
        return true;
    };


    /**
     * mock tabs
     */
    chrome.tabs = {};
    chrome.tabs.create = function( object ) {
        console.debug(object, 'open new tab mocking');
    };


    /**
     * mock storage
     */
    chrome.storage = {};
    chrome.storage.local = {
        data:[]
    };
    chrome.storage.local.get = function(key, callback) {
        var cbObject={};
        try {
            var keys = Object.keys(chrome.storage.local.data);
            //console.log(keys, "KEYS");
            //console.log('before type error')
            if(keys.indexOf(key) != -1) {
                cbObject[key] = chrome.storage.local.data[key];
                callback(cbObject);
            } else {
                callback(null);
            }
        } catch(c) {

            //console.error(c);
        } finally {
            console.log("AFTER THE ERROR HAPPENS");
        }
    };

    chrome.storage.clearAll = function() {
        chrome.storage.local.data=[];
    };

    /***
     * ensure that the data is stingifyied!
     * @param objectStored
     * @param callback
     */
    chrome.storage.local.set = function(objectStored, callback) {
        //receive list of keys in the objectStored items
        var objectKeys = Object.keys(objectStored);
        for(var key in objectKeys) {
            chrome.storage.local.data[objectKeys[key]] = objectStored[objectKeys[key]];
        }
        if(typeof callback == "function")
            callback(true);
    };

}