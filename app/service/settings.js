'use strict';
/**
 * app settings factory
 * stores the custom user settings and shares it app wide
 */
var app  = angular.module('istart');
app.factory('appSettings', ['$q', '$rootScope',function ($q, $rootScope) {
    /**
     * migrate the old settings from istart 1.x to the
     * istartV2!
     * @type {{loaded: null, settingsDefault: {background: {imageadd: boolean, cssadd: boolean, css: string, image: string}}, config: null, save: save, loadOptions: loadOptions, background: background}}
     */

    //if(localStorage.istartbackground)
    var settings =  {
        loaded:null,
        backgroundSizeOptions: ['cover', 'initial'],
        backgroundRepeatOptions: ['no-repeat', 'repeat'],
        settingsDefault : {
            background: {
                imageadd:false,
                cssadd:false,
                css: '',
                image:'',
                options:null,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            },
            mouseWheel: {
                active:true
            },
            globalsearch: {
                active:false
            },
            updateCenter: {
                show:false,
                version:"2.0.1.60"
            },
            header: {
                alternative:false,
                menuIconColor:'rgba(0, 0, 0, 0.87)',
                menuDimension: {
                    w:30,
                    h:30
                }
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
        setBackgroundImage: function(bgImage) {
            settings.config.background.imageadd=true;
            settings.config.background.image=bgImage;
            settings.save();
        },
        setBackgroundSize: function(backgroundSize) {
            settings.config.background.backgroundSize = backgroundSize;
            settings.save();
            $rootScope.$broadcast('changeBackground');
        },
        setBackgroundRepeat: function(backgroundRepeat) {
            settings.config.background.backgroundRepeat = backgroundRepeat;
            settings.save();
            $rootScope.$broadcast('changeBackground');
        },
        setmouseWheelActive: function(activeState) {
            if(typeof settings.config.mouseWheel !== "undefined") {
                settings.config.mouseWheel.active=activeState;
            } else {
                settings.config.mouseWheel = {
                    active: activeState
                };
            }
            settings.save();
            $rootScope.$broadcast('mouseWheelSettingsChanged', {});
        },
        checkSettingsLoaded: function() {
            var defer = $q.defer();
            if(settings.loaded==null) {
                //console.log(localStorage.istartbackground, 'BACKGROUND SETTINGS', localStorage.istartbackground!="null", localStorage.istartbackground!==null);
                if(localStorage.istartbackground!="null") {
                    settings.loadV1BackgroundSettings();
                }
                //nothing loaded load the settings
                settings.loadOptions()
                    .then(function() {
                        defer.resolve(true);
                    })
            } else {
               defer.resolve(true);
            }
            return defer.promise;
        },
        updateCenter: function() {
            var defer = $q.defer();
            this.checkSettingsLoaded().then(
                function() {
                    if(typeof settings.config.updateCenter !== "undefined") {
                        defer.resolve(settings.config.updateCenter);
                    } else {
                        /**
                         * if the settings are not present than this version didnt has the
                         * updated settings object! So we add simply true to this object
                         * and resolve it
                         */
                        defer.resolve(settings.settingsDefault.updateCenter);
                    }
                });
            return defer.promise;
        },
        setUpdateCenter: function(show, versionString) {
            if(typeof settings.config.updateCenter !== "undefined") {
                settings.config.updateCenter.show=show;
                settings.config.updateCenter.version=versionString;
            } else {
                settings.config.updateCenter = {
                    show: show,
                    version: versionString
                };
            }
            settings.save();
            //$rootScope.$broadcast('globalsearchSettingsChanged', {});
        },
        setGlobalSearch: function(activeState) {
            if(typeof settings.config.globalsearch !== "undefined") {
                settings.config.globalsearch.active=activeState;
            } else {
                settings.config.globalsearch = {
                    active: activeState
                };
            }
            settings.save();
            $rootScope.$broadcast('globalsearchSettingsChanged', {});
        },
        globalSearch: function() {
            var defer = $q.defer();
            this.checkSettingsLoaded().then(
                function() {
                    if(typeof settings.config.globalsearch !== "undefined") {
                        defer.resolve(settings.config.globalsearch);
                    } else {
                        /**
                         * if the settings are not present than this version didnt has the
                         * updated settings object! So we add simply true to this object
                         * and resolve it
                         */
                        defer.resolve(settings.settingsDefault.globalsearch);
                    }
                });
            return defer.promise;
        },
        ensureHeaderConfigExists: function() {
            if(typeof settings.config.header == "undefined") {
                settings.config.header = settings.settingsDefault.header;
            }
        },
        setHeaderAlternative: function(alternativeState) {
            settings.ensureHeaderConfigExists();
            settings.config.header.alternative = alternativeState;
            settings.save();
            $rootScope.$broadcast('globalHeaderChanged');
        },
        setMenuIconColor: function(color) {
            settings.ensureHeaderConfigExists();
            settings.config.header.menuIconColor=color;
            settings.save();
            $rootScope.$broadcast('globalHeaderChanged');
        },
        setMenuDimension: function(dimsObject) {
            settings.ensureHeaderConfigExists();
            settings.config.header.menuDimension=dimsObject;
            settings.save();
            $rootScope.$broadcast('globalHeaderChanged');
        },
        setHeader: function(headerConfigObject) {
            settings.config.header = headerConfigObject;
            settings.save();
            $rootScope.$broadcast('globalHeaderChanged'); //we need an relaod, this works with an ng-if!
        },
        header: function() {
          var defer = $q.defer();
            this.checkSettingsLoaded().then(
                function() {
                    if(typeof settings.config.header !== "undefined") {
                        defer.resolve(settings.config.header);
                    } else {
                        /**
                         * if the settings are not present than this version didnt has the
                         * updated settings object! So we add simply true to this object
                         * and resolve it
                         */
                        defer.resolve(settings.settingsDefault.header);
                    }
                });
            return defer.promise;
        },
        mouseWheel: function() {
            var defer = $q.defer();
            this.checkSettingsLoaded().then(
                function() {
                    if(typeof settings.config.mouseWheel !== "undefined") {
                        defer.resolve(settings.config.mouseWheel);
                    } else {
                        /**
                         * if the settings are not present than this version didnt has the
                         * updated settings object! So we add simply true to this object
                         * and resolve it
                         */
                        defer.resolve(settings.settingsDefault.mouseWheel);
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
                //console.log(localStorage.istartbackground, 'BACKGROUND SETTINGS', localStorage.istartbackground!="null", localStorage.istartbackground!==null);
                if(localStorage.istartbackground!="null") {
                    settings.loadV1BackgroundSettings();
                }
                //nothing loaded load the settings
                settings.loadOptions()
                    .then(function() {
                        resolveBackground();
                    })
            } else {
                resolveBackground();
            }


            return deferr.promise;
        },
        loadV1BackgroundSettings: function() {
            /**
             * migrate here the old Settings into the new settingsFormat.
             * clear the old settings directly after setting them into
             * the new format of V2
             */
            var bgsetting;
            var bgoptions;
            console.log(localStorage.istartbackground);
            if(localStorage.istartbackground != "null" && typeof localStorage.istartbackground != "undefined") {
                if(settings.config==null) {
                    settings.config = settings.settingsDefault;
                }
                bgsetting = localStorage.istartbackground;
                /**
                 * check if this is an image or color:
                 */
                if(bgsetting.indexOf('url(')!=-1) {
                    //image !
                    settings.config.background.imageadd=true;
                    settings.config.background.image = bgsetting;//the complete string?
                }  else{
                    //css gradient
                    settings.config.background.imageadd=false;
                    settings.config.background.cssadd=true;
                    settings.config.background.css = bgsetting;
                    settings.save();//store the new things
                }

            }

            //load additional settings
            if(localStorage.istartbgoptions != null) {
                if(settings.config==null) {
                    settings.config = settings.settingsDefault;
                }
                bgoptions = JSON.parse(localStorage.istartbgoptions);
                settings.config.background.options = bgoptions;
                settings.save();//store the new things
            }
            //todo:implement load functions to load the background from options

            //$('#mbg').css('backgroundImage',  this.bgsetting );
            localStorage.istartbackground=null;
            localStorage.istartbgoptions=null;
            /*if(this.bgoptions != null) {
                this.setBgOptionsFromObj();
            }*/
        },
        setBgOptionsFromObj: function () {
            /**
             * TODO:replace this into the backGroundSettings
             * directive
             */
            for(var option in this.bgoptions) {
                var cso = option;
                if(option == 'backgroundattachment') {
                    cso = 'background-attachment';
                }
                $('#mbg').css(cso,  this.bgoptions[option] );
            }
        }
    };

    /**
     * returns the current apps list!
     */
    return {
        settings:settings
    }
}]);


