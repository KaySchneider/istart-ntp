'use strict';

var app = angular.module('istart');
app.controller('desktopCtrl', ['$scope','matrix', '$window', '$location' , function($scope, matrix, $window, $location) {
    $scope.items  = [];//add an empty array as default items during laod process!! Only for print the matrix the first time
    console.log('start app desktop');
    $scope.ma = matrix;
    $scope.maTemp = [];
    $scope.hiddenMatrix = $scope.items;
    $scope.$watch('items', function() {
        $scope.hiddenMatrix = $scope.items;
        /**
         * TODO: implement it here!
         * store the new matrix to chrome local storage
         */
    });

    $scope.go = function(path) {
        $location.path(path);
    };
    /**
     * resort the matrix
     */
    angular.element($window).on('resort', function () {
        $scope.maTemp = [];
        $('.itemholders').each(function(index, elementDom) {
            //console.log('sort items' + index);
            $('md-card', elementDom).each(function(innerIndex, items) {
                var innerOuterIndexOld = items.id.replace('item_','').split('_');
            //    console.log(innerOuterIndexOld);
                if(!$scope.maTemp[parseInt(index)]) {
                    $scope.maTemp[parseInt(index)] = [];
                }
                $scope.maTemp[parseInt(index)][parseInt(innerIndex)] = $scope.hiddenMatrix[parseInt(innerOuterIndexOld[0])][parseInt(innerOuterIndexOld[1])];
              //  console.log($scope.maTemp);
            })
        }).promise().done(function() {

            $scope.items= $scope.hiddenMatrix;
            $scope.$apply(function( ){
                $scope.items;
            });
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
            console.log("update");

            var logEntry = tmpList.map(function(i){
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        },
        stop: function(e, ui) {
            console.log("stop");

            // this callback has the changed model
          /*  var logEntry = tmpList.map(function(i){
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);*/
        }
    };

    $scope.ma.getLocalData().then(function(data) {
        if(!data[0][0][0].uuid) {
            console.debug('NO UUID -  CREATE ONE AND REFRESH THE LIST');
            $scope.ma.portMatrixUUID(data);
        }
        console.log("data", data);
        if(data == false) {
            console.log('inside first run setting up the default tiles');
            $scope.ma.saveFirstRun();
        } else {
            $scope.items = data;
            console.debug('before');
            console.debug($scope.$$phase);
            console.debug(data);
            addDnD();
            if(!$scope.$$phase) {
                //$digest or $apply
                console.debug('appl');
                $scope.$apply();
            }
          //  $scope.$apply();
        }
    });
}]);


function addDnD() {
    $('.pagerTest').sortable({
        connectWith: '.pagerTest'
    });
    var that = this;
    $('.pagerTest').bind('dragstart', function() {
        //dragstart
        console.log('dragstart');
        // return true;
    });
    $('.pagerTest').bind('dragend', function() {

        //$('.pagerTest').children().each(function() {
        //  this.classList.remove('draginuse');
        //});
        //return true;
    });
    $('.pagerTest').sortable().bind('sortupdate', function(ev, ui, master) {
       console.log("sortupdate");
        /**
         * TODO: implement here the sort update matrix from dom update!
         */
        var event = new Event('resort');
        console.log($('ul'));
        window.dispatchEvent(event);
    });
    $('.metrohelper').sortable({
        connectWith: '.pagerTest'
    });
}