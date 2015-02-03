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
/**
 * Created by ikay on 31.01.15.
 */

var istartIndexActiveTab = function() {
    /**
     * interface to manage the logic in activeTab DB
     */

};

/**
 * to use instanceOf
 * @type {istartIndexActiveTab}
 */
istartIndexActiveTab.constructor = istartIndexActiveTab;

//static singleton in js **fake**
istartIndexActiveTab.instance = function() {
    if( !(istartIndexActiveTab.currInstance instanceof istartIndexActiveTab)) {
        istartIndexActiveTab.currInstance = new istartIndexActiveTab();
    }
    return istartIndexActiveTab.currInstance;
};

istartIndexActiveTab.currInstance = null;

istartIndexActiveTab.prototype.setActiveTabTo = function(tabId, tabObject) {
    //changes the current tab to tabId
    //check if  tabId exists in DB
    //if not insert here the new tabId information
    //check if the currentTabId was the last active tab, if not, get the last active tab and set active to false
    //call the writeBackMethod on the last active Time with the current timestamp as visit stops
    console.log('try to select the tabId');
    db.activeTab.where('tabId')
        .equals(tabId)
        .count(function(t) {
            console.log(t, '');
            if(t > 0) {
                //here we can add the data direct to the database
                db.activeTab.where('tabId')
                    .equals(tabId)
                    .each(function(item) {
                        istartPageVisitItem.getItemById(item.vId)
                            .then(function(item) {
                                //booh booh... not cool...
                                if(tabObject.url === item.url) {
                                    //the same we can calc
                                } else {
                                    //url has changed inside the active tab  do something
                                }
                            });
                    });
            } else {
                //here we should check what happens to the data override or do nothing or set to active
                console.log('LESS THAN ONE');

                //get the entry from the default database
            }
        });
};





