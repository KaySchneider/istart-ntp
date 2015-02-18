'use strict';
var app  = angular.module('istart');
app.factory('liveTileApi', ['$q','analytics', 'loadpage','$location', '$rootScope',
        '$compile', 'getUrlThumbnail',
function ($q, analytics, loadpage, $location, $rootScope, $compile, getUrlThumbnail) {
    var item=[];
    var reg = false;
    var close = false;
    var activePluginConfig={};
    var isactive = false;

    var setVarsToClose = function () {
        close = true;
        activePluginConfig = {};
        isactive = false;
    };
    var handleMessages =   function (request, sender, sendResponse) {
        var sr;
        console.log("HANDLE", request);
        /**
         * i think we still has removed this part of the app
         * because this affecteds also iframe wich are from other
         * extensions and this iframes are still not in the "currentTabId!"
         * But we can still transport this id from here to the extension
         */
        //if(request.tabId !== currentTabId ) {
            // return false;
        //}

        //check the mastertabId
        //only internal extensions
        //if (sender.tab.url === "chrome://newtab/") {
        if (request.cmd == "register") {
            console.log('REGISTER');
            /**
             * every time when we open an widget in the fullscreen Mode the widget must call
             * register oder startup event so that we know that everything is fine with the extension
             * this call must be done within 2 seconds after injecting in the dom! If you doesnt call this
             * we kill the iframe without any message!
             * This is a little pain in the ass when developing your first extension but its good for the
             * user when your app is standing still during an error then the user can walk on with istart!
             * WARNING: they wont come up an message to you and the users. It still wont work for the user
             * please check this important thing during development.
             */
            //appMaster.appSuccessStart();
            //clickAbleExtensions.push(request.url);
            //send in the response the mastertabid!
            sendResponse({response: "ok", cmd: "register", url: request.url});
        }
        /**
         * after creating the iframe we wait for the "startup" event
         * that we know that the app runs fine. We wait 2seconds for this
         * event. Otherwise we close the applications iframe and told the user
         * that there was an error during launching the applications
         */
        if(request.cmd == "startup") {
            //appMaster.appSuccessStart();
        }

        if (request.cmd == "close") {
            console.log('CLOSE');
            //close the current iframe! Remove it from the DOM !
            $location.url('/desktop');
            $rootScope.$apply();
            sendResponse({response: "ok", cmd: "close", url: request.url});

            /**
             *
             */

            analytics.track('close','extension', {value:request.launchlink});
        }

        if (request.cmd == 'launchlink') {
            loadpage.loadPage(request.launchlink);
            sendResponse({response: "ok", cmd: "launchlink", url: request.url});
            analytics.track('outclick','extension', {value:request.launchlink});
        }

        if(request.cmd == 'getthumbnail') {
                 sr = sendResponse;
            var thumb = getUrlThumbnail.getThumb(request.url);
            sr({thumbnail: thumb });


        }

        if(request.cmd == "render") {
            try {
            console.log($compile('<span>' + request.template + '</span>')($rootScope), "RENDER");
            } catch(e) {
                console.error(e);
            }
            var html = $compile($compile(request.template)($rootScope))($rootScope);
            sendResponse({content: html[0]});
        }
        // }
    };

    var initReg = function() {
        console.log("INIT");
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log('############################');
                handleMessages(request, sender, sendResponse);
                console.log('############################');
            }
        );
        reg=true;
    };

    if(reg===false) {
        initReg();
    }

    return {
        item:item
    };
}]);

