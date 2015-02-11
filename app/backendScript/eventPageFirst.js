/**
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
 * Diese Datei ist Teil von Fubar.
 *
 * Fubar ist Freie Software: Sie können es unter den Bedingungen
 * der GNU General Public License, wie von der Free Software Foundation,
 * Version 3 der Lizenz oder (nach Ihrer Wahl) jeder späteren
 * veröffentlichten Version, weiterverbreiten und/oder modifizieren.
 *
 * Fubar wird in der Hoffnung, dass es nützlich sein wird, aber
 * OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
 * Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
 * Siehe die GNU General Public License für weitere Details.
 *
 * Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
 * Programm erhalten haben. Wenn nicht, siehe <http://www.gnu.org/licenses/>.
 *
 * Zentrale Event page, Registrierung neuer events bitter hier vornehmen.
 **/
'use strict';

var istartBackOffice = function() {
    this.matrix = null;
    this.portName = 'istartInternalBackendCommunication';
};

istartBackOffice.prototype.init = function() {
    console.log('init the background page');
    this.loadData();
    this.addMessageListener();
};

istartBackOffice.prototype.loadData = function() {
    var that = this;
    chrome.storage.local.get('istart',function( datas ) {
        try {
            console.log(datas);
            that.matrix = JSON.parse(datas.istart);
        } catch(e) {
            console.log(e);
            that.matrix = false;
        }
    });
};

istartBackOffice.prototype.saveMatrix = function(matrix, port, uid) {
    chrome.storage.local.set({istart:JSON.stringify(matrix)}, function() {
        timespendCalc=null;
        linkInMatrix=null;
        setTimeSpend();
    });
};

istartBackOffice.prototype.getMatrixPort = function(port, uid) {
    port.postMessage({ matrix: this.getMatrix(), uid: uid});
};

istartBackOffice.prototype.getThumbnail = function(port, hostname, uid) {
    var uid = uid;
    var sended=false;
    try {
        var hostnameCheck = new URL(hostname).hostname;
    }  catch(e) {
        return;//there was an error.... reject this
    }
    db.thumbnails.where('url')
        .equals(hostnameCheck)
        .count(function(items) {
            if(items!=0) {
                db.thumbnails.where('url')
                    .equals(hostnameCheck)
                    .each(function(item) {
                        if(sended==false)
                            port.postMessage({uid:uid, thumbnail:item.data});
                        sended=true;
                    });
            } else {
                port.postMessage({uid:uid, thumbnail:null});
                sended=true;
            }
        });
};

istartBackOffice.prototype.getMatrix = function() {
    if(this.matrix !== null || this.matrix.length ==0) {
        return this.matrix;
    }
    return false;
};

istartBackOffice.prototype.addMessageListener = function() {
    var that = this;
    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(msg) {
            if(msg.message.call == 'getMatrix') {
                that.getMatrixPort(port, msg.uid);
            } else if(msg.message.call == 'saveMatrix') {
                that.saveMatrix(msg.message.matrix, port, msg.uid);
            } else if(msg.message.call == 'getThumbnail') {
                that.getThumbnail(port, msg.message.hostname, msg.uid)
            }

        });
    });
};



var istartTimeTracker = function() {

};

var istartObject = new istartBackOffice();
istartObject.init();

var tabUpdateEvents = []; //store here temporary some pages events
var tempLoadedUrls=[]; //to do it correct we must delete some items
/**
 * tempLoadedUrls:
 *  tabId:  url(string)
 *
 *
 * if(currentUpdatedTabId.url != url) then do something.. else reject
 */
