var PLACEHOLDER_IMAGE = "loading.gif";

/**
 * we use this code base for two applications and check wich application
 * will perform much better.
 * One "instaWeather"
 * Weather "live" backgrounds from instagramm if the user is online
 *
 * retro "Weather"
 * Weather app in retro Design
 *
 * digital "Weather"
 * Weather in digital nativ design!
 *
 * "pirate" "Weather"
 * Weather in pirate Mode!!
 * --> With arrrs and rooos
 *
 * "social pirate" weather
 * --> share your weather automatically every day one time you watch the weather!
 */
var instagramm_active = true;







var istartliveTileApi = {
    tabid : 0,
    extensionUrl: chrome.extension.getURL('system/instagram/html/instaWidget.html'),
    launchlink: function (data) {
        chrome.runtime.sendMessage({cmd: "launchlink",url:this.extensionUrl,launchlink:data.getAttribute('linkto'),tabId:this.tabId}, function(response) {
            //filter the message direct here
            if(response.url !== extensionUrl) {
                return false;
            }
            if(response.response==='ok') {
                //console.log('everything is fine');
            } else {
                //console.log("wahuu...something is gone wrong");
            }
        });
    }
};
chrome.tabs.getCurrent(function(item)  {
    istartliveTileApi.tabid = item.id;
});


var loadImage = function(uri, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        callback(window.URL.createObjectURL(xhr.response), uri);
    }
    xhr.open('GET', uri, true);
    xhr.send();
}

var defaults = {
    forecast: false,
    time:+new Date(),
    location: 'autoip',
    farenheit: true,
    seconds: true,
    timezone:'Europe/Berlin'
};


