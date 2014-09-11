'use strict';

angular.module('citadel.filters', [])
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
    .filter('truncate', function () {
        return function (t) {
            if (t.length < 12) {
                return t;
            }

            return t.substring(0, 12);
        };
    });