(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwDetailData', fwDetailData);

    fwDetailData.$inject = ['$timeout', '$compile', 'jQuery', '$sce'];

    function fwDetailData($timeout, $compile, jQuery, $sce) {
        return {
            restrict: 'E',
            scope: true,
            template: '<span">{{ formatData(detail_data, field) }}</span>',
            replace: true,
            link: {
                pre: function preLink(scope, $el, attrs, controller) {
                   
                    scope.formatData = function (data, field) {

                        if (field.autocomplete !== false){
                            return data[field.name+ '.label'].label || data[field.name+ '.label'];
                        }

                        return data[field.name];

                    }
                    
                }
            }
        }
    }
})();