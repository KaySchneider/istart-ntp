'use strict';

describe('Unit: tiles Directive', function() {
    var elm, scope, $compile;

    beforeEach(module('istartMetroDirective'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        // we might move this tpl into an html file as well...
        elm = angular.element(
                '<wrapp><li background-config>' +
                 '<p>test</p>'+
                '</li></wrapp>');
        var $rootScope =_$rootScope_;
        var $compile=_$compile_;
        scope = $rootScope.$new();
        scope.tileInfo = window.testerUnitDefaultTile[0];
        scope.$compile=$compile;
        scope.root = _$rootScope_;
        //$compile(elm)(scope);
        //scope.$digest();
    }));

    it('backGroundConfig should set style attribute on given element and add color from tiles config to it',
    function() {
        var element = scope.$compile(elm)(scope);
        scope.$digest();

        expect(element.html()).toContain("background: " + scope.tileInfo.color);
    });

    it('ngRightEdit should add an click event to the given element. When clicked the element should have and new class',
        function() {
            var element = scope.$compile('<wrapp>' +
                                         '<li ng-right-edit editicon="test">' +
                                         '</li>' +
                                         '</wrapp>'
            )(scope);
            scope.$digest();
            element.find('li').click();
            scope.$digest();
            expect(element.html()).toContain("class=\"editBorder\"");
            element.find('li').click();
            expect(element.html()).not.toContain("class=\"editBorder\"");
    });

    it('ngRightEdit should change the scope.editTile to true or false',
        function() {
            var element = scope.$compile('<wrapp>' +
                    '<li ng-right-edit editicon="test">' +
                    '</li>' +
                    '</wrapp>'
            )(scope);
            scope.$digest();
            element.find('li').click();
            scope.$digest();
            expect(scope.editTile).toBeTruthy();
            element.find('li').click();
            scope.$digest();
            expect(scope.editTile).toBeFalsy();
        });

    it('ngRightEdit should change $rootScope.editTileInfo to the current editTileInfo',
        function() {
            var element = scope.$compile('<wrapp>' +
                    '<li ng-right-edit editicon="test">' +
                    '</li>' +
                    '</wrapp>'
            )(scope);
            scope.$digest();
            element.find('li').click();
            scope.$digest();
            expect(scope.root.editTileInfo).toEqual(scope.tileInfo);
        });

    it('ngRightEdit change the edit mode by clicking another element',
        function() {
            var element = scope.$compile('<wrapp>' +
                    '<li ng-right-edit editicon="test">' +
                    '</li>' +
                    '<li ng-right-edit editicon="test">' +
                    '</li>' +
                    '</wrapp>'
            )(scope);
            scope.$digest();
            element.find('li').click();
            scope.$digest();
            expect(scope.root.editTileInfo).toEqual(scope.tileInfo);
        });
});
