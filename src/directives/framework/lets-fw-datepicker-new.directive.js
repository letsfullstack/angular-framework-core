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
			link: {
				post: function postLink(scope, element, attrs, controller) {
					try {
						element.addClass('form-control');
						var tmp = JSON.parse(attrs.field);
						var singleDatePicker = true;
						if (typeof tmp.filter == 'object' && tmp.filter.range === true && tmp.filter._edit === true) {
							singleDatePicker = false;
						}
						var startDate = moment().startOf('month');
						var endDate = moment();
						// tudo e muito feio daqui para baixo
						var _date = !singleDatePicker ? '{date: {startDate: ' + startDate + ', endDate: ' + endDate + ' },  ' : '{';
						var options =
							_date +
							' 		minYear: 1901,' +
							"		maxYear: parseInt(moment().format('YYYY'), 10)," +
							"		applyButtonClasses: 'btn-primary'," +
							"		cancelButtonClasses: 'btn-default'," +
							'		showDropdowns: false,' +
							'		singleDatePicker:' +
							singleDatePicker +
							',' +
							'		locale: {' +
							"			format: 'DD/MM/YYYY'," +
							"			separator: ' - '," +
							"			applyLabel: 'Aplicar'," +
							"			cancelLabel: 'Cancelar'," +
							"			daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']," +
							"			monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']," +
							'		},' +
							'	}';
						if (!singleDatePicker) {
							element.attr('placeholder', 'DD/MM/YYYY - DD/MM/YYYY');
						} else {
							element.attr('placeholder', 'DD/MM/YYYY');
						}
						element.attr('options', options.toString());
						element.removeAttr('new-date-picker');
					} catch (error) {
						console.error(error);
					}
					element.on('show.daterangepicker', function ($event, picker) {
						// foi necessario para inicia com algum valor quando for filtro. caso nao seja singleDatePicker
						if (!singleDatePicker) {
							picker.setStartDate(startDate);
							picker.setEndDate(endDate);
						}
					});
					$compile(element)(scope);
				},
			},
			controller: function ($scope) {},
			controllerAs: controllerName,
		};
	}
})();
