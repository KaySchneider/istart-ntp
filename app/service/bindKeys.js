/**
 * Created by ikay on 26.01.15.
 */
'use strict';
//chrome.management.launchApp(string id, function callback)
/**
 *  Chrome Apps auslesen
 *  mit aktueller matrix abgleichen ob die App schon darin enthalten ist
 *  wenn nicht dann der aktuellen Matrix an das Ende hinzufügen
 * Bevor dies Realisiert werden kann muss das message passing perfektioniert werden
 * wie wir die Messages von der Background Page in die Frontend Page bekommen.
 * So können wir auch die Ladezeiten beschleunigen!!
 **/
'use strict';
var app  = angular.module('istart');
app.factory('bindKeys', ['$q', '$window', '$rootScope' ,function ($q, $window, $rootScope) {
    /**
     * bind the keys only one time to the window!
     * @param appConfigObject
     * @returns {*}
     */
    var bind = false;
    var eventvalue =null;
    var states = {
        up:false,
        down:false,
        left:false,
        right:false,
        enter:false,
        return:true,
        esc:false
    };

    var allNull = function() {
        states.up=false;
        states.down=false;
        states.left=false;
        states.enter=false;
        states.right = false;
        states.esc=false;
    };

    if(bind === false) {
        console.debug('bind keys');
        angular.element($window).on('keydown', function(event) {
            allNull();
            eventvalue = event;
            switch (event.keyCode) {
                case '':
                    break;
                case 8: //backspace
                    break;
                case 35: //end
                    break;
                case 36: //home
                    break;
                case 37: //left
                    states.left=true;
                    $rootScope.$broadcast('states', states);
                    return states.return;
                    break;
                case 38: //up
                    states.up=true;
                    $rootScope.$broadcast('states', states);
                    return states.return;
                    break;
                case 39: //right
                    states.right=true;
                    $rootScope.$broadcast('states', states);
                    return states.return;
                    break;
                case 40: //down
                    states.down=true;
                    $rootScope.$broadcast('states', states);
                    return states.return;
                    break;
                case 45: //ins
                    break;
                case 46: //del
                    //return true;
                    break;
                case 13:
                    states.enter=true;
                    $rootScope.$broadcast('states', states);
                    return states.return;
                    break;
                case 27: //esc
                    states.esc=true;
                    $rootScope.$broadcast('states', states);
                    return states.return;
                    break;
                default:
                    //return false;
                    break;
            }
        });
    }

    /**
     * returns the current apps list!
     */
    return {
        watchers: states,
        addcontroller: function() {
            states.return = false;
        },
        removecontroller: function() {
            states.return = true;
        }

    }
}]);


