'use strict';
(function() {
var app = angular.module('istart');
app.controller('desktopCtrl',
           ['$scope','matrix','$window','$location','internalUrlLoader','$mdSidenav', '$rootScope',
               'searchExternalPlugins','$compile','chromeApp', 'appSettings',
    function($scope, matrix, $window, $location, internalUrlLoader, $mdSidenav,
             $rootScope, searchExternalPlugins, $compile, chromeApp, appSettings) {
        console.log('inside the desktop controller, never reached this stage inside the karma/jasmine tests');

    $window.appControllerStart = Date.now();
    $scope.items  = [];//add an empty array as default items during laod process!! Only for print the matrix the first time
    console.log('start app desktop');
    $scope.ma = matrix;
    $scope.maTemp = [];
    $scope.hiddenMatrix = $scope.items;
    $scope.editMode= false;
    $scope.paintStarted=false;
    $scope.apps=null;
    $scope.mostRecentPages=false;
    $scope.alternativeHeader=false;
        /**chromeApp.active().then(function(allApps) {
            //build tile from app?
            var apper = [allApps];


        });**/
    $scope.$watch('items', function() {
        $scope.hiddenMatrix = $scope.items;
        /**
         * TODO: implement it here!
         * store the new matrix to chrome local storage
         */
    });

    $rootScope.$on('globalHeaderChanged', function() {
        $scope.loadHeaderSettings();
    });

    $rootScope.$on('removeTile', function(ev,tileInfo) {
        var found=false;
        for(var outerIndex in $scope.items) {
            for(var inner in $scope.items[outerIndex]) {
                if($scope.items[outerIndex][inner] == null) {
                    continue;
                }
                if($scope.items[outerIndex][inner][0].uuid == tileInfo.uuid) {
                    $scope.items[outerIndex].splice(inner,1);
                    $scope.ma.saveMatrix($scope.items);
                    //repaint the items
                    clearItems();
                    showItems($scope.items);
                    found=true;
                    break;
                }
            }
            if(found==true) {
                break;
            }
        }
    });

    var clearItems = function() {
        angular.element('#interpolateed').html('');
    };

    var showItems = function(items) {
       var dom="";
       for(var outerIndex in items) {
           dom += ' <ul class="pagerTest itemholders"' +
                ' istart-calc-screen-size' +
                ' id="p'+outerIndex+'">';

           for(var innerIndex in items[outerIndex]) {
                   if(items[outerIndex][innerIndex] !== null) {
                       dom += '<metro-item  ' +
                              ' my-repeat-directive'+
                              ' outer-index="'+outerIndex+'" ' +
                              ' inner-index="'+innerIndex+'" ' +
                              ' tile-info="items['+outerIndex+']['+innerIndex+'][0]"' +
                              ' edit-mode="editMode"' +
                              ' ></metro-item>';
                   }
               }
           dom += "</ul>";
       }
        /**
         * add new item
         */
        var html = $compile(dom)($scope);
        angular.element('#interpolateed').html(html);
        $window.items = $scope.items;
        resizeScreen();
        window.setTimeout(addDnD, 400);

    };

    /**
     * resort the matrix
     */
    angular.element($window).on('resort', function () {
        $scope.maTemp = [];
        $('.itemholders').each(function(index, elementDom) {
            $('li', elementDom).each(function(innerIndex, items) {
                if(!items.id) {
                    return;
                }
                var innerOuterIndexOld = items.id.replace('item_','').split('_');
                if(!$scope.maTemp[parseInt(index)]) {
                    $scope.maTemp[parseInt(index)] = [];
                }
                /**
                 *
                 */
                $scope.maTemp[parseInt(index)][parseInt(innerIndex)] = $scope.hiddenMatrix[parseInt(innerOuterIndexOld[0])][parseInt(innerOuterIndexOld[1])];
            })
        }).promise().done(function() {
            var data = $scope.maTemp;
            var tmpData = [];
            var outerRun=0;
            var innerRun=0;
            for(var item in data) {
                var insert = false;
                for(var subItem in data[item]) {
                    if(data[item][subItem]!=null) {
                        if (!tmpData[outerRun]) {
                            tmpData[outerRun] = [];
                        }
                        if (!tmpData[outerRun][innerRun]) {
                            tmpData[outerRun][innerRun] = data[item][subItem];
                        }
                        insert=true;
                        innerRun++;
                    }
                }
                if(insert===true)
                    outerRun++;
            }
            $scope.maTemp = tmpData;
            if(!$scope.$$phase) {
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






    $rootScope.$on('addNewTile', function(event, tileConfig) {
        $scope.items[0].unshift([tileConfig]);
        $scope.ma.saveMatrix($scope.items);
        showItems($scope.items);
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
    //    $scope.recalcSizes();
   });

   $scope.startW = 0;
   $scope.recalcSizes = function() {
     angular.element('.pagerTest').each(function(item){
         if(item==0){
             $scope.startW=0;

         }
         /**
          * maybe some users has null inside some items!
          */
        try {
            if($scope.items[item] ) {
                var width = $scope.calcNewWidth($scope.items[item].length);
                var el = $('#p' + item);
                el.css({'width': width + 'px'});
                el.css({'left': $scope.startW + 'px'});
                $scope.startW += width + 300;
            }
        } catch(e) {

        }

     });
   };


    $scope.calcNewWidth = function (countChilds) {
            if(countChilds < 4) {
                countChilds = 4;

            }
            /**
             * calculate here the new height
             */
            return  Math.ceil(countChilds/4)*250  ;
    };

    $scope.ma.getLocalData().then(function(data) {
        if(data == false) {
            console.log('inside first run setting up the default tiles and load the first run');
            $scope.ma.saveFirstRun();
        } else {
            if(typeof data[0][0][0].uuid == "undefined") {
                console.debug('NO UUID -  CREATE ONE AND REFRESH THE LIST');
                console.log(data[0][0]);
                $scope.ma.portMatrixUUID(data);

            } else {

                $scope.items = data;
                $scope.hiddenMatrix = $scope.items;
                searchExternalPlugins.plugins.init().then(function() {
                    console.log('ready');
                });
                $scope.paintStarted = true;
                if( $scope.apps !== null ) {
                    $scope.items.push($scope.apps);
                }
                showItems($scope.items);
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    });
      $scope.loadHeaderSettings =function() {
          appSettings.settings.header().
              then(function(headerconfig) {
                  $scope.alternativeHeader = headerconfig.alternative;
              });
      };
     $scope.loadHeaderSettings();
    $window.appControllerEndFile = Date.now();
    console.debug('TIME TO THIS DESKTOPCONTROLLER:' , ($window.appControllerEndFile - $window.startTime)/1000);
}]);

function addDnD() {
    console.log('ADD');
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
}
    window.onresize =function() {
        resizeScreen();
    };
function resizeScreen() {
    var items= window.items;
    var startW;
    var allW;
    var container = $('#interpolateed');
        var ceil = Math.ceil( ($(window.top).height()-140)/140);
        var height = ceil * 130;
        var wrap = document.getElementById('wrapp');
        $('.pagerTest').each(function(item){
            if(item==0){
                startW=0;
                allW=0;
            }
            /**
             * all used vars to calculate the new width of the
             * ul container containing the tiles
             * we take care of the different heights and widths while calculating
             * the rows and cells
             * @type {number}
             */
            var oneWidth = 260.3333335;
            var staticItemsOnRow=ceil;
            var currentLine=0;
            var currentRowHeight=0;
            var countCells=0;
            var allContainerWidth=0;

            var maxItems = items[item].length;
            for(var info in items[item]) {

                if(!items[item][info]) {
                    continue;
                }

               if(items[item][info][0] == null){
                   continue;
               }
              if(currentLine==2) {
                 currentLine = 0;
              }
                console.log(currentRowHeight,countCells, currentLine, info, staticItemsOnRow);

              if(currentRowHeight>=staticItemsOnRow) {
                  /**
                   * Fehler, Überhang wird nicht in die nächste Spalte mit Übernommen
                   * @type {number}
                   */
                  if(currentRowHeight>staticItemsOnRow) {
                      var take = currentRowHeight-staticItemsOnRow;
                      currentRowHeight=take;
                      console.log("ÜBERTRAG: " , take);
                  } else {
                      currentRowHeight=0;
                  }
                  countCells++;
              }

              if(items[item][info][0].w==1) {
                   currentLine++;
                  if(currentLine==2) {
                      currentRowHeight++;//the item is full
                  }
                  if(info == maxItems-1) {
                      if(currentRowHeight!=0) {
                          countCells++;
                      }
                  }
                   continue;
              }

               if(items[item][info][0].w == 2) {
                   //line is full
                   if(currentLine==1) {
                       currentRowHeight++;
                   }
                   currentLine=2;
                   currentRowHeight++;
                   //check if the height is also two
                   if(items[item][info][0].h == 2) {
                       currentRowHeight++;
                   }
                   if(info == maxItems-1) {
                       if(currentRowHeight!=0) {
                            countCells++;
                       }
                   }
                   continue;
               }

            }
            console.log(countCells, 'CWLLS');
            /**
             * calculate the correct width
             */
            allContainerWidth = (oneWidth * countCells)+40;
            /**
             * maybe some users has null inside some items!
             */
            try {
                if(items[item] ) {
                    var width = allContainerWidth;
                    var el = $('#p' + item);
                    el.css({'width': width + 'px'});
                    el.css({'left':  startW + 'px'});
                    el.css({height: height + 'px'});
                    //el.css({border: "1px solid red"});
                    startW += width + 300;
                }
            } catch(e) {

            }
            //'border-color': 'red', 'border-width': '10px', 'border-style': 'solid'
            angular.element('#wrap').css({'width': startW + 'px'});
        });

}

function calcNewWidth( countChilds) {
        if(countChilds < 4) {
            countChilds = 4;
        }
        return  Math.ceil(countChilds/4)*250  ;
}

})();