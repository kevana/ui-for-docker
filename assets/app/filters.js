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
    .filter('geturl', function () {
        return function (container) {
            if (container === null ||
                container === undefined ||
                container.ports === undefined) {
                return '';
            }
            if (container.ports.length !== 1) {
                return '';
            }

            var port = container.ports[0];
            var parser = document.createElement('a');
            parser.href = container.engine.addr;

            return 'http://' + parser.hostname + ':' + port.port.toString();
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