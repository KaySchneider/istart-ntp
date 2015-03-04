'use strict';
var app = angular.module('istartMetroDirective');
app.filter('booleanString', function() {
    return function(input) {
        /**
         * it should return on or off on boolean value on other values
         * it should return the value itself
         */
        var rv=input;
        switch(input) {
            case true:
                rv = 'on';
            break;
            case false:
                rv= 'off';
                break;
        }
        return rv;
    }
});



