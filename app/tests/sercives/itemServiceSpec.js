'use strict';
describe('Unit: item Services', function() {
    beforeEach(module('istart'));
    var matrix, backgroundMessage, $window, $http, $rootScope, httpBackend, defaultdata, scope;
    beforeEach(inject(function(_matrix_,_backgroundMessage_,_$window_,_$http_,_$rootScope_, $httpBackend) {
            matrix = _matrix_;
            $http=_$http_;
            $rootScope=_$rootScope_;
            httpBackend=$httpBackend;
            scope = $rootScope.$new();
            defaultdata=[
                [

                    [
                        {
                            "w": 2,
                            "h": 1,
                            "link": "http://maps.google.com",
                            "icon": "googleplaces",
                            "label": "Maps",
                            "color": "blue"
                        }
                    ]
                ]
            ];
        })
    );

    it('should call http get when the local storage container is empty', function() {
        httpBackend.whenGET("../app/defaultTiles.json")
            .respond([
                [

                    [
                        {
                            "w": 2,
                            "h": 1,
                            "link": "http://maps.google.com",
                            "icon": "googleplaces",
                            "label": "Maps",
                            "color": "blue"
                        }
                    ]
                ]
            ]);
        /**
         * mock only for this test!
         */
        chrome.storage.clearAll();
        spyOn($http,'get');
        matrix.getLocalData().then(function(data) {
        });
        $rootScope.$digest();
        expect($http.get).toHaveBeenCalled();
    });
    it('Check if we load the default tiles when nothing is locally set!', function() {
        httpBackend.whenGET("../app/defaultTiles.json")
            .respond([
                [

                    [
                        {
                            "w": 2,
                            "h": 1,
                            "link": "http://maps.google.com",
                            "icon": "googleplaces",
                            "label": "Maps",
                            "color": "blue",
                            "uuid": "8989889899"
                        }
                    ]
                ]
            ]);
        httpBackend.expectGET('../app/defaultTiles.json');
        matrix.getLocalData().then(function(data) {
            expect(data[0][0][0].w).toEqual(2);
        });
        $rootScope.$digest();
        httpBackend.flush();
    });

    afterEach(function() {
        chrome.storage.clearAll();
    });
});
