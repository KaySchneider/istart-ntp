'use strict';
(function() {
var app = angular.module('istart');
app.controller('addBookmarkCtrl', [ '$scope','matrix',
    function($scope,matrix ) {
        $scope.ma =matrix;
        $scope.label = "";
        $scope.url="";

        $scope.tileConfig = {
            "w": 2,
            "h": 1,
            "link": "http://maps.google.com",
            "label": "Maps",
            "color": "blue"
        };

        $scope.addTile = function() {
            var config = $scope.tileConfig;
            config.link = $scope.tileConfig.url;
            config.label = $scope.tileConfig.label;
            $scope.items[0][0].push(
                
            );
        };

        chrome.tabs.getSelected(null, function(tab){
            console.log(tab);
            //title,url
            $scope.label = tab.title;
            $scope.url = tab.url;
            $scope.edit=false;
            $scope.$apply();
            $scope.ma.getLocalData().then(function(data) {
                if(data == false) {
                    console.log('inside first run setting up the default tiles and load the first run');
                    $scope.ma.saveFirstRun();
                } else {
                    if(typeof data[0][0][0].uuid == "undefined") {
                        console.debug('NO UUID -  CREATE ONE AND REFRESH THE LIST');
                        console.log(data[0][0][0]);
                        $scope.ma.portMatrixUUID(data);

                    } else {
                        if(isUrlTile($scope.url, data)) {
                            $scope.edit=true;

                        }
                        $scope.items = data;
                    }
                }
            });
        });

    }]);

    function addTileOnFirst(newTile, items) {

    }

    function isUrlTile(url, items) {

        for(var outerIndex in items) {

            if( typeof  items[outerIndex] == "undefined" || items[outerIndex]==null) {
                continue;
            }
            for(var innerIndex in items[outerIndex]) {
                if(typeof  items[outerIndex][innerIndex] == "undefined" || items[outerIndex][innerIndex] == null) {
                    continue;
                }
                if(typeof items[outerIndex][innerIndex] != "undefined") {
                    if(items[outerIndex][innerIndex][0]) {
                        if(!items[outerIndex][innerIndex][0].link)
                            continue;
                        if(items[outerIndex][innerIndex][0].link == url) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
})();

