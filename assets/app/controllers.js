'use strict';

// Page header that displays the totals for the cluster
function HeaderController($scope, Engines, Containers) {
    $scope.template = 'partials/header.html';

    Engines.query({}, function (d) {
        $scope.engines = d.length;
    });

    Containers.query({}, function (d) {
        $scope.containers = d.length;
    });
}

// Dashboard includes overall information with graphs and services 
// for the cluster
function DashboardController($scope) {}

function ContainersController($scope, Containers) {
    $scope.template = 'partials/containers.html';
    $scope.predicate = '-instances';

    $scope.deploy = function () {
        $('#deploy-modal').modal('show', {
            onApprove: function () {
                console.log("approve");
            }
        });
    };

    Containers.query({}, function (data) {
        var groups = {};
        angular.forEach(data, function (v) {
            if (groups[v.image.name] === null || groups[v.image.name] === undefined) {
                groups[v.image.name] = [];
            }

            var c = groups[v.image.name];
            c.push(v);
        });


        var containers = [];
        angular.forEach(groups, function (v, k) {
            var cpus = 0;
            var memory = 0;

            angular.forEach(v, function (c) {
                cpus += c.image.cpus;
                memory += c.image.memory;
            });

            containers.push({
                image: k,
                instances: v.length,
                cpus: cpus || 0,
                memory: memory || 0
            });
        });

        $scope.containers = containers;
    });
}

function ContainerController($scope, $routeParams, $location, Containers) {
    $scope.template = 'partials/container.html';

    $scope.image = $routeParams.name;

    Containers.query({}, function (d) {
        var containers = [];

        angular.forEach(d, function (v) {
            if (v.image.name == $routeParams.name) {
                containers.push(v);
            }
        });

        $scope.containers = containers;
    });

    $scope.stop = function (container) {
        $location.path("/containers");
    };

    $scope.restart = function (container) {
        $location.path("/containers");
    };

    $scope.destroy = function (container) {
        $location.path("/containers");
    };
}

// InspectController displays the information for a single container
function InspectController($scope, $routeParams, Containers) {
    $scope.template = 'partials/inspect.html';

    Containers.query({
        name: $routeParams.id
    }, function (c) {
        $scope.container = c[0];
    });
}

function DeployController($scope, $routeParams, $location, Engines, Containers) {
    $scope.template = 'partials/deploy.html';

    $scope.init = function () {
        $('.ui.dropdown').dropdown();
        $('.ui.radio.checkbox')
            .checkbox();
        $('.ui.checkbox')
            .checkbox();
    };

    $scope.master = {
        environment: '',
        args: '',
        volumes: '',
        cpus: 0.1,
        memory: 32,
        host: ''
    };

    $scope.toggleRestart = function () {
        $scope.container.restart = !$scope.container.restart;
    };

    Engines.query({
        name: $routeParams.id
    }, function (data) {
        $scope.hosts = data;
    });

    $scope.select = function (host) {
        $scope.container.host = host.id;
    };

    $scope.setmode = function (mode) {
        $scope.container.mode = mode;
    };

    $scope.setrestart = function () {
        if ($scope.container.restart) {
            $scope.container.restart = false;

            return;
        }

        $scope.container.restart = true;
    };

    $scope.launch = function () {
        var c = $scope.container;
        var data = {
            cpus: c.cpus,
            memory: c.memory,
            restart_policy: {},
            network_mode: c.mode,
            environment: {},
            args: [],
            name: c.image,
            container_name: c.name
        };

        if (c.restart) {
            data.restart_policy.name = 'always';
        }

        if (c.host !== '') {
            data.labels = ['host:' + c.host];
        }

        if (c.environment !== '') {
            angular.forEach(c.environment.split(' '), function (e) {
                var parts = e.split('=');
                data.environment[parts[0]] = parts[1];
            });
        }

        if (c.args !== '') {
            data.args = JSON.parse(c.args);
        }

        Containers.start(data, function (container) {
            $location.path('/#/inspect/' + container.id);
        });
    };

    $scope.container = angular.copy($scope.master);
}