'use strict';
/**
 * embedded an youtube player direct on an tile!
 */

var app = angular.module('istartMetroDirective');

app.directive('youtubePlayer', function() {
    return {
        restrict: 'E',
        scope: {
            video:'@video'
        },

        template:'<iframe id="ytplayer" type="text/html" width="249" height="249" ' +
                   ' ng-src="{{urlP}}" ' +
                    'frameborder="0"/>',
        link: function(scope, element, attrs) {
            scope.urlP = "https://www.youtube.com/embed/" + scope.video + "?autoplay=0&origin=istart-newtab";
        }

    }
});


