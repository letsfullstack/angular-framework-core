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
			link: function (scope, element, attrs, controller) {
				element.addClass('form-control');
				// setAttributeIfNotExists('picker-open"', controllerName + '.popupOpen');
				element.removeAttr('new-date-picker');

				element.on('click', function ($event) {
					$event.preventDefault();
					$event.stopPropagation();
					console.log(attrs.name);
				});
				$compile(element)(scope);
			},
			controller: function ($scope) {
				console.log('newDate', {scope: $scope});
			},
			controllerAs: controllerName,
		};
	}
})();
