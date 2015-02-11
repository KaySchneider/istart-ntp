'use strict';
/**
 * Created by ikay on 10.02.15.
 *
 */

app.factory('analytics', ['$q',function ($q) {
    var track = function(eventid, action, optionalArguments) {
        try {
            if (optionalArguments !== undefined) {
                _gaq.push(['_trackEvent', eventid, action, optionalArguments.value]);
            } else {
                _gaq.push(['_trackEvent', eventid, action]);
            }
        } catch (e) {

        }
        return true;
    };
    /**
     * returns the current apps list!
     */
    return {
        track: track
    }
}]);

/**
 * /**
 * @params <object> optionalArguments  label, value
 */
function trackMe(eventid, action, optionalArguments) {
    try {
        if (optionalArguments !== undefined) {
            _gaq.push(['_trackEvent', eventid, action, optionalArguments.value]);
        } else {
            _gaq.push(['_trackEvent', eventid, action]);
        }
    } catch (e) {

    }
    return true;
}
