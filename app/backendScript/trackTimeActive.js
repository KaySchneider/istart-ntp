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

var trackTimeActive = function() {
    /**
     * this object holds the logic to track the active pages items
     */
};


/**
 * one call to manage all changes in the active
 * tab.
 * TODO: add special case, close window
 * @param tabId
 * @param tabInformation
 */
trackTimeActive.changeActiveTab = function(tabId, tabInformation) {
    /**
     * Exclude all chrome internal pages and the devtools from the time tracking!
     */
    if(tabInformation.url.indexOf('chrome-devtools://') != -1 || tabInformation.url.indexOf('chrome://') != -1) {
        console.log('IS NOT -1');
        return;
    } else {
        Q().then(function() {
                return Q().delay(1000);
            })
            .then(function() {
            })
            .then(function() {
                //console.log('INSIDE CHANGE ACTIVE TAB', tabId, tabInformation);
                var stopTime = Date.now();
                trackTimeActive.getLastActiveItem()
                    .then(function(result) {
                       if(result !== false) {
                            //write this item back to the main DB and delete it from the table?? No write back and
                           //set it to false
                           result.isActive="false";
                           db.timeSpendOnUrl.update(result.id, result)
                               .then(function(id, foo) {
                                   var duration = calculateTimings.getDuration(result.timestart, stopTime);
                                   result.duration = duration;
                                   result.timestop = stopTime;
                                   //console.log(duration, 'DATA');
                                   //tabId, url, timestart, isActive
                                   db.timeMasterUrl.add({
                                       tabId:result.tabId,
                                       url:result.url,
                                       timestart: result.timestart,
                                       duration:duration,
                                       timestop:result.timestop,
                                       isActive: result.isActive
                                    }).then(function(id) {
                                      // console.log(id, "SOURCE TRACK TINE");
                                   });
                               });

                       }  else {
                           //it does not exists do nothing for now
                       }
                      trackTimeActive.getTabTimeEntryTemp(tabId)
                            .then(function(items) {
                              //console.log('GET TAB TIME ENTRY TEMP RES', items);
                                if(items.status === false) {
                                    //console.log('ADD NEW ITEM STATUS WAS FALSE');
                                    //create new item
                                    //timeSpendOnUrl: '++id, tabId, url, timestart, isActive'
                                    db.timeSpendOnUrl.add({
                                        tabId: tabId,
                                        url: tabInformation.url,
                                        timestart:stopTime,
                                        isActive:"true"
                                    });
                                } else {
                                   // console.log('UPDATE THE ENTRY STATUS WAS TRUE');
                                    items.result.url = tabInformation.url;
                                    items.result.isActive= "true";
                                    items.result.timestart=stopTime;
                                    //update the old entry
                                    db.timeSpendOnUrl.update(items.result.id, items.result);
                                }
                      });
                    });
            });
    }
};


trackTimeActive.getLastActiveItem = function() {
    // console.log('INSIDE GET LAST ACTIVE ITEM');
    var deferred = Q.defer();
    db.timeSpendOnUrl.where('isActive').equals("true")
        .count(function(count) {
            if(count > 0) {
                //exists
                // console.log('LAST ACTIE ITEM IS NOT NULL');
                var resolve = false;
                db.timeSpendOnUrl.where('isActive').equals("true")
                    .each(function(item) {
                       // console.log('resolve derferred', resolve, item);
                        if(resolve === false) {
                            resolve=true;
                            deferred.resolve(item);
                        }
                    })
                    .error(function(e) {
                        console.log(e);
                    });
            } else {
                //not existent
                deferred.resolve(false);
            }
        });
    return deferred.promise;
};

trackTimeActive.getTabTimeEntryTemp = function(tabId) {
    var deferred = Q.defer();
    //at first we need to count the results
    trackTimeActive.getTimeTabCount(tabId)
        .then(function(items) {
            // console.log('GET TAB TIME ENTRY THEN',items);
            if(items.status==false) {
                deferred.resolve({
                    result:null,
                    status:false
                });
            } else {
                var resolved=false;
                db.timeSpendOnUrl.where('tabId').equals(tabId)
                    .each(function(item) {
                      //  console.log(resolved, item);
                        if(resolved===false) {
                            resolved=true;
                            deferred.resolve({
                                result:item,
                                status:true
                            });
                        }
                    });
            }
        });
    return deferred.promise;
};

/**
 * checks if this tabId exists inside the tabCountTable!
 * @param tabId
 * @returns {*}
 */
trackTimeActive.getTimeTabCount = function(tabId) {
        var deferred = Q.defer();
        //at first we need to count the results
        db.timeSpendOnUrl.where('tabId').equals(tabId)
            .count(function(countInt) {
                if(countInt > 0) {
                    deferred.resolve({
                        result:countInt,
                        status:true
                    });
                } else {
                    deferred.resolve({
                        result:countInt,
                        status:false
                    });
                }
                    });
        return deferred.promise;
};