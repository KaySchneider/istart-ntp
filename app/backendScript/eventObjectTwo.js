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
var db = new Dexie('istartV2');


db.version(1)
    .stores({
        visited: '++id,tabId,url,start,end,duration,completeUrl',
        activeTab: '++id,vId,tabId,windowId'
    });
db.version(2)
    .stores({
        visited: '++id,tabId,url,start,end,duration,completeUrl',
        activeTab: '++id,vId,tabId,windowId,active,activestartTimes'
    });
db.version(3)
    .stores({
        visited: '++id,tabId,url,start,end,duration,completeUrl',
        timeMasterUrl: '++id, tabId, url, timestart, timestop, duration', //auswertungs Tabelle Master Referrenz zur Zeitermittlung
        timeSpendOnUrl: '++id, tabId, url, timestart, isActive', //wir messen die Zeit wie lange der Nutzer auf einer URL in den Aktiven Tab hat. somit ist die Zeiterfassung viel Granularer und genauer Bei jedem TabChange event wo sich die URl ändert wird der Eintrag hier gelöscht und in die master Table zurückgeschrieben
        activeTab: '++id,vId,tabId,windowId,active,activestartTimes'
    });
// Open the database
db.open()
    .catch(function(error){
        console.debug('Uh oh : ' + error);
        //delete all!
    });

/*db.friends
    .where('age')
    .below(75)
    .each(function(friend){
        console.log(friend.name);
    });

// or make a new one
db.friends
    .add({
        name: 'Camilla',
        age: 25
    });
*/