angular.module('myApp', ['ngRoute'])

    .provider('ExternalResource', function() {
        this.$get = ['$q', '$http', function($q, $http) {
            var self = this;
            return {
                loadImage: function (uri,allData) {
                    var d = $q.defer();
                    var allData = allData;
                    $http({
                        method: 'GET',
                        url: uri,
                        responseType: 'blob',
                        cache: true
                    }).success(function(data) {
                            var image = window.URL.createObjectURL(data);

                            d.resolve({'blob':image,'all':allData});
                        }).error(function(err) {
                            d.reject(err);
                        });
                    return d.promise;

                }

            }
        }];
    })
    .factory('WelcomeMessages', function() {

        var service = {
            getMessages: function() {
                var messages = [
                    {
                        'id':'welcome',
                        'menuEntry':'welcome',
                        'message':'welcometoistart'

                    },
                    {
                        'id':'clickonme',
                        'menuEntry':'FAQ',
                        'message':'welcomeclickme'

                    },
                    {
                        'id':'clickonme',
                        'menuEntry':'Starting Guide',
                        'message':'tip1',
                        'icon': 'settings'
                    },
                    {
                        'id':'clickonme',
                        'message':'tip2'
                    },
                    {
                        'id':'clickonme',
                        'message':'tip3'
                    },
                    {
                        'id':'clickonme',
                        'message':'tip4'
                    }
                ]
                return messages;
            }
        }

        return service;
    })
    .factory('Menue', function() {

        var service = {
            getMessages: function() {
                var messages = [
                    {
                        'id':'welcome',
                        'menuEntry':'FAQ',
                        'message':'faq',
                        'entry': [
                             {
                                 'title': 'faqmovetitle',
                                 'body': 'faqmovebody'
                             },
                             {
                                 'title': 'faqaddtitle',
                                 'body': 'faqaddbody'
                             },
                             {
                                 'title': 'faqrecentlytitle',
                                 'body': 'faqrecentlybody'
                             }
                         ]
                    },
                    {
                        'id':'kickstart',
                        'menuEntry':'kickstart',
                        'message':'kickstart',
                        'entry': [
                        {
                            'title': 'kickstartrecently',
                            'body': 'faqrecentlybody'
                        },
                        {
                            'title': 'kickstartaddBookmark',
                            'body': 'faqaddbody'
                        },
                        {
                            'title': '',
                            'body':'kickstartlivetile'
                        },
                        {
                            'title': 'faqrecentlytitle',
                            'body': 'faqrecentlybody'
                        }
                    ]
                    },
                    {
                        'id':'support',
                        'menuEntry':'support',
                        'message':'support',
                        'entry': [
                            {
                                'title': 'supportBugFeatureTitle',
                                'body': 'supportBugFeatureBody'
                            },
                            {
                                'title': 'supportShareMeTitle',
                                'body': 'supportShareMeBody'
                            },
                            {
                                'title': 'supportConnectTtitle',
                                'body':'supportConnectBody'
                            },
                            {
                                'title': 'faqrecentlytitle',
                                'body': 'faqrecentlybody'
                            }
                        ]
                    }
                ]
                return messages;
            }
        }

        return service;
    })
    .factory('OfflineStorage', function () {
        //We store the weather data on the localStorage so there is no need to capture every time the weather from the API
        var defaults = {
            forecast: false,
            time:+new Date(),
            location: 'autoip',
            farenheit: true,
            seconds: true,
            timezone:''
        };
        var service = {
            save: function() {
                chrome.storage.local.set({'istartWelcomeTile':'' });
            }
        }

        return service;
    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../templates/home.html',
                controller: 'MainCtrl'
            })
            .when('/home', {
                templateUrl: '../templates/fullscreen.html',
                controller: 'HelpCtrl'
            })
            .otherwise({redirectTo: '/'});
    }])
    .controller('HelpCtrl', ['$scope', '$timeout', '$window','WelcomeMessages',"Menue",
        function($scope, $timeout,$window,WelcomeMessages,Menue) {

            //inform the main app that the extension is run finally in the iframe
            istartApi.afterLoad();
            $scope.menue = Menue.getMessages();
            $scope.contentBox = document.getElementById('contentbox');
            $scope.click = function() {
                for(var el in $scope.contentBox.children ) {
                    //console.log(el,typeof($scope.contentBox.children[el]),$scope.contentBox.children[el] );
                    if(typeof($scope.contentBox.children[el]) === 'object') {
                        try {
                            $scope.contentBox.children[el].classList.add('hidden');
                        } catch(e) {

                        }
                    }
                }
                var id = this.datas.menuEntry;
                //var elementHidden = document.getElementsByClassName('themecontainer');
                document.getElementById(id).classList.remove('hidden');

                return false;
            }

            $scope.checkScrollDirection = function () {
                //check the active element and switch the scroll direction
            }

            $scope.imageBg = WelcomeMessages.getMessages();
            $scope.bgMessageCount = $scope.imageBg.length;
            //document.getElementById("welcome").classList.remove("hidden");

        }])
    .controller('MainCtrl', ['$scope', '$timeout', 'ExternalResource','$window','WelcomeMessages',
        function($scope, $timeout,ExternalResource,$window,WelcomeMessages) {
            $scope.date = {};
            $scope.weather = {}
            $scope.locale = '';
            $scope.imageBg = './img/fog.gif';
            $scope.showImage = 0;
            $scope.bgMessageCount = 0;
            $scope.scrollPos = 0;
            $scope.direction ='right';

            $scope.click = function() {
            $window.scrollPos = $scope.scrollPos;

              var direction = $scope.direction;
                switch(direction) {

                    case 'up':

                        break;
                    case 'down':

                        break;
                    case 'left':
                        if($scope.scrollPos == 0) {
                            $scope.direction = 'right';
                            $timeout($scope.click, 6000);
                            return false;
                        }
                        var stripe = document.getElementById('imagestrip');
                        var num = parseInt( stripe.style.top.replace('%','') )
                        if( isNaN( num ) ) {
                            stripe.style.top =  +100+"%";
                        } else
                            stripe.style.top = num + 100 + "%";
                        $scope.scrollPos--;
                        break;
                    case 'right':
                        if($scope.scrollPos === $scope.bgMessageCount) {
                            $scope.direction = 'left';
                            $timeout($scope.click, 6000);
                            return false;
                        }
                        var stripe = document.getElementById('imagestrip');
                        var num = parseInt( stripe.style.top.replace('%','') )
                        if( isNaN( num ) ) {
                            stripe.style.top =  -100+"%";
                        } else
                            stripe.style.top = num - 100 + "%";
                        $scope.scrollPos++;
                        break;
                }
                $timeout($scope.click, 6000);
            }

            //get the locales for displaying the date
;
            $scope.imageBg = WelcomeMessages.getMessages();
            $scope.bgMessageCount = $scope.imageBg.length;
            //console.log($scope.imageBg);
            $scope.click();

            /**
             * load here the "subtemplates" and the helper message objects!
             *
             *
             */






        }])

    .directive('localimage', function() {
        /**
         * parse the image from weatherunderground.com to an localimage
         * to download other imagesets from weatherunderground you can use
         * my simple nodejs downloader from github:
         * https://github.com/KaySchneider/nimloadhelper
         */
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // wait until after $apply
                scope.variable = attrs.localimage;
                var  fileName = scope.variable.split('/').pop();
                var injectName = './img/' + fileName;
                element[0].src = injectName;
            },
            replace:true
        }
    })
    .directive('loadedimage', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                scope.$watch('imageBg', function(newImage) {

                    var image = document.createElement('img');
                    var width = attrs.imwidth;
                    if(attrs.class == 'true') {
                        image.setAttribute('style','z-index:-100;height:'+width + '%');
                    } else
                        image.setAttribute('style','z-index:-100;height:'+width + '%');
                    image.src =attrs.imsrc;
                    element[0].innerHTML = "";
                    element[0].setAttribute('linkto', scope.imageBg[attrs.imid].link)
                    element[0].appendChild( image );
                    element[0].addEventListener('click', function() {

                        istartliveTileApi.launchlink(this);
                    })
                });
            },
            replace: true

        }
    })
    .directive('i18n', function () {
        /**
         * make use of the chrome.i18n API to localise the application
         * into some languages wich are defined in _locales folder
         */
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                //console.log(element[0],attrs.i18n,chrome.i18n.getMessage(attrs.i18n));
                var translated = chrome.i18n.getMessage(attrs.i18n);
                var height = attrs.imwidth;
                //element[0].setAttribute('style','z-index:-100;height:'+ height + '%');
                element[0].parentNode.setAttribute('style','z-index:-100;height:'+ height + '%');
                element[0].innerHTML = translated;
            },

            replace:true
        }

    })
    .directive('oddcolor', function () {
        /**
         * make use of the chrome.i18n API to localise the application
         * into some languages wich are defined in _locales folder
         */
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                //console.log(element[0],attrs,attrs.oddcolor);
                var index = attrs.oddcolor;
                var classList = 'bg-color-darken';
                if(index % 2 === 1) {
                    classList = 'bg-color-orange';
                }
                //element[0].setAttribute('style','z-index:-100;height:'+ height + '%');
                element[0].parentNode.classList.add(classList);
            },

            replace:true
        }

    })
    .directive('area', function () {
        /**
         * make use of the chrome.i18n API to localise the application
         * into some languages wich are defined in _locales folder
         */
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                //console.log(element[0],attrs,attrs.oddcolor);
                var width = attrs.imwidth;
                //element[0].setAttribute('style','z-index:-100;height:'+ height + '%');
                element[0].parentNode.setAttribute('style','z-index:-100;width:'+ width + '%;height:100%');
            },

            replace:true
        }

    })
;

