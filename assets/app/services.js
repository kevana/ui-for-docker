'use strict';

angular.module('citadel.services', ['ngResource'])
    .factory('Hosts', function ($resource) {
        return $resource('/api/hosts/:name/:action', {}, {
            query: {
                method: 'GET',
                isArray: true,
                params: {
                    name: "@name"
                }
            },
            metrics: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'metrics',
                    name: "@name"
                }
            },
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
            metrics: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'metrics',
                    name: "@name"
                }
            }
        });
    })
    .factory('Tasks', function ($resource) {
        return $resource('/api/tasks/:action', {}, {
            add: {
                method: 'POST'
            },
            containerStop: {
                method: 'POST'
            },
        });
    });
