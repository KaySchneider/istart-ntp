'use strict';
/**
 * app settings factory
 * stores the custom user settings and shares it app wide
 */
var app  = angular.module('istart');
app.factory('appSettings', ['$q',function ($q) {
    /**
     * migrate the old settings from istart 1.x to the
     * istartV2!
     * @type {{loaded: null, settingsDefault: {background: {imageadd: boolean, cssadd: boolean, css: string, image: string}}, config: null, save: save, loadOptions: loadOptions, background: background}}
     */



    //if(localStorage.istartbackground)
    var settings =  {
        loaded:null,
        settingsDefault : {
            background: {
                imageadd:false,
                cssadd:false,
                css: '',
                image:'',
                options:null
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
                console.log(localStorage.istartbackground, 'BACKGROUND SETTINGS', localStorage.istartbackground!="null", localStorage.istartbackground!==null);
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

            if(localStorage.istartbackground !=null || localStorage.istartbackground != "null") {
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


