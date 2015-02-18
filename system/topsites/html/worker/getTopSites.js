/**
 * Created by kay on 29.10.13.
 */

self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'start':
            topSites.get(data.data);
            self.postMessage('WORKER STARTED: ' + data.msg);
            break;
        case 'stop':
            self.postMessage('WORKER STOPPED: ' + data.msg +
                '. (buttons will no longer work)');
            self.close(); // Terminates the worker.
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    };
}, false);

var topSites =  {

    storedData: function () {

    },
    get: function () {

        chrome.topSites.get(function(data) {
        //    var send= topSites.processFiles(data);
            self.postMessage({cmd:'topSites', data:data});
        });
    },
    /**
     * get the preview picture from
     * chrome!
     */
    processFiles: function (data) {
        var returnObject = [];

    }
};
