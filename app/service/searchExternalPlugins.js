'use strict';
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
app.factory('searchExternalPlugins', ['$q','chromeApp',function ($q,chromeApp) {

    var istartWidgetApp = function () {
        this.foundedSystemWidgets = [];//push in all the founded system widgets to extend the system directly!

        // this.systemWidgetsIds = [RECENTLY_CLOSED_EXTENSION];//all system resources ids will be stored in this array so nobody can manipulate the widgets

        this.foundedExternWidgets = [];//all widgets wich are found from third party developer will be stored in this array

        this.liveid = 'ppkcokmmeemnehglkonflojecmaacdhe';

        this.liveidThird = 'mgmiemnjjchgkmgbeljfocdjjnpjnmcg';
        this.pokeindicator = '-poke';
        this.pokebackindicator  = '-pokeback';
        this.allApps=[];
        this.appUniqueIdIndex = [];//all extensions with the hash as id are stored here in this array

    };

    /**
     * init the system, add events so that other extension can poke me back :D
     */
    istartWidgetApp.prototype.init = function () {
        var defer = $q.defer();
        var that = this;
        chromeApp.apps().then(function(apps) {
            that.allApps= apps;
            that.sendPokes()
                .then(function(data) {
                    //add the founded widget to the list avaiable widgets!
                    that.foundedExternWidgets.push(data);
                });
        });
        return defer.promise;
    };



    /**
     * start sending pokes to every extension/app in the browser!
     * hui.... thats a great thing
     */
    istartWidgetApp.prototype.sendPokes = function () {
        var defer=$q.defer();
        var extensions = this.allApps; //receive all extension from the core
        for(var item in extensions) {
            this.appUniqueIdIndex[extensions[item].id] = extensions[item];
            chrome.runtime.sendMessage(
                extensions[item].id,this.liveid + this.pokeindicator,
                function(data) {
                    if(typeof data !== "undefined") {
                        if(data.widget===true && data.config) {
                            defer.resolve(data);
                        }
                    }
                }
            );
            //  chrome.extension.sendMessage(extensions[item].id,this.liveidThird + this.pokeindicator
            //     );

        }
        return defer.promise;

        /**
         * Workaround for the new version, there is only one widget for the system and this can be poked directly
         *
         */

    };

        var istartWidgetAppObj = new istartWidgetApp();



    /**
     * returns the current apps list!
     */
    return {
        plugins: istartWidgetAppObj
    }
}]);


