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

var hashInObject = function(needle, arr) {
    for(var index in arr) {
            if(arr[index].hash == needle) {
                return index;
                break;
            }
    }
    return false;
};

var clearDataBase = function() {
    var day = (24 * 3600000);
    var dd = Date.now() - (day * 7);
    var dateOb = new Date(dd);
    console.log(dateOb.toGMTString());
    var now = Date.now();
    db.timeSpendOnUrl.where('timestart').below(dd)
        .delete().then(function(item) {

        });
    db.timeMasterUrl.where('timestart').below(dd)
        .delete().then(function(item) {

    });
};

var calculateMostActiveUrl = function() {
    clearDataBase();//delete everything older than 7 days
    var urls = [];
    var hashToEntry=[];
    //reduce the data to the domain for more granular data we can check the history API
    //start direct to resort the most used urls
    db.timeMasterUrl.orderBy('url').each(function(item) {
        var hash = md5(item.url) + 'a'; //make a string of it=?
        var isInObject = hashInObject(hash,urls);
        if(  isInObject == false ) {
            hashToEntry[hash]=item;
            urls.push({duration: item.duration, hash: hash, item:item});
        } else {
            urls[isInObject].duration = urls[isInObject].duration + item.duration;
        }
    }).then(function() {
        urls.sort(function(a,b) {
            return a.duration == b.duration ? 0 :
                    a.duration < b.duration ? 1 : -1;
        });
        //write the most recent 10 items into the most time spend in local storage
        var storeItems = urls.slice(0, 10);
        chrome.storage.local.remove('timespend');
        chrome.storage.local.set({'timespend': JSON.stringify(storeItems)});
    });
};


//try to generate a large database of random stuff
var startSurfingAutoMagic = function() {
    this.lastTabsIds=[];
    this.lastIndex=0;
    this.urls = [
        "https://google.de",
        "https://ebay.de",
        "http://amazon.de",
        "http://paypal.de",
        "http://stern.de",
        "http://bild.de",
        "http://focus.de",
        "http://fox.com",
        "http://Faz.de",
        "http://twitter.de",
        "http://facebook.de",
        "http://spiegel.de",
        "http://stuttgarter-zeitung.de",
        "http://leonberg.de",
        "http://stuttgart.de",
        "http://test.de",
        "http://edeka.de",
        "http://amazon.com",
        "http://fab.com",
        "http://bbc.com",
        "http://social.com",
        "http://pinterest.com",
        "http://android.com",
        "http://play.google.com",
        "http://bsz.de",
        "http://otto.de",
        "http://quelle.de",
        "http://karstadt.de",
        "http://neckermann.de"
    ]
};


startSurfingAutoMagic.prototype.init = function() {
    var that=this;
    chrome.history.search({text:"",maxResults:1000}, function (items) {
        for(var item in items) {
            that.urls.push(items[item].url);
        }
        that.startSurfing();
    })
};

startSurfingAutoMagic.prototype.startSurfing = function(index) {
    console.log(index);
    if(typeof(index)=== "undefined") {
        index = 0;
        console.log(index, 'WAS SET');
    }
    if(this.urls.length <= index) {
        return;
    }
    var that = this;
    var startDelay = 100;
        var load = this.urls[index];
        Q(load).then(function(ll) {
            return Q(ll).delay(5000);
        }).then(function(ll) {
            that.getATabs(ll).then(function(tab) {
                chrome.tabs.update(tab.tab.id, {active:true, url:tab.url});
                that.startSurfing(++index);
                console.log(index);
            });

        });
};

//holds the surf vars
startSurfingAutoMagic.prototype.surf = function() {

};

/**
 * tester for the extension. Maybe we create for this a new extension!
 */
startSurfingAutoMagic.prototype.getATabs = function(url) {
    var deferred= Q.defer();
    var that = this;
    var url = url;
    chrome.tabs.query({}, function(tabs) {
        var found=false;
        for(var item in tabs) {
            var tabInfo = tabs[item];
            if(that.lastTabsIds.indexOf(tabInfo.id) == -1) {
                console.log('FOUND');
                found=true;
                that.lastTabsIds.push(tabInfo.id);
                console.log(that.lastTabsIds, tabInfo);
                deferred.resolve({tab:tabInfo, url:url});
                break;
            }
        }
        if(found==false) {
            //use the first tab
            if(that.lastIndex == that.lastTabsIds.length) {
                that.lastIndex = 0;
            }
            var rId=that.lastTabsIds[that.lastIndex];
            that.lastIndex++;
            for(var item in tabs) {
                if(tabs[item].id == rId) {
                    deferred.resolve({tab:tabs[item],url:url});
                }
            }
        }

    });
    return deferred.promise;
};

