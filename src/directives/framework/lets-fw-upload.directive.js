(function () {
    'use strict';

    angular.module('letsAngular')
        .directive('fwUpload', fwUpload);

    fwUpload.$inject = ['$timeout', 'appSettings', '$sce'];

    function fwUpload($timeout, appSettings, $sce) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element) {

                $scope.f = {};

                var _input = element.find('input[type="hidden"]');

                var STORAGE_URL = appSettings.STORAGE_URL;
                if ($scope.field.customOptions.file.container != undefined) {
                    STORAGE_URL +=$scope.field.customOptions.file.container+"/";
                }

                $scope.isFileImage = function(filename){
                    return !!filename.match(/.(jpg|jpeg|png|gif)$/i)
                }

                $scope.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };

                $scope.$on('setProgressFile', function () {
                    if ($scope.data[$scope.field.name]) {
                        $scope.f = {
                            name:$scope.data[$scope.field.name],
                            progress:100,
                            alreadySent:true,
                            isImage:$scope.isFileImage($scope.data[$scope.field.name])
                        };
                        $scope.f.fileURL = STORAGE_URL+$scope.f.name;
                    }
                });

                $scope.removeFile = function(){
                    $scope.f = {};
                    _input.controller('ngModel').$setViewValue(null);
                }

                $scope.upload = function (file, errFiles) {

                    if(errFiles.length > 0 ){
                        $scope.errFile = errFiles && errFiles[0];
                        errFiles.forEach(function(err){
                            if (err.$error=="pattern"){
                                $scope.field.error = "O formato do arquivo não é permitido."; 
                            }
                        });
                    }

                    if (file) {

                        $scope.field.error = null;
                        $scope.f.name = file.name
                        $scope.f.uploading = true;
                        
                        $scope._upload($scope.field, file).then(function (response, err) {
                            $scope.$emit('upload-complete', response);
                            
                            $timeout(function () {
                                $scope.f.progress = 100;
                                $scope.f.alreadySent = true;
                                $scope.f.uploading = false;
                                $scope.f.name = response.data.result.files.file[0].name;
                                $scope.f.fileURL = STORAGE_URL+$scope.f.name;
                                $scope.f.isImage = $scope.isFileImage($scope.f.name)
                                _input.controller('ngModel').$setViewValue($scope.f.name);
                            });


                        }, function (response) {
                            console.log(response);
                            if (response.status > 0) {
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }
                            $scope.$emit('upload-error', response);

                            $timeout(function(){
                                $scope.field.error = "Ocorreu um erro ao enviar o arquivo.";
                                $scope.f = {};
                            })

                        }, function (evt) {
                            $timeout(function(){
                                $scope.f.progress = Math.min(90, parseInt(100.0 *evt.loaded / evt.total));
                            })
                        })
                    }
                };

                $scope.dropFile = function($file, errFiles){
                    $scope.upload($file, errFiles)
                }

            }
        }
    }
})();
