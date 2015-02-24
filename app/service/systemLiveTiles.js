'use strict';
var app  = angular.module('istart');
app.factory('systemLiveTiles', ['$window',function ($window) {
    var widgetPath ='/system/';
    var tiles = [
        [{
            'name':'retro clock',
            'description':'Add an nice retro clock to the system',
            'iswidget':true,
            'src': chrome.extension.getURL( widgetPath + "retroclock/html/widget.html" ),
            'multiple':true, //can be added more than one time into the browser
            'min_width':2,
            'min_height':1,
            'extensionid':'retroclock'
        }],
        [
            {
                "name": 'facebook info widget',
                "description": 'adds message and notification count to iStart on this tile',
                "smartwidget": true,
                "w": 2,
                "h": 1,
                "link": "https://facebook.com",
                "directive":  "facebook-info",
                "label": "facebook",
                "color": "rgb(64, 67, 204)",
                "extensionid":"facebookInfoWidget"
            }
        ]
        /**[{
            'name':'Welcome Tile',
            'description':'Helps you save time during your first steps',
            'iswidget':true,
            'fullscreen':chrome.extension.getURL(widgetPath + '/instagram/html/instaWidget.html#/home'),
            'src':  chrome.extension.getURL(widgetPath + "instagram/html/instaWidget.html"),
            'multiple':true, //can be added more than one time into the browser
            'min_width':2,
            'min_height':2,
            'extensionid':'welcomehey'
        }],
        [{
            'name':'topSites',
            'description':'access fast and easy your topSites',
            'iswidget':true,
            'fullscreen':chrome.extension.getURL(widgetPath + '/topsites/html/fullscreen.html'),
            'src':  chrome.extension.getURL(widgetPath + "topsites/html/widget.html"),
            'multiple':true, //can be added more than one time into the browser
            'min_width':1,
            'min_height':1,
            'extensionid':'topsites'
        }]**/
    ];
    /**
     * returns the current apps list!
     */
    return {
        items: tiles
    }
}]);