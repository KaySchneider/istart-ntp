'use strict';
/**
 * check the current icon and try to switch as an material ico or use
 * an image tag
 */

var app = angular.module('istartMetroDirective');

app.directive('iconSwitcher', ['$compile' ,function($compile) {
    return {
        restrict: 'E',
        replace: true, //DEPRECATED: WARNING! see  https://docs.angularjs.org/api/ng/service/$compile section template doesnt work  well
        // template: '<img src="{{tileInfo.icon}}" ng-if="isImage==true" />',
        link: function(scope, element, attrs) {
            scope.imgTemplate = '<img src="{{tileInfo.icon}}" style="max-width:150px;"/>';

            var testIco =function(ico) {
                if(ico.indexOf('.png') > -1 || ico.indexOf('chrome://') > -1 ) {
                    //is file load it from disk
                    scope.isImage = true;
                    element.html(scope.imgTemplate);
                    $compile(element.contents())(scope);
                } else {
                    //try to use static iconss
                    switch(ico) {

                        case 'youtube':
                            //do fuck
                            scope.isIco=true;
                            scope.iconname = '/img/icons/ic_play_circle_outline_48px.svg';
                            break;
                        default :
                            break;
                    }
                    if(scope.iconname) {
                        scope.icoTemplate = angular.element('<md-icon icon="'+scope.iconname+'" style="width: 80px; height: 80px;"></md-icon>');
                        element.html(scope.icoTemplate);
                        $compile(element.contents())(scope);
                    }
                }
            };
            var configIco=false;
            var icon=null;
            if(scope.tileInfo.config) {
                if(scope.tileInfo.config.icon) {
                    configIco=true;
                    icon = scope.tileInfo.config.icon;
                }
            }
            if(scope.tileInfo.icon) {
                configIco = true;
                icon = scope.tileInfo.icon;
            }
            if(configIco === true) {

                testIco(icon);
            }
        }

    }
}]);
