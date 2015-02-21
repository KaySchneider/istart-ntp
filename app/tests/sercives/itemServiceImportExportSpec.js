'use strict';
describe('Unit: item Services Import Export Test', function() {
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
            chrome.storage.local.set({'istart':JSON.stringify(defaultdata)});

        })
    );

    it('should create istartBackup when write back the import: Method writeBackImport', function() {
        var importArray=[
            [

                [
                    {
                        "w": 2,
                        "h": 1,
                        "link": "http://maps.google.com",
                        "icon": "googleplaces",
                        "label": "Maps",
                        "color": "blue",
                        "uuid": "test"
                    }
                ]
            ]
        ];
        matrix.writeBackImport(importArray);
        chrome.storage.local.get('istartbackup', function(data){
           try {
                var test = JSON.parse(JSON.parse(data.istartbackup).istart);
                expect(test).toEqual(importArray);
           } catch(e) {
                console.error(e, 'istartbackup');
           }
        });
    });

    it('Test the import check Method with broken data', function() {
        var importString = '[{w:1,h:1,link:"gooogle.de"}]]'; //json parse brokes with unexpected token error
        expect(matrix.checkImportMatrix(importString)).toBeFalsy();
    });

    it('Test the import check Method with an wrong dataset', function() {
        var importString = '[[{w:1,h:1,link:"gooogle.de",uuid:"2323233"}]]';
        expect(matrix.checkImportMatrix(importString)).toBeFalsy();
    });

    it('Test the import check Method with defect dataset without uuid attribute', function() {
        var importString = '[[[{"w":2,"h":1,"link":"http://maps.google.com","icon":"googleplaces","label":"Maps","color":"blue"}]]]';
        expect(matrix.checkImportMatrix(importString)).toBeFalsy();
    });

    it('Test the import check Method with working dataset ', function() {
        var importString = '[[[{"w":2,"h":1,"link":"http://maps.google.com","icon":"googleplaces","label":"Maps","color":"blue","uuid":"test"}]]]';
        expect(matrix.checkImportMatrix(importString)).toBeTruthy();
    });

    /**
     * TODO make an test with an large dataset to import and check the timings the script
     * need to import this kind of data
     */

    afterEach(function() {
        chrome.storage.clearAll();
    });
});

