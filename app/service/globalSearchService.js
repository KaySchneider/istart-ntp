'use strict';
var app  = angular.module('istart');
app.factory('globalSearchService',['chromeApp','matrix', '$q',function(chromeApp, matrix, $q, $timeout) {
    /**
     * this methods must add the data from different sources
     * to one search model!
     * This data is at best maybe in Memory?
     */
   var apps=chromeApp;

    var istartTiles = [];//Flat array with iStart tiles from the users configuration
    var bookMarksQuery=[];//result from the last bookmarksquery!
    var appsList=[];//result from chrome apps get all
    var warmUpDone=false;
    /**
     * PROBLEMSTELLUNG: wir haben hier Daten aus verschiedenen Quellen. Alle Quellen
     * sind einzeln für sich. Mergen können wir AppsList mit iStartTiles.
     * BookMarksQuery würde erst einmal hinten anstehen Und in der Ergebnissliste ebenfalls
     * hinten angezeigt.
     * Darüber hinaus haben wir in der Version 1 alles in den DOM geschrieben und haben daraus unsere
     * Query gestartet und die Elemenete nur auf hidden oder show gesetzt. Das hatte den Vorteil wir
     * mussten die Elemente nur einmalig in den DOM werfen und dort abspeichern
     */
    var warmUp = function() {
        apps.apps()
            .then(function(apps) {
                appsList = apps;
            });
        matrix.getLocalData()
            .then(function(tilesArray) {
                var tmp=[];
               for(var outer in tilesArray) {

                   if(tilesArray[outer]!== null) {
                       for(var inner in tilesArray[outer]) {
                           if(tilesArray[outer][inner] == null) {
                               continue;
                           }
                           try {

                             tmp.push(tilesArray[outer][inner][0]);

                           } catch(e) {
                                console.log(e);
                           }
                       }
                   }
               }
              istartTiles=tmp;
            });
        warmUpDone=true;
    };
    var getAll=function() {
       //get the hole set of stuff inside the extension

    };
    var searchApps=function(query) {
        var defer = $q.defer();
        var dosearch=function(query) {
            var fnd=[];
            var patt = new RegExp(query, 'i');
            for(var index in appsList) {
                var holePattern = appsList[index].name + " " + appsList[index].description;
                if(patt.test(holePattern) ) {
                    fnd.push(appsList[index]);
                }
            }
            defer.resolve(fnd);
        };
        dosearch(query);
        return defer.promise;
    };
    var searchTiles=function(query) {
        var defer = $q.defer();
        var dosearch=function(query) {
            var fnd=[];
            var patt = new RegExp(query, 'i');
            for(var index in istartTiles) {
                var holePattern = istartTiles[index].label + " " + istartTiles[index].name + " " +istartTiles[index].link;
                if(patt.test(holePattern) ) {
                    fnd.push(istartTiles[index]);
                }
            }
            defer.resolve(fnd);
        };
        dosearch(query);
        return defer.promise;
    };
    var searchBookmarks=function(query) {
        var defer = $q.defer();
        if(chrome.bookmarks) {
            chrome.bookmarks.search(query, function(bmt){
                var regTestJS = new RegExp('javascript','i');
                var rs =[];
                for(var index in bmt) {
                    var item =bmt[index];
                    if(!item.url)
                        continue;
                    if(regTestJS.test(item.url)) {
                      continue;
                   } else {
                     rs.push(item);
                   }
                }
                defer.resolve(rs);
            });
        }
        return defer.promise;
    };
    var query=function(queryString) {
        var defer = $q.defer();
        //perform a query on different datasources and sets, the results will be
        //send back with promise in one flat array
        //wait until all resources are ready with the querys
        var searchAppPromise=searchApps(queryString);
        var searchTilesPromise=searchTiles(queryString);
        var searchBookmarksPromise=searchBookmarks(queryString);
        $q.all([searchAppPromise, searchTilesPromise, searchBookmarksPromise])
            .then(function(dataSetAll) {
                /**
                 * iterate over dataSet! and dump the shit
                 */
                defer.resolve(dataSetAll[0].concat(dataSetAll[1]).concat(dataSetAll[2]));
            });
        return defer.promise;
    };
    warmUp();//start loading the data!
    return {
        'getall': getAll,
        'query' :  query
    };
}]);
