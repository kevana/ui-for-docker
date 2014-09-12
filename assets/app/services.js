'use strict';

angular.module('dockerui.services', ['ngResource'])
    .factory('Engines', function ($resource) {
        return $resource('/api/engines/:name/:action', {}, {
            query: {
                method: 'GET',
                isArray: true,
                params: {
                    name: "@name"
                }
            }
        });
    })
    .factory('Containers', function ($resource) {
        return $resource('/api/containers/:name/:action', {}, {
            query: {
                method: 'GET',
                isArray: true,
                params: {
                    name: "@name"
                }
            },
            start: {
                method: 'POST'
            }
        });
    });