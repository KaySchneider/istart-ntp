'use strict';
/**
 * edit tiles on right click.
 * set editTile mode to active
 */
var app = angular.module('istartMetroDirective');
app.directive('ngRightEdit', function() {
    return {
        restrict: 'A',
        controller:['$rootScope','$scope',function($rootScope, $scope) {
            $rootScope.editBottom=false;
            /**
             * remove all other active borders on the desktop
             */
            $rootScope.$on('changeEditTile', function(ev,tileId) {
                if(tileId.tileId!=$scope.tileInfo.uuid && $scope.editTile==true) {
                    console.log("change change");
                    $scope.changeEditMode();
                }
            });
            /**
             * change the editBorder and the toggle args
             */
            $scope.changeEditMode=function(){
                var has = $scope.ngEditElement.hasClass('editBorder');
                switch(has) {
                    case true:
                        $scope.editTile=false;
                        $rootScope.editBottom=false;
                        $scope.ngEditElement.removeClass('editBorder');
                        break;
                    case false:
                        $scope.editTile=true;
                        $scope.ngEditElement.addClass('editBorder');
                        $rootScope.$broadcast('changeEditTile', { tileId: $scope.tileInfo.uuid});
                        $rootScope.editBottom=true;
                        $rootScope.editTileInfo=$scope.tileInfo;
                        break;
                }
                try {
                    $scope.$apply();
                } catch(e) {
                    console.error(e);
                }
            };
        }],
        link: function(scope, element, attrs) {
            scope.editTile=false;
            scope.ngEditElement=element;
            element.on('contextmenu', function(ev) {
                ev.preventDefault();
                scope.changeEditMode();
            });


        }

    }
});

