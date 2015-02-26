'use strict';
var app = angular.module('istartMetroDirective');
app.directive('selectIcon', ['$compile',function($compile) {
    return {
        restrict: 'E',
        templateUrl: '../html/templates/selectIcon.html',
        controller: ['$scope','iconService', '$compile',
            function($scope, iconService, $compile) {
            //check if we had already registered this appId on this scopes events!
            $scope.systemIcons = [];
            $scope.originIcon = $scope.tileInfo.icon;
            var allElement=null;
            $scope.selectIndex=function($event,index) {
                console.log($event);
                var div_array = Array.prototype.slice.call(allElement)
                div_array.forEach(function(node) {
                    node.classList.remove('editBorder');
                });
                $scope.tileInfo.icon=$scope.systemIcons[index].css;
                document.getElementById('selectIconElement'+index).classList.add('editBorder');
            };
            $scope.showSystemIcons = function() {
                var container = document.getElementById('selectItemInjectRepeat');
                var showIcons = $scope.systemIcons;
                var fragment = document.createDocumentFragment();
                var tmpl = '<span class="{{className}}" id="selectIconElement"><p>{{label}}</p></span>';
                for(var index in showIcons) {
                    var sub = tmpl;
                    var span = document.createElement('span');
                    var p = document.createElement('p');
                    var txt = document.createTextNode(showIcons[index].name);
                    span.classList.add(showIcons[index].css);
                    span.setAttribute('id', 'selectIconElement'+index);
                    span.setAttribute('ng-click', 'selectIndex($event,'+index+')');
                    span.classList.add('selectIcon');
                    p.appendChild(txt);
                    span.appendChild(p);
                    fragment.appendChild(span);
                }
                angular.element(container).html('');
                angular.element(container).html($compile(fragment)($scope));
                allElement = document.getElementsByClassName('selectIcon');
            };

            $scope.loadItems = function() {
                iconService.getSystemIcons().
                    then(function(items) {
                        $scope.systemIcons =items;
                        $scope.showSystemIcons();
                });
            };


        }],
        link: function(scope,element,attr) {
            scope.loadItems();
        }
    }
}]);
