'use strict';
/**
 * Created by ikay on 12.01.15.
 */
var app = angular.module('istartMetroDirective');
app.directive('globalSearchDirective', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '../html/templates/globalSearch.html',
        controller: ['$scope','globalSearchService', 'appLauncher', 'loadpage',
                    '$compile', 'bindKeys', '$rootScope', 'analytics',
        function( $scope, globalSearchService, appLauncher, loadpage, $compile, bindKeys, $rootScope, analytics ) {
            $scope.searchActive=false;
            $scope.gsearchQuery="";
            $scope.resultArea=angular.element('#globalSearchResults');
            $scope.indexActive = 0;
            $scope.resList=[];
            $scope.activeAppClass = 'md-accent red';
            $scope.listItemIdPrefix="globalsearchdiritemfound";
            $scope.checkSize = function(images, needleSizeInt, minSize) {
                if(images.length ==0) {
                    return false;
                }
                var min=false;
                if(typeof (minSize) !== "undefined") {
                    min=true;
                }
                for(var obj in images) {
                    if(images[obj].size === needleSizeInt && min===false) {
                        return images[obj].url;
                    } else if(min===true &&   images[obj].size >= minSize ) {
                        return images[obj].url;
                    }

                }
                return "";
            };

            $scope.launchApp = function(appId) {
                appLauncher
                    .launch({id:appId})
                    .then(function(res) {
                        //console.log(res, 'app launcher');
                    });
            };

            $scope.loadPage = function(url) {

                console.log("LOAD", url, loadpage.checkUrl(url));

                if(loadpage.checkUrl(url)===false) {
                    url ='http://' + url;
                }

                console.log(url, loadpage.checkUrl(url) );

                /**
                 * TODO: fix the protocol check
                 */
                loadpage.loadPage(url)
                    .then(function(result) {
                        //console.log(result);
                    });
            };

            var getLaunchLink = function(url, label) {
                var link = document.createElement('li');
                link.setAttribute('ng-click', "loadPage('"+url+"')");
                var label = document.createTextNode(label);
                link.appendChild(label);
                return link;
            };

            var getLaunchApp = function(appId, label, iconSet) {
                var imgsrc = $scope.checkSize(iconSet, 45,45);
                var link = document.createElement('li');
                link.setAttribute('ng-click', "launchApp('"+appId+"')");
                var label = document.createTextNode(label);
                if(imgsrc!="") {
                    var img = new Image();
                    img.setAttribute('width', '30');
                    img.src=imgsrc;
                    link.appendChild(img);
                }
                link.appendChild(label);
                return link;
            };

            var getIstartItemLabelUrl = function(itemConfig) {
                if(itemConfig.label && itemConfig.link && ! itemConfig.issearch) {
                    return [itemConfig.label, itemConfig.link];
                } else if(itemConfig.config && itemConfig.issearch ===true) {
                    var defaultTld = "com";
                    var link = "";
                    if(  Object.prototype.toString.call( itemConfig.config.defaultld ) === '[object Array]'  ) {
                        defaultTld =itemConfig.config.defaultld[0];
                    } else {
                        defaultTld =itemConfig.config.defaultld;
                    }
                    var link = itemConfig.config.domain + '.' + defaultTld;

                    return [itemConfig.name + "-" + link, link];
                }
            };

            var printResult =function( resultList ) {
                $scope.resList = resultList;
                $scope.indexActive = 0;
                var documentFragment = new DocumentFragment();
                var ul = document.createElement('ul');
                ul.classList.add('searchResultBox');
                for(var index in resultList) {
                    var item = resultList[index];
                    var id= $scope.listItemIdPrefix+ index;
                    if( item.dateAdded ) {
                        var el = getLaunchLink(item.url, item.title);
                        el.setAttribute('id', id);
                        ul.appendChild(el);
                    } else if(item.w) {
                        /**
                         * TODO: add here logic to show also the
                         * search tiles as link result inside the
                         * search results
                         */
                        //is iStart link tile
                        var tmp= getIstartItemLabelUrl(item);
                        var el = getLaunchLink(tmp[1], tmp[0]);
                        el.setAttribute('id', id);
                        ul.appendChild(el);
                    } else if(item.isApp === true && item.enabled == true) {
                        //is app
                        var el = getLaunchApp(item.id, item.name, item.icons);
                        el.setAttribute('id', id);
                        ul.appendChild(el);
                    }
                }

                $scope.resultArea.html("");
                try {
                    $scope.resultArea.html($compile(documentFragment.appendChild(ul))($scope));
                } catch(e) {
                    console.debug(e);
                }

            };

            $scope.$on('$destroy', function() {
                $scope.bindKeys.removecontroller();
                $scope.removeListenerRootScope();
            });

            $scope.removeOldIndex = function() {
                try {
                    angular.element('#'+$scope.listItemIdPrefix+$scope.indexActive).removeClass($scope.activeAppClass);
                } catch(e) {

                }
            };

            $scope.removeListenerRootScope = $rootScope.$on('states', function(states, newal) {
                if(newal.up === true) {
                    if($scope.indexActive>0) {
                        $scope.removeOldIndex();
                        $scope.indexActive--;
                    }
                } else if(newal.down === true) {
                    if($scope.indexActive < $scope.resList.length-1) {
                        $scope.removeOldIndex();
                        $scope.indexActive++;
                    }
                } else if(newal.enter === true) {
                    /**
                     * now we mus evaluate what is to do with
                     * the current ITEM inside the searc
                     */
                    var item = $scope.resList[$scope.indexActive];
                    if(item.iswidget==true && item.issearch==true) {
                        //get link
                        var info = getIstartItemLabelUrl(item);
                        $scope.loadPage(info[1]);
                    }
                    if(item.dateAdded || (item.w && item.link)) {
                        //item is link
                        if(item.url)
                            $scope.loadPage(item.url);
                        if(item.link) {
                            $scope.loadPage(item.link);
                            console.log(item.link);
                        }
                    }
                }
                try {
                    angular.element('#'+$scope.listItemIdPrefix+$scope.indexActive).addClass($scope.activeAppClass);
                } catch(e) {
                    console.debug(e, "SEARCH ADD KEY EVENTS");
                }
            });

            $scope.setResultContainerSize = function() {
                var cw = angular.element('#wrap').css('height');
                console.log(cw);
                angular.element('#globalSearchResults').css('height', cw);
            };

            $scope.$watch('gsearchQuery', function() {
                if($scope.gsearchQuery.length == 0) {

                    $scope.searchActive=false;
                    return;
                }
                $scope.setResultContainerSize();
                $scope.searchActive=true;
                globalSearchService.query($scope.gsearchQuery)
                    .then(function(resultList) {
                        printResult(resultList);
                    });
                analytics.track('globalsearch', 'search', {value:$scope.gsearchQuery});
            });
        }],
        link: function(scope, element, attrs) {

        }
    }
});

