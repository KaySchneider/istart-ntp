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
        console.log('save matrix', matrix);
    });
};

istartBackOffice.prototype.getMatrixPort = function(port, uid) {
    port.postMessage({ matrix: this.getMatrix(), uid: uid});
};

istartBackOffice.prototype.getMatrix = function() {
    if(this.matrix !== null || this.matrix.length ==0) {
        console.log('load new matrix');
        return this.matrix;
    }
    return false;
};

istartBackOffice.prototype.addMessageListener = function() {
    var that = this;
    console.log('init MEssage');
    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(msg) {
            console.log(msg, 'received the message');
            if(msg.message.call == 'getMatrix') {
                that.getMatrixPort(port, msg.uid);
            } else if(msg.message.call == 'saveMatrix') {
                that.saveMatrix(msg.message.matrix, port, msg.uid);
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
        console.log('ACTIVATED');
/*        db.visited
            .add({
                url: "TEST",
                tabId: "TEST",
                start:"TEST",
                completeUrl:"TEST"
            });
*/
        //console.log(activeInfo, 'ACTIVATED START NOW THE ACTIVE TIMING FUNCTION');
        /**
         * Speicherung der aktiven url in jedem change. Aber ohne start und Endzeit ermittlung.
         * Nur mit einer visitTime
         * Sollte der Tab den Flag active true enthalten dann wird der Tab aktiviert.
         * Das heißt es gibt einen neuen Eintrag in "activeTab"
         * Es wird als erstes ein active Tab Selektiert, sollte es kein Erbeniss geben so muss
         * der Eintrag erstellt werden.
         * TODO: implement here the new tracking version!!
         *
         * TODO: change the current and stop the pages time tracking!
         * TODO: Maybe we can embedded an code so the we know that an user
         * is currently actvive on this tab. If we track the code or something like this
         */
       chrome.tabs.get(activeInfo.tabId, function(tabData) {
               if(chrome.runtime.lastError) {
                   console.debug(chrome.runtime.lastError);
               } else {
                    //console.log(tabData);
                    trackTimeActive.changeActiveTab(tabData.id, tabData);
               }
               //now we have the tabData and we can close the old session if
           });


    });

    chrome.tabs.onCreated.addListener(function(tab) {
        //at the on created tab event we can create the new tab entry because it exists currently
        console.log( 'tab created', tab.url);
      /*  var isPv = istartPageVisitItem;
        chrome.tabs.get(tab.id, function(tabs) {
            if(chrome.runtime.lastError) { //check the last error the error happens we the user closes the tab now
                console.debug(chrome.runtime.lastError);
            } else {
                isPv.createVisitEntry(Date.now(), tabs.url, tabs.id);
                console.log('created new tab', tab);
            }
        });*/
    });

    chrome.tabs.onRemoved.addListener(function(tabId, closeInfo) {
        /**
         * ChangeActiveTab wird auch hier geworfen wenn ein Fenster geschlossen wird.
         * Ziel ist nicht jede Surf Aktivität zu erfassen sondern vorerst nur die Seiten
         * zu erfassen auf welchen der Nutzer auch Zeit verbringt und diese SOmit relevant für
         * den Nutzer sind
         * den Nutzer sind
         */
      //  var isPv = istartPageVisitItem;
       /* chrome.tabs.get(tabId, function(tabs) {




            //sure stop the entry for visiting and stopping the time.
            //But we should only track the time when the page was
            //really active and the user uses the tab. But this
            //is a good startPoint
            if(chrome.runtime.lastError) {
                console.debug(chrome.runtime.lastError);
            } else {
                isPv.stopVisitiEntry(Date.now(), tabs.url, tabs.id);
            }
        });*/
    });


    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        console.log('tab updated ', tab.url);
        if(tab.status == 'complete' && tempLoadedUrls[tabId] != tab.url && tab.active == true) {
            // console.log(tabId, changeInfo, tab, 'UPDATE INFORMATION');

            tempLoadedUrls[tabId] = tab.url;
            trackTimeActive.changeActiveTab(tab.id, tab);
        }
     /**
        var isPv = istartPageVisitItem;
        //console.log(tab, 'TAB', changeInfo);
        if(!tempLoadedUrls[tabId]) {
            tempLoadedUrls[tabId] = [];
        }
        tabUpdateEvents.push(tab);
        if(!tab.status) {
            return;
        }




        console.log('tab was updated', tab); **/
    });

    chrome.webNavigation.onCommitted.addListener(function(e) {
        /**
         * we use this handler to hold the lifetime of
         * the background page longer!
         */
        //console.log(e);
    });
}
/**
 * Start to bind the tabs event listeners
 * TODO: add later an config so that the users can change this and maybe disable some
 * items
 */
addTabsEvents();
console.log('im the backend page');

