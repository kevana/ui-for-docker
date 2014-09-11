'use strict';

angular.module('citadel.directives', [])
    .directive('remove-image-hover', function () {
        return function (scope, element, attrs) {
            console.log(element);
            angular.element(element).popup({
                on: 'hover'
            });
        };
    });