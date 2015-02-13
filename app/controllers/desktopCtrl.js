'use strict';

var app = angular.module('istart');
app.controller('desktopCtrl',
           ['$scope','matrix','$window','$location','internalUrlLoader','$mdSidenav', '$rootScope',
    function($scope, matrix, $window, $location, internalUrlLoader, $mdSidenav, $rootScope) {
    $window.appControllerStart = Date.now();
    $scope.items  = [];//add an empty array as default items during laod process!! Only for print the matrix the first time
    console.log('start app desktop');
    $scope.ma = matrix;
    $scope.maTemp = [];
    $scope.hiddenMatrix = $scope.items;
    $scope.editMode= false;
    $scope.mostRecentPages=false;
    $scope.$watch('items', function() {
        $scope.hiddenMatrix = $scope.items;
        /**
         * TODO: implement it here!
         * store the new matrix to chrome local storage
         */
    });
    $scope.loadBookmarks = function() {
        internalUrlLoader.bookmarks();
    };
    $scope.loadDownloads = function() {
        internalUrlLoader.downloads();
    };
    $scope.loadExtensions = function() {
        //service wich loads interal pages service/interalUrlLoader
        internalUrlLoader.extensions();
    };
    $scope.go = function(path) {
        $location.path(path);
    };

    $rootScope.$on('removeTile', function(ev,tileInfo) {
        var found=false;
        for(var outerIndex in $scope.items) {
            for(var inner in $scope.items[outerIndex]) {
                if($scope.items[outerIndex][inner][0].uuid == tileInfo.uuid) {
                    $scope.items[outerIndex].splice(inner,1);
                    $scope.ma.saveMatrix($scope.items);
                    found=true;
                    break;
                }
            }
            if(found==true) {
                break;
            }
        }
    });

    /**
     * resort the matrix
     */
    angular.element($window).on('resort', function () {
        $scope.maTemp = [];
        $('.itemholders').each(function(index, elementDom) {
            $('li', elementDom).each(function(innerIndex, items) {
                var innerOuterIndexOld = items.id.replace('item_','').split('_');
                if(!$scope.maTemp[parseInt(index)]) {
                    $scope.maTemp[parseInt(index)] = [];
                }
                $scope.maTemp[parseInt(index)][parseInt(innerIndex)] = $scope.hiddenMatrix[parseInt(innerOuterIndexOld[0])][parseInt(innerOuterIndexOld[1])];
            })
        }).promise().done(function() {
            //console.log( $scope.maTemp );
            //$scope.items= $scope.maTemp;
            if(!$scope.$$phase) {
                //$digest or $apply
                $scope.$apply();
            }
            console.log('SAVE SAVE', $scope.maTemp);
            $scope.ma.saveMatrix($scope.maTemp);
        });
    });


    $scope.sortableOptions = {
        activate: function() {
            console.log("activate");
        },
        beforeStop: function() {
            console.log("beforeStop");
        },
        change: function() {
            console.log("change");
        },
        create: function() {
            console.log("create");
        },
        deactivate: function() {
            console.log("deactivate");
        },
        out: function() {
            console.log("out");
        },
        over: function() {
            console.log("over");
        },
        receive: function() {
            console.log("receive");
        },
        remove: function() {
            console.log("remove");
        },
        sort: function() {
            console.log("sort");
        },
        start: function() {
            console.log("start");
        },
        update: function(e, ui) {

            var logEntry = tmpList.map(function(i){
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        },
        stop: function(e, ui) {

        }
    };

    $scope.toggleMenu = function() {
        $mdSidenav('right').toggle()
            .then(function(){
            });
    };

    $scope.closeMenu = function() {
        $mdSidenav('right').close()
            .then(function(){
            });
    };

    $rootScope.$on('addNewTile', function(event, tileConfig) {
        $scope.items[0].unshift([tileConfig]);
        $scope.ma.saveMatrix($scope.items);
        addDnD();
    });
    $scope.lGrid=[];
    $scope.LargeGridMaker = function() {
        $scope.lGrid = [];
        for(var item in $scope.items) {
            for(var conf in $scope.items[item]) {
                $scope.lGrid.push($scope.items[item][conf]);
            }
        }
        addDnD();
   };

   $scope.$on('readyTiles', function() {
       console.log('last ready');
        $scope.recalcSizes();
   });

   $scope.startW = 0;
   $scope.recalcSizes = function() {
       console.log('ELEMENT RECALC', angular.element('.pagerTest'));
     angular.element('.pagerTest').each(function(item){
         if(item==0){
             $scope.startW=0;
         }
         var width = $scope.calcNewWidth($scope.items[item].length);
         var el  = $('#p'+item);
         el.css({'width':  width + 'px'});
         el.css({'left': $scope.startW +'px'});
         $scope.startW += width+300;

     });
   };

    $scope.calcNewWidth = function (countChilds) {
            if(countChilds < 4) {
                countChilds = 4;
            }
            return  Math.ceil(countChilds/4)*250  ;
    };

    $scope.ma.getLocalData().then(function(data) {
        console.debug('DATA', data);
        if(data == false) {
            console.log('inside first run setting up the default tiles and load the first run');
            $scope.ma.saveFirstRun();
        } else {
            if(typeof data[0][0][0].uuid == "undefined") {
                console.debug('NO UUID -  CREATE ONE AND REFRESH THE LIST');
                console.log(data[0][0][0]);
                $scope.ma.portMatrixUUID(data);

            } else {

                $scope.items = data;

                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    });
    $window.appControllerEndFile = Date.now();
    console.debug('TIME TO THIS DESKTOPCONTROLLER:' , ($window.appControllerEndFile - $window.startTime)/1000);
}]);

function addDnD() {
    $('.pagerTest').sortable({
        connectWith: '.pagerTest'
    });
    var that = this;
    $('.pagerTest').bind('dragstart', function() {
        return true;
    });
    $('.pagerTest').bind('dragend', function() {
        return true;
    });
    $('.pagerTest').sortable().bind('sortupdate', function(ev, ui, master) {
        /**
         * TODO: implement here the sort update matrix from dom update!
         */
        var event = new Event('resort');
        window.dispatchEvent(event);
    });
    $('.metrohelper').sortable({
        connectWith: '.pagerTest'
    });
};