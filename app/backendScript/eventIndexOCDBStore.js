/**
 * Hier werden die Seiten nicht mit jedem einzelnen Aufruf getracked sondern
 * es sollten die gesamt verweildauer auf den Seiten getracked werden.
 * Um die Auswertung der Daten schneller zu gestalten werde ich zum testen erstmal
 * nur die URL tracken und unterhalb des URL Objektes werden die Seiten getracked
 *
 * Überlegung, es sollte getracked werden sobald der Nutzer auf die Seite geht und
 * diese Aufruft.
 */
var istartPageVisitItem = function() {
    this.tabId = null;
    this.url = null;
    this.completeUrl=null
    this.start = null;
    this.end = null;
    this.duration=null;//duration will be set when stop visit is called
};

istartPageVisitItem.getItemById=function(id) {
    var deferred = Q.defer();
    db.visited.where('id')
        .equals(id)
        .each(function(item) {
            deferred.resolve(item);
        });
    return deferred.promise;

};

/**
 * we need the tabId to track wich tab has changed because the url can be in more than one
 * tab active
 * @param timestampStart
 * @param url
 * @param tabid
 */
istartPageVisitItem.createVisitEntry = function(timestampStart, url, tabid) {
    var a = document.createElement('a');
    a.href = url;
    console.log(a.hostname);
    var visitEntry = new istartPageVisitItem();
    visitEntry.setUrl(a.hostname)
        .setStart(timestampStart)
        .setcompleteUrl(url)
        .setTabId(tabid);
    console.log('STORE THE DATA FOR NEW STUFF', a.hostname,  ' SAVE THE DATA');
    db.visited
        .add({
            url: visitEntry.getUrl(),
            tabId: visitEntry.getTabId(),
            start:visitEntry.getStart(),
            completeUrl:visitEntry.getcompleteUrl()
        });
};

istartPageVisitItem.stopVisitiEntry = function(timestampStop, url, tabid) {
    var a = document.createElement('a');
    a.href = url;
    console.log(a.hostname);
    db.visited
        .filter(function(item) {
            var rv = false;
            //console.log(item);
            if(item.url != a.hostname && item.tabId == tabid) {
                rv = true;
            }
            return rv;

        })
        .each(function(visited){
            if (visited.duration) {
            } else {
                if(visited.url != a.hostname) {
                    //problem wir haben hier nur einen identifyier
                    console.log(visited.url, a.hostname, 'TWO THINGs');
                    //calc end timing and store this item. And create a new item
                    var endtime = timestampStop;
                    var duration =   endtime - visited.start;
                    visited.duration = duration;
                    visited.stop = endtime;
                    db.visited.update(visited.id, visited).then(function(updated) {
                            if(updated) {
                                console.log("updated", updated, visited.id);
                            }
                            console.log('create new item');
                            istartPageVisitItem.createVisitEntry(timestampStop, url, tabid);
                    });
                    /**
                     * db.friends.update(2, {name: "Number 2"}).then(function (updated) {
                        if (updated)
                            console.log ("Friend number 2 was renamed to "Number 2");
                        else
                            console.log ("Nothing was updated - there were no friend with primary key: 2");
                        });
                     */
                }
            }
        }

    );
    /**
     * load here the entry with filters on url and tabid
     */
  //  this.setDuration(this.getStart() - this.getEnd);
};

istartPageVisitItem.prototype.init = function(url) {

};

istartPageVisitItem.prototype.setTabId = function(tabId) {
    this.tabId = tabId;
    return this;
};
istartPageVisitItem.prototype.setUrl = function(url) {
    this.url = url;
    return this;
};
istartPageVisitItem.prototype.setcompleteUrl = function(url) {
    this.completeUrl = url;
    return this;
};

istartPageVisitItem.prototype.setEnd = function(timestamp) {
    this.end = timestamp;
    return this;
};
istartPageVisitItem.prototype.setStart = function(timestamp) {
    this.start = timestamp;
    return this;
};
istartPageVisitItem.prototype.getUrl = function() {
    return this.url;
};
istartPageVisitItem.prototype.getEnd = function() {
    return this.end;
};
istartPageVisitItem.prototype.getStart = function() {
    return this.start;
};
istartPageVisitItem.prototype.getcompleteUrl = function() {
    return this.completeUrl;

};

istartPageVisitItem.prototype.setDuration = function(duration) {
    this.duration = duration; //in s
    return this;
};

istartPageVisitItem.prototype.getTabId = function() {
    return this.tabId;
};