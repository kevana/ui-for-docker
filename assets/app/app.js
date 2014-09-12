'use strict';

angular.module('dockerui', ['ngRoute', 'dockerui.services', 'dockerui.filters', 'dockerui.directives'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'partials/dashboard.html',
                controller: 'DashboardController'
            });
            $routeProvider.when('/containers/:name*', {
                templateUrl: 'partials/container.html',
                controller: 'ContainerController'
            });
            $routeProvider.when('/inspect/:id', {
                templateUrl: 'partials/inspect.html',
                controller: 'InspectController'
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
    }]);