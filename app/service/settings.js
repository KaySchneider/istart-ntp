'use strict';
/**
 * app settings factory
 * stores the custom user settings and shares it app wide
 */
var app  = angular.module('istart');
app.factory('appSettings', ['$q',function ($q) {
    var settings =  {
        loaded:null,
        settingsDefault : {
            background: {
                imageadd:false,
                cssadd:false,
                css: '',
                image:''
            }
        },
        config:null,
        save : function() {
            try  {
            chrome.storage.local.set({'options': JSON.stringify(settings.config)}, function( ){

            });
            } catch(e) {
                console.error(e);
            }
        },
        loadOptions : function() {
            var defer = $q.defer();
            chrome.storage.local.get('options', function(settingsRaw) {
                var settingsArr=null;
                if(typeof settingsRaw.options == "undefined") {
                    //first run save init config
                    settings.config=settings.settingsDefault;
                    settings.loaded=true;
                    settings.save();
                    defer.resolve();
                    return;
                }
                try {
                    settingsArr = JSON.parse(settingsRaw.options);
                    console.log(settingsArr);
                    settings.config=settingsArr;
                    settings.loaded=true;
                    defer.resolve();
                } catch(e) {

                }
            });
            return defer.promise;
        },
        background : function() {
            var deferr = $q.defer();

            var resolveBackground = function() {
                if(typeof  settings.config.background !== "undefined") {
                    deferr.resolve(settings.config.background);
                } else {
                    deferr.reject(settings.config.background);
                }
            };

            if(settings.loaded==null) {

                //nothing loaded load the settings
                settings.loadOptions()
                    .then(function() {
                        resolveBackground();
                    })
            } else {
                resolveBackground();
            }


            return deferr.promise;
        }
    };

    /**
     * returns the current apps list!
     */
    return {
        settings:settings
    }
}]);


