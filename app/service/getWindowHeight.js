/**
 * Created by ikay on 28.01.15.
 */
'use strict';
/**
 *
 **/
'use strict';
var app  = angular.module('istart');
app.factory('getWindowHeight', ['$q',function ($q) {
    var calcHeight = function() {
        /**
         * receive all the apps
         */
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    };

    /**
     * returns the current apps list!
     */
    return {
        height: function() {
            return calcHeight();
        }
    }
}]);


