(function () {
	'use strict';

	angular.module('letsAngular').directive('fwInput', fwInput);

	fwInput.$inject = ['viaCEP', '$timeout', '$compile', 'jQuery', '$sce'];

	function fwInput(viaCEP, $timeout, $compile, jQuery, $sce) {
		return {
			restrict: 'E',
			scope: true,
			templateUrl: 'lets/views/framework/input.html',
			replace: true,
			link: {
				pre: function preLink(scope, $el, attrs, controller) {
					var dataVar = $el.attr('fw-data');

					if (scope.field && scope.field.customOptions && typeof scope.field.customOptions == 'object' && !scope.field.customOptions.events) {
						scope.field.customOptions['events'] = {};
					}

					scope.fieldHtml = function () {
						return $sce.trustAsHtml(scope.field.toString());
					};

					if (dataVar != 'data') {
						scope.data = scope[dataVar];
					}
					// console.log('scopes', scope, dataVar);

					if (dataVar == 'detail_data') {
						var detail = scope.detail_key;

						if (scope.field && scope.field.autocomplete !== false) {
							scope.autocomplete = function (field, val) {
								return scope.autocompleteDetail(detail, field, val);
							};

							scope.autocompleteSelect = function ($item, $model, $label) {
								return scope.autocompleteDetailSelect(detail, $item, $model, $label);
							};
						}

						if (scope.field && scope.field.customOptions && scope.field.customOptions.file != undefined) {
							scope.download = function (field, id) {
								return scope.downloadDetail(detail, field, id, scope.data);
							};
						}
					}

					// if (scope.type == 'date') {
					// 	console.log(scope, $el, attrs, controller, dataVar);
					// 	scope.options = {
					// 		date: {startDate: moment().subtract(1, 'years'), endDate: moment().add(1, 'years')},
					// 		picker: null,
					// 		options: {
					// 			pickerClasses: 'custom-display', //angular-daterangepicker extra
					// 			buttonClasses: 'btn',
					// 			applyButtonClasses: 'btn-primary',
					// 			cancelButtonClasses: 'btn-danger',
					// 			locale: {
					// 				separator: ' - ',
					// 				format: 'DD/MM/YYYY',
					// 				applyLabel: 'Aplicar',
					// 				cancelLabel: 'Cancelar',
					// 				daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
					// 				monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
					// 			},
					// 		},
					// 	};
					// }

					if (scope.field && scope.field.customOptions && scope.field.customOptions.cep != undefined) {
						$el.find('input.main-input').blur(function () {
							var $scope = angular.element(this).scope();

							viaCEP.get(this.value).then(function (response) {
								var map = $scope.field.customOptions.cep;

								$scope.data[map.address] = response.logradouro;
								$scope.data[map.district] = response.bairro;
								$scope.data[map.city] = response.localidade;
								$scope.data[map.state] = response.uf;

								scope.$$phase || scope.$apply();
							});
						});
					} else if (scope.field && scope.field.customOptions && scope.field.customOptions.multiple != undefined && scope.field.customOptions.multiple == true) {
						var a = $compile($el.contents())(scope);
					}

					jQuery($el).on('blur', ':input[ng-model]', function (e) {
						try {
							if (angular.element(this).scope().field.customOptions.events.blur != undefined) {
								angular.element(this).scope().field.customOptions.events.blur.call(this, e);
							}
						} catch (e) {}
					});

					scope.openDate = function (__scope) {
						// console.log(nome, nome);
						console.log({__scope: __scope});
						$('input#' + __scope.name).click();
					};

					scope.isEmpty = function (obj) {
						return Object.keys(obj).length;
					};
				},
			},
		};
	}
})();
