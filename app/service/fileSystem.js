'use strict';
/**
 * Created by ikay on 09.02.15.
 *
 */
var app  = angular.module('istart');
app.factory('fileSystem', ['$q',function ($q) {
    console.log( 'FILESYSTEM FAC');
    var fileSystem=null;
    var userDir = null;
    var rawFile=null;

    var requestExtensionFileSystem = function() {
        var defer = $q.defer();
        window.webkitRequestFileSystem(window.PERSISTENT, 50 * 1024 * 1024, function(filesystem) {
            fileSystem=filesystem;
            fileSystem.root.getDirectory("/", {
                create: false
            }, function(dirEntry){
                userDir = dirEntry;
                defer.resolve();
            });
        }, function(e) {
            defer.reject(e);
        });
        return defer.promise;
    };

    var requestFileSystem = function() {
        var defer = $q.defer();
        window.webkitRequestFileSystem(window.PERSISTENT, 50 * 1024 * 1024, function(filesystem) {
            fileSystem=filesystem;
            fileSystem.root.getDirectory("/user", {
                create: true
            }, function(dirEntry){
                userDir = dirEntry;
                defer.resolve();
            });
        }, function(e) {
            defer.reject(e);
        });
        return defer.promise;
    };

    var makeUrl  = function (name, defer) {
        var deferItem=defer;
        fileSystem.root.getFile(name, {

                create:false
            }
            ,
            function(fileEntry) {

                //var i = document.createElement('img');

                //i.setAttribute('src', fileEntry.toURL());
                //i.setAttribute('style','position:absolute;top:0px;left:0px;min-width:500px;border:1px solid red');
                //document.getElementsByTagName('body')[0].appendChild(i);
                //console.log(fileEntry.toURL());
                defer.resolve( fileEntry.toURL() );
            }
        );
    };

    var writeFile = function(fname,rawFile) {
        var defer = $q.defer();
        var fileEnd = getFileType(rawFile.name);
        var fname = 'background.'+fileEnd;
        var rawFile=rawFile;
        requestFileSystem()
            .then(function() {
                   fileSystem.root.getFile(fname, {
                       create: true
                   }, function(fileEntry) {

                       // Create a FileWriter object for our FileEntry (log.txt).
                       fileEntry.createWriter(function(fileWriter) {

                           fileWriter.onwriteend = function(e) {
                               makeUrl(fname, defer);
                           };

                           fileWriter.onerror = function(e) {
                               //console.log('Write failed: ' + e.toString());
                           };
                           // Create a new Blob and write it to log.txt.
                           fileWriter.write(rawFile);

                       }, errorHandler);

                   }, errorHandler);
            }, function(e) {
                console.error(e);
            });
        return defer.promise;
    };

    var getFileType=function(fileName) {
            var name = fileName;
            var ext = name.split('.');
            var end = ext[ext.length-1] ;
            if( end == undefined || end == '' ) {
                /**
                 *maybe insert here an global error handler wich shows an popup to the user
                 */
                return false;
            } else {
                return end;
            }

    };


    function errorHandler(e) {
       console.log(e);
        return true;
    }
    /**
     * returns the current apps list!
     */
    return {
        writeFile: function(fname, rawFile) {
            return writeFile(fname, rawFile);
        }
    }
}]);
