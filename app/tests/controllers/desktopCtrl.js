describe('Unit: DesktopCtrl', function() {
    // Our tests will go here
    beforeEach(module('istart'));
    /**
     * override the chrome.getMessage Object
     *
     */
    var dfM = [[[{"w":2,"h":1,"link":"http://maps.google.com","icon":"googleplaces","label":"Maps","color":"blue","uuid":"1f51d649-11fb-96ce-2576-8631195c3273"}],[{"name":"youtube search","description":"Search facebook directly from the tile","iswidget":true,"issearch":true,"config":{"tld":["com"],"domain":"www.youtube","url":"/results?search_query={{search}}","defaultld":["com"],"color":"orange","label":"youtube","icon":"youtube","useredit":["color"],"link":"http://www.youtube.com?tag="},"extensionid":"youtubesearch","src":false,"multiple":false,"min_width":2,"min_height":2,"w":2,"h":2,"color":"orange","uuid":"2664e4d9-b5cd-6b0b-32be-df1733d74dc2"}],[{"w":1,"h":1,"color":"#b81c46","icon":"mail","link":"http://mail.google.com","label":"G-Mail","uuid":"839f1db6-ac6a-19b8-8c7f-1fa5dd8dc94a"}]]];


    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    //$scope, matrix, $window, $location, internalUrlLoader, $mdSidenav, $rootScope
    beforeEach(inject(function($controller, $rootScope, matrix,
                               $window, $location, internalUrlLoader,
                               $mdSidenav, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        chrome.storage.local.set({'istart': JSON.stringify(dfM)});
        scope = $rootScope.$new();

        // Create the controller
        ctrl = $controller('desktopCtrl', {
            $scope: scope
        });
    }));

    it('load the tiles from local storage',
        function() {
            scope.$digest();
            expect(scope.items).toEqual(dfM);
    });

    it('should read the items from dom when resort event happens',
        function() {
            expect(scope.maTemp).toEqual([]);
            scope.$digest();
            var event = new Event('resort');
            window.dispatchEvent(event);
            scope.$digest();
            expect(scope.maTemp).toEqual(dfM);
    });

});
