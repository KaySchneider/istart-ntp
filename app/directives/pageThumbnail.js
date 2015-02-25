'use strict';
/**
 * Created by ikay on 09.02.15.
 *
 */
'use strict';

var app = angular.module('istartMetroDirective');
app.directive('pageThumbnail', function() {
    return {
        template: '<img src="{{dataUrl}}" height="100px"/>',
        restrict: 'E',
        replace: true,
        scope: {
            url:'=url'
        },
        controller: ['$scope' , '$rootScope','matrix', '$http','backgroundMessage',
            function ($scope, $rootScope,matrix, $http, backgroundMessage) {
                $scope.ma = matrix;
                $scope.msg = backgroundMessage;
                $scope.loadtest = function(url) {
                    $scope.msg.message.connect(
                        $scope.msg.message.getMessageSkeleton('getThumbnail', {hostname:url})
                    ).then(function(data) {
                            $scope.dataUrl=data.thumbnail;
                            console.log(data, 'THUMBNAIL');
                        })
                };
                $scope.loadtest($scope.url);
            }]
    }
});
