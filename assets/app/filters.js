'use strict';

angular.module('dockerui.filters', [])
    .filter('servicestatus', function () {
        return function (status) {
            switch (status.status) {
            case 'stopped':
                return 'error';
            default:
                return 'positive';
            }
        };
    })
    .filter('viewports', function () {
        return function (ports) {
            var result = [];
            angular.forEach(ports, function (p) {
                result.push(p.port);
            });
            return result.join(',');
        };
    })
    .filter('truncate', function () {
        return function (t) {
            if (t.length < 12) {
                return t;
            }

            return t.substring(0, 12);
        };
    });