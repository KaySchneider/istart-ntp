/**
 * Created by ikay on 12.01.15.
 */
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');
app.directive('calcItems', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            //console.log(scope.items.length, "linker");
         /*   var newWidth = ( element[0].clientHeight / 130) * 300;
            console.log( (element[0].clientHeight / 130) * 300 );
            /**
             * calc the position for this item
             * @type {string}
             */
           /* console.log(scope);
            element[0].style.width = newWidth + 'px';
            if(!scope.$parent.nextStart) {
                element[0].style.left = 50 + 'px';
                scope.$parent.nextStart = newWidth + 200;
            } else {
                element[0].style.left = scope.$parent.nextStart + 'px';
                scope.$parent.nextStart = newWidth + scope.$parent.nextStart + 200;
            }
            console.log(element[0].style.left);

            element[0].style.top = 150 + 'px';*/
        }

    }
});