function addTabsEvents() {

    chrome.windows.onFocusChanged.addListener(function (windowId) {
        console.log('CHANGE WINDOW', windowId);
        if(windowId != chrome.windows.WINDOW_ID_NONE) {
            /*
            * get the active tab information
             */
            //windowId
            chrome.tabs.query({
                windowId:windowId,
                active: true//get only the active tab"
            }, function(tabs) {
                //console.log(tabs[0]);
                if(tabs[0]) {
                    trackTimeActive.changeActiveTab(tabs[0].id, tabs[0]);
                }
            });
        }
    });

    chrome.tabs.onActiveChanged.addListener(function(tab) {
        //console.log('active tab changes', tab);
    });

    chrome.tabs.onActivated.addListener(function(activeInfo) {
       chrome.tabs.get(activeInfo.tabId, function(tabData) {
               if(chrome.runtime.lastError) {
                   console.debug(chrome.runtime.lastError);
               } else {
                    trackTimeActive.changeActiveTab(tabData.id, tabData);
               }
           });


    });

    chrome.tabs.onCreated.addListener(function(tab) {

    });

    chrome.tabs.onRemoved.addListener(function(tabId, closeInfo) {
        /**
         *TODO: add here tracking code if the browser shuts down!
         */
    });


    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if(tab.status == 'complete' && tempLoadedUrls[tabId] != tab.url && tab.active == true) {
            // console.log(tabId, changeInfo, tab, 'UPDATE INFORMATION');
            tempLoadedUrls[tabId] = tab.url;
            trackTimeActive.changeActiveTab(tab.id, tab);
            var urlImage = tab.url;
            createThumbnail(urlImage, tab);

        }
    });

}

var timespendCalc=null;
var linkInMatrix=null;
var setTimeSpend=function() {
    var defer=Q.defer();
    if(timespendCalc==null) {
        chrome.storage.local.get('istart', function(data) {
            try {
                linkInMatrix=[];
                var matrix = JSON.parse(data.istart);
                for(var item in matrix) {
                    for(var sub in matrix[item]) {
                        if(matrix[item][sub][0].link) {
                            linkInMatrix.push(matrix[item][sub][0].link);
                        }
                    }
                }
            } catch(e) {

            }
        });
        chrome.storage.local.get('timespend', function(data) {
            try  {
                timespendCalc=JSON.parse(data.timespend);
            } catch(e) {
                timespendCalc=false;
            }
            defer.resolve(timespendCalc);
        });
    } else {
        defer.resolve(timespendCalc);
    }
    return defer.promise;
};

var createThumbnail = function(url, tab) {
  //check if there check if the item is in the database
    var url = url;
    setTimeSpend().then(function(data) {
       if(data != null || data != false) {
           console.log(data);
           var makePic=false;
           var hostnameCheck = new URL(url).hostname;
           for(var item in data) {
                var hostname = new URL(data[item].item.url).hostname;
               console.log(hostname,hostnameCheck);
                if(hostname==hostnameCheck) {
                    makePic=true;
                    break;
                }
           }
           if(makePic==false) {
               for(var item in linkInMatrix) {
                   var hostname = new URL(linkInMatrix[item]).hostname;
                   if(hostname==hostnameCheck) {
                       makePic=true;
                       break;
                   }
               }
           }
           console.log(makePic);
           if(makePic==true) {
                   db.thumbnails.where('url')
                       .equals(hostname)
                       .count(function(items) {
                           if(items==0) {
                               chrome.tabs.captureVisibleTab( tab.windowId ,function(dataUrl) {
                                   //console.debug(dataUrl, url);//this is the preview image
                                   //saveImage(dataUrl, hostname);
                                   console.log('create thumbnail');
                                   db.thumbnails
                                       .add({
                                           url: hostname,
                                           data:dataUrl
                                       });
                               });
                           }
                       });
           }
       }
    });
};

var saveImage = function(imageUrl, hostname) {
    var key='image'+ hostname;

    //chrome.storage.local.set({ key : imageUrl});
};

chrome.alarms.onAlarm.addListener(function(alarm) {
    timespendCalc=null;
    if(alarm.name == "createTimeSpend") {
        console.log('alarm create Time spend active');
        chrome.alarms.create("createTimeSpend", {delayInMinutes: 40});//fire only once per hour

        calculateMostActiveUrl();
    }
});
chrome.alarms.create("createTimeSpend", {when: Date.now() + 500});
/**
 * Start to bind the tabs event listeners
 * TODO: add later an config so that the users can change this and maybe disable some
 *
 */
addTabsEvents();

