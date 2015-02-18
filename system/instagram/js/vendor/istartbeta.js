/**
 *  This is an earlie beta state from the client library for also
 *  external developers.
 *  If you are an developer you can develop your own widget in the "system" folder
 *  of "iStart"
 *  Be careful because the API can be changed by some updates the next times.
 *  This is an "working" draft of the API implementation.
 * @author: iStart "kay Schneider" https://google.com/+KaySchneider <kayoliver82@gmail.com>
 * @version: 0.0.2
 * feel free to contact me with question about the API or something else you like to know
 */

var istartApi =  {
    currentTabId:0,
    extensionUrl : chrome.extension.getURL('system/instagram/html/instaWidget.html'),

    injectCss: function () {
        var dom=document.getElementsByTagName('head')[0];
        var fragment = document.createDocumentFragment();
        var fontsCss = istartApi.createCssNode('system/topsites/html/css/icomoon.css');
        fragment.appendChild(fontsCss);
        dom.appendChild(fragment);
     },

    createCssNode : function (fileName) {
        var cssNode = document.createElement('link');
        cssNode.setAttribute('href', chrome.extension.getURL(fileName));
        cssNode.setAttribute('type','text/css');
        cssNode.setAttribute('rel','stylesheet');
        return cssNode;
    },

    addEventListener: function () {
        var backButtons = document.getElementsByClassName('win-backbutton');
        for(var i in backButtons) {
            backButtons[0].addEventListener('click', function(e) {
                istartApi.backButtonAction(e);
            },true);
        }

    },
    /**
     * now we block with this call the events from the host and
     */
    blockHostEvents:function () {

    },
    /**
     * sends to the mainApplication an call that this iframe could be closed!
     */
     backButtonAction: function (eventCall) {
        //send message
        istartApi.sendMessageToHost();
     },

    /**
     * sends an message to the host that he can close the current active iframe!
     * for security reason we should send an iframe id or an secret... whatever
     * @param <Object> messageObject
     */
    sendMessageToHost: function(messageObject) {
        chrome.runtime.sendMessage({cmd: "close",url:istartApi.extensionUrl,tabId:istartApi.currentTabId}, function(response) {
            //filter the message direct here
            if(response.url !== istartApi.extensionUrl) {
                return false;
            }
            if(response.response==='ok') {
                ////console.log('everything is fine, we become closed');
            } else {
                ////console.log("wahuu...something is gone wrong");
            }
        });
    },

    sendGlobalMessage: function (messageArgs) {
        messageObj = {cmd: "close",url:istartApi.extensionUrl};

        for(var item in messageArgs) {
          //  //console.log(messageArgs);
        }

/**        chrome.runtime.sendMessage(, function(response) {
            //filter the message direct here
            if(response.url !== extensionUrl) {
                return false;
            }
            if(response.response==='ok') {
                //console.log('everything is fine, we become closed');
            } else {
                //console.log("wahuu...something is gone wrong");
            }
        }); */
    },
    /**
     * set the current tab id for sending the data to the correct script!
     */
    setCurrentTabId:chrome.tabs.getCurrent(
        function (configuration) {
            istartApi.currentTabId = configuration.id;
        }
    ),

    /**
     * helps you to calculate the correct
     * canvas size for you app contents
     * it checks the screen size and the size of your content
     * After that it calculates the correct resizing of your app contentsElements
     * @params <Object> options
     *  'itemSize': {
            width:314,
            height:230
        },
     'itemsCount':itemsCount
     */
    appCalculateScreenSize: function (options) {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        //calculate the min width for reordering the tiles
        //how many objects can we add in one row
        var minWidth =  Math.floor( y / options.itemSize.height );
        var minLines = Math.ceil( options.itemsCount / minWidth );
        //calculate the new width of the canvas
        var minWidth = Math.ceil( options.itemSize.width * minLines);
        //set the appConitent
        var ac = document.getElementsByClassName('appcontainer')[0];
        var acc = document.getElementsByClassName('appcontent')[0];
        ac.setAttribute('style', ac.getAttribute('style') + ';' + 'width:' + (minWidth+100)+ 'px;');
        acc.setAttribute('style', ac.getAttribute('style') + ';' + 'width:' + minWidth+ 'px;');
    },

    launchlink: function (data) {
        chrome.runtime.sendMessage({cmd: "launchlink",url:istartApi.extensionUrl,launchlink:data.getAttribute('linkto'),tabId:istartApi.currentTabId}, function(response) {
            //filter the message direct here
            if(response.url !== istartApi.extensionUrl) {
                return false;
            }
            if(response.response==='ok') {
                //console.log('everything is fine');
            } else {
                //console.log("wahuu...something is gone wrong");
            }
        });
    },
    afterLoad: function () {
        istartApi.addEventListener();
        chrome.runtime.sendMessage({cmd: "register",url:istartApi.extensionUrl,tabId:istartApi.currentTabId}, function(response) {
            //filter the message direct here
            if(response.url !== istartApi.extensionUrl) {
                return false;
            }
            if(response.response==='ok') {
             //   //console.log('everything is fine');
            } else {
               // //console.log("wahuu...something is gone wrong");
            }
        });
    }
};

//istartApi.injectCss();


