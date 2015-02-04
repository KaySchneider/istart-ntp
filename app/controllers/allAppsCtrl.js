'use strict';
var app = angular.module('istart');
app.controller('allAppsCtrl', ['$scope','chromeApp', 'bindKeys', '$rootScope' , '$location', '$anchorScroll',
function($scope,chromeApp,bindKeys, $rootScope, $location, $anchorScroll) {
    $scope.appList = [];
    $scope.bindKeyss = bindKeys;
    $scope.filterApps = '';
    $scope.indexActive = 0;
    $scope.filteredItems=[];
    $scope.filteredItemsCoolDown=1; //wait 100misec. before calling again

    $scope.activeAppClass = 'md-accent';

    bindKeys.addcontroller();

    $scope.checkClick = function(id, status) {
        if(status===true) {
            $scope.enableApp(id);
        } else {
            $scope.disableApp(id);
        }
    };
    $scope.$on('$destroy', function() {
        $scope.bindKeyss.removecontroller();
        $scope.removeListenerRootScope();
    });

    $scope.go = function(path) {
            $location.path( path );
    };


    $scope.removeOldIndex = function() {
        try {
            angular.element('#anchor'+ $scope.filteredItems[$scope.indexActive].id).removeClass($scope.activeAppClass);
        } catch(e) {

        }
    };

    $scope.scrollElementToView = function() {
        try {
        angular.element('#anchor'+ $scope.filteredItems[$scope.indexActive].id).addClass($scope.activeAppClass);
        $location.hash('anchor'+ $scope.filteredItems[$scope.indexActive].id);
        $anchorScroll();
        } catch(e) {

        }
        //angular.element(document.getElementById('anchor'+$scope.filteredItems[$scope.indexActive].appId));
    };

    $scope.$watch('filterApps', function() {
        $scope.removeOldIndex();
        $scope.indexActive=0;
        $scope.scrollElementToView();
    });



    $scope.removeListenerRootScope = $rootScope.$on('states', function(states, newal) {
        if(newal.up === true) {
            if($scope.indexActive>0) {
                $scope.removeOldIndex();
                $scope.indexActive--;
                $scope.scrollElementToView();
            }
        } else if(newal.down === true) {
            if($scope.indexActive < $scope.filteredItems.length-1) {
                $scope.removeOldIndex();
                $scope.indexActive++;
                $scope.scrollElementToView();
            }
        } else if(newal.enter === true) {
            //trigger the current load app instance!
            $rootScope.$broadcast('startApp' + $scope.filteredItems[$scope.indexActive].id , true);
        }
    });

    $scope.enableApp = function(appId) {
        $scope.switchEnabledDisabled(true, appId);
    };

    $scope.disableApp = function(appId) {
        $scope.switchEnabledDisabled(false, appId);
    };

    $scope.switchEnabledDisabled = function(mode, appId) {
        chrome.management.setEnabled(appId, mode, function(test) {
                //            $scope.refreshList();
        });
    };

    $scope.refreshList = function() {
        chromeApp.apps().then(function(appList) {
            var apps=[];
            for(var item in appList) {
                //filter only the apps from there
                if(appList[item].isApp===true) {
                    apps.push(appList[item]);
                }
            }
            $scope.appList = apps;
        });
    };
    $scope.refreshList();
}]);
