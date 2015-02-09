/**
 * Created by ikay on 06.01.15.
 *
 * Copyright 2012-2015 Kay Schneider <kayoliver82@gmail.com>
 *
 * This file is part of istart-new-tab-page-V2.
 *
 * istart-new-tab-page-V2 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * istart-new-tab-page-V2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with istart-new-tab-page-V2.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Diese Datei ist Teil von istart-new-tab-page-V2.
 *
 * istart-new-tab-page-V2 ist Freie Software: Sie können es unter den Bedingungen
 * der GNU General Public License, wie von der Free Software Foundation,
 * Version 3 der Lizenz oder (nach Ihrer Wahl) jeder späteren
 * veröffentlichten Version, weiterverbreiten und/oder modifizieren.
 *
 * istart-new-tab-page-V2 wird in der Hoffnung, dass es nützlich sein wird, aber
 * OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
 * Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
 * Siehe die GNU General Public License für weitere Details.
 *
 * Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
 * Programm erhalten haben. Wenn nicht, siehe <http://www.gnu.org/licenses/>.
 **/
'use strict';

angular.module('istart', [
            'ngRoute',
            'ui.router',
            'istartMetroDirective',
            'ui.sortable',
            'ngMaterial',
            'ngAnimate',
            'alAngularHero'
    ]

).run(['$rootScope','$window' , function($rootScope, $window) {
        $rootScope.uuidList = [];
        $rootScope.getUUIDListInUse = function() {
            return $rootScope.uuidList;
        };

        $rootScope.checkUUIdInUse = function(uuid) {
            if($rootScope.uuidList.indexOf(uuid) != -1) {
                return false;
            }
            return true;
        };

        $rootScope.getUniqueUUID = function() {
            var uuid;
            while(true==true) {
                uuid = $window.guid();
                if($rootScope.checkUUIdInUse(uuid)) {
                    console.debug('found unique uuid', uuid);
                    break;
                } else {
                    console.debug(uuid, 'is in data');
                }
            }
            return uuid;
        };

        $rootScope.addUUIDTOList = function(uuid) {
            $rootScope.uuidList.push(uuid);
        };

    }]).config(['$stateProvider', '$urlRouterProvider', '$compileProvider',
        function($stateProvider, $urlRouterProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|chrome|chrome-search):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|chrome|chrome-extension|chrome-search|data)/);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
            console.debug('TIME TO THE APP START in seconds:' , (Date.now() - window.startTime)/1000);
        $urlRouterProvider.otherwise('/desktop');
        $stateProvider
            .state('desktop', {
                url: '/desktop',
                controller: 'desktopCtrl',
                templateUrl: 'views/hist.html'

            })
            .state('apps', {
                url: '/apps',
                controller: 'allAppsCtrl',
                templateUrl: 'views/apps.html'
            });
    }]);
window.startTime = Date.now();
/**
 * TODO: move this part to global window functions file
 */
window.guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random( )) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();