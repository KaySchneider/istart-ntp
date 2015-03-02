/**
 * Created by ikay on 12.01.15.
 */
var app = angular.module('istartMetroDirective');
app.directive('appIconSetSrc', function() {
    return {
        restrict: 'A',
        controller: ['$scope', function($scope) {
            /**
             * check the size from the images
             */
            $scope.checkSize = function(images, needleSizeInt, minSize) {
                if(images.length ==0) {
                    return false;
                }
                var min=false;
                if(typeof (minSize) !== "undefined") {
                    min=true;
                }
                for(var obj in images) {
                    if(images[obj].size === needleSizeInt && min===false) {
                        return images[obj].url;
                    } else if(min===true &&   images[obj].size >= minSize ) {
                        return images[obj].url;
                    }

                }
                return "";
            };
        }],
        link: function(scope, element, attrs) {
            var appIcons = [];
            try {
                appIcons = JSON.parse(attrs.appIconSetSrc);
                /**
                 * check the apps icons
                 */
            } catch(e) {
                console.error(e);
            }
            var imgSrc = scope.checkSize(appIcons, 48, 48);
            if(imgSrc !=false) {
                angular.element(element).attr('src', imgSrc);
            }
        }

    };
});


