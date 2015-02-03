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
var calculateMostActiveUrl = function() {
    var urls = [];
    var hashToEntry=[];
    //reduce the data to the domain for more granular data we can check the history API
    //start direct to resort the most used urls
    db.timeMasterUrl.orderBy('url').each(function(item) {
        //console.log(item, urls, item.url in urls);
        var hash = md5(item.url) + 'a'; //make a string of it=?
        if((hash in urls)==false) {
          //  console.log('works WHAT');
            hashToEntry[hash]=item;
            urls[hash] = item.duration;
           // console.log('works not');
        } else {
            hashToEntry[hash] = item;
            urls[hash] = urls[hash] + item.duration;
        }
    }).then(function(msg) {
            urls.sort(function(a, b) {
                return console.log(a, b);
            });
        console.log('ITEMS' , urls);
    });
};

function sortMe(a, b) {
    console.log(a,b, 'SORTED');
    if(a < b) return 1;
    if(a > b) return -1;
    return 0;
}

var orderHighest = function(objectArray) {
    var sortME =  objectArray.sort();
    console.log('sorted', objectArray, sortMe);
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

