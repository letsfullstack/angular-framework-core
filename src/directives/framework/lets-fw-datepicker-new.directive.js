(function () {
	'use strict';

	angular.module('letsAngular').directive('newDatePicker', newDatePicker);

	newDatePicker.$inject = ['$compile', 'jQuery'];

	function newDatePicker($compile, jQuery) {
		var controllerName = 'vm';
		return {
			restrict: 'A',
			require: '?ngModel',
			scope: true,
			terminal: true,
			priority: 1,
			compile: function (element, attrs) {
				var wrapper = angular.element(`
					<div class="input-group">
						<span class="input-group-btn">
							
						<button type="button" class="btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>
						</span>
					</div>`);

				function setAttributeIfNotExists(name, value) {
					var oldValue = element.attr(name);
					if (!angular.isDefined(oldValue) || oldValue === false) {
						element.attr(name, value);
					}
				}
				// console.log({controllerName: controllerName});

				controllerName = Object.assign(controllerName, options);
				console.log({obj_: controllerName});
				// setAttributeIfNotExists('type', 'text');
				// setAttributeIfNotExists('is-open', controllerName + '.popupOpen');
				// setAttributeIfNotExists('show-button-bar', false);
				// setAttributeIfNotExists('show-weeks', false);
				// setAttributeIfNotExists('datepicker-options', 'datepickerOptions');

				element.addClass('form-control');
				element.removeAttr('new-date-picker');
				element.after(wrapper);
				wrapper.prepend(element);

				return function (scope, element) {
					// var options = {
					// 	locale: {
					// 		format: 'DD/MM/YYYY',
					// 		minYear: 1901,
					// 		maxYear: parseInt(moment().format('YYYY'), 10),
					// 		applyLabel: 'Aplicar',
					// 		cancelLabel: 'Cancelar',
					// 		daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
					// 		monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
					// 	},
					// 	singleDatePicker: true,
					// 	showDropdowns: false,
					// 	timePicker: false,
					// 	firstDay: 1,
					// };

					if (scope.data === undefined) scope.data = {};

					// if (!scope.field) {
					// 	scope.field = {customOptions: []};
					// 	if (attrs.fwDatePickerNgModelParent) {
					// 		options.initDate = new Date(scope.$parent[attrs.ngModel]);
					// 		scope.$parent[attrs.ngModel] = angular.copy(options.initDate);
					// 	} else {
					// 		options.initDate = new Date(scope[attrs.ngModel]);
					// 		scope[attrs.ngModel] = angular.copy(options.initDate);
					// 	}
					// } else if (scope.data[scope.field.name] != null) {
					// 	options.initDate = new Date(scope.data[scope.field.name]);
					// 	scope.data[scope.field.name] = angular.copy(options.initDate);
					// }

					// var format = 'dd/MM/yyyy';

					// if (scope.field.customOptions.monthpicker !== undefined) {
					// 	options.datepickerMode = "'month'";
					// 	options.minMode = 'month';

					// 	format = 'MM/yyyy';
					// }

					// element.find('input').attr('datepicker-popup', format);

					// element.find('input').blur(function () {
					// 	if (!moment(this.value, format).isValid() && this.value !== '') {
					// 		scope.field.error = true;
					// 	} else {
					// 		scope.field.error = false;
					// 	}
					// });

					// element.find('input').focus(function (e) {
					//     scope.vm.openPopup(e);
					// });

					scope.dateRangePicker = {
						date: {startDate: moment().subtract(1, 'years'), endDate: moment().add(1, 'years')},
						picker: null,
						singleDatePicker: true,
						options: {
							pickerClasses: 'custom-display',
							buttonClasses: 'btn',
							applyButtonClasses: 'btn-primary',
							cancelButtonClasses: 'btn-danger',
							locale: {
								applyLabel: 'Aplicar',
								cancelLabel: 'Cancelar',
								daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
								monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
								customRangeLabel: 'Custom range',
								separator: '/',
								format: 'DD/MM/YYYY',
								minYear: 1901,
								maxYear: parseInt(moment().format('YYYY'), 10), //will give you 2017-01-06
							},
							// ranges: {
							// 	'Last 7 Days': [moment().subtract(6, 'days'), moment()],
							// 	'Last 30 Days': [moment().subtract(29, 'days'), moment()],
							// },
							eventHandlers: {
								'apply.daterangepicker': function (event, picker) {
									console.log('applied');
								},
							},
						},
					};
					$compile(element)(scope);
				};
			},
			controller: function ($scope) {
				// this.popupOpen = false;
				// this.openPopup = function ($event) {
				// 	$event.preventDefault();
				// 	$event.stopPropagation();
				// 	this.popupOpen = true;
				// };
			},
			controllerAs: controllerName,
		};
	}
})();
