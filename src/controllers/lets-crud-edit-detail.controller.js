(function () {
    'use strict';

    var module = angular.module('letsAngular');

    module.controller('CRUDEditDetailController', function ($scope, $controller, Restangular, $stateParams, $timeout, headers, $rootScope, $modalInstance, ngToast) {
        $controller('CRUDEditController', {$scope:$scope, module:module});

        $scope.headers = headers;
        $scope.resource = Restangular.all(headers.route);
       
        var parentScope = headers.parentScope;
        delete headers.parentScope;
        if(headers.modal_id){
            $rootScope.$emit('open:'+headers.modal_id+'', $scope); // @deprecated 

            if (parentScope){
                parentScope.$emit('open:'+headers.modal_id+'', $scope);
            }
        }

        $scope.fetchData(headers.id, true);

        $scope.submit = function(){
            $scope._submit(this, true);
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('success');
        };

    });

})();