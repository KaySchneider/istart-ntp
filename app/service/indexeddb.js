'use strict';
var app  = angular.module('istart');
app.factory('globalSearchService',[ '$q',
    function($q) {
        var getDBSearch = function() {
            var db = new Dexie('istartV2Search');
            db.version(1)
                .stores({
                   searchApps:'++id,appId,name,description',
                   searchTiles:'++id,uuid,name,description'
                });
            db.open()
                .catch(function(error){
                    console.error(error);
                });
            return db;
        };
        return {
            getSearchDatabase:getDBSearch
        }
    }
]);
