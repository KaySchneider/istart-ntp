/**
 * Created by kay on 29.10.13.
 */
    //console.log(chrome.extension.getURL(''));
var extensionUrl = chrome.extension.getURL('system/topsites/html/widget.html');

var topSites =  {
    storedData: function () {
    },
    injectPermissionData: function () {
        var ask = document.getElementById('perm');
        ask.setAttribute('style','display:block');
        var btnAsk = document.getElementById('permStart').addEventListener('click', function () {
            topSites.getPermissions();
        });
    },
    getPermissions: function () {
        chrome.permissions.request({
            permissions: ['topSites']
        }, function(granted) {
            //console.log(granted);
            // The callback argument will be true if the user granted the permissions.
            if (granted) {
                var ask = document.getElementById('perm');
                ask.setAttribute('style','display:none');
                topSites.get();
            } else {
                alert("Sorry the topSites need access to your topSites from chrome. Please close and reopen the topsites. :) Thanks");
            }
        });
    },
    checkPermissions: function () {
        chrome.permissions.contains({
            permissions: ['topSites']
        }, function(result) {
            if (result) {
                // The extension has the permissions.
                topSites.get();
            } else {
                topSites.injectPermissionData();
            }
        });
    },
    get: function () {
        chrome.topSites.get(function(data) {
            doDomManipulation(data);
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

function doDomManipulation(data) {
    var doFragment = document.createDocumentFragment();
    for(var item in data) {
        doFragment.appendChild( createDocumentObject(data[item]) );
    }

    var itemWidth = '314';
    var itemHeigth = '230';
    var itemsCount = data.length;
    //resizing the application content canvas
    istartApi.appCalculateScreenSize({
        'itemSize': {
            width:314,
            height:230
        },
        'itemsCount':itemsCount
    });

    var topSitesElement = document.getElementById('topsites');
    topSitesElement.appendChild(doFragment);
}

function createDocumentObject(items) {
    ////console.log(items);
    var img = document.createElement('span');
    console.log(items.url);
    /*istartApi.sendMessageToIstart({cmd:'getthumbnail', url:items.url, tabId:istartApi.currentTabId},
    function(response) {
        var imm = new Image();
        imm.src=response.thumbnail;
        img.appendChild(imm);
    });*/
    img.setAttribute('class','label');
    var label = document.createTextNode(items.title);
    img.setAttribute('linkto',items.url);
    img.appendChild(label);
    img.addEventListener('click',function (event) {
        //console.log(event,this);
        istartApi.launchlink(this);
    },false);
    return img;
}

istartApi.afterLoad();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //only internal extensions
        if(sender.tab.url === "chrome://newtab/") {
            if (request.cmd == "click") {
                ////console.log("click event has been come to the application");
            }
        }
    });
topSites.checkPermissions();