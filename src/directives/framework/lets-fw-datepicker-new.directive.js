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
				var _input = element.find('input');

				// var wrapper = angular.element('<span></span>');
				var wrapper = angular.element('<div class="input-group">' + '<span class="input-group-btn">' + '<button type="button" class="btn btn-default" ng-click="' + controllerName + '.openPopup($event)"><i class="glyphicon glyphicon-calendar"></i></button>' + '</span>' + '</div>');
				// function setAttributeIfNotExists(name, value) {
				// 	var oldValue = element.attr(name);
				// 	if (!angular.isDefined(oldValue) || oldValue === false) {
				// 		element.attr(name, value);
				// 	}
				// }
				// element.addClass('form-control');
				// setAttributeIfNotExists('picker-open"', controllerName + '.popupOpen');
				element.removeAttr('new-date-picker');

				element.after(wrapper);

				wrapper.prepend(element);
				return function (scope, element) {
					// console.log(attrs, element, element, _input, scope);

					// scope.dateRangePicker = $(element);

					if (scope.data === undefined) scope.data = {};

					// var tmp_id = element.find('input');
					// setTimeout(function () {
					// 	this.input_id = 'input#' + tmp_id.get(0).name;
					// }, 300);

					element.find('input').blur(function () {
						if (!moment(this.value, format).isValid() && this.value !== '') {
							scope.field.error = true;
						} else {
							scope.field.error = false;
						}
					});
					$compile(element)(scope);
				};
			},
			controller: function ($scope) {
				this.popupOpen = false;
				this.openPopup = function ($event, id) {
					$event.preventDefault();
					$event.stopPropagation();
					console.log('newDatePicker42', $scope);
					console.log('newDatePicker_id', id);
					console.log('newDatePicker_sid', $event);

					// $(input_id).click();
					this.popupOpen = true;
				};
			},
			controllerAs: controllerName,
		};
	}
})();
