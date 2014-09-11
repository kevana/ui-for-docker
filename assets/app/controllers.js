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

function DeployController($scope, $routeParams, Engines) {
    $scope.template = 'partials/deploy.html';

    $scope.init = function () {
        $('.ui.dropdown').dropdown();
        $('.ui.radio.checkbox')
            .checkbox();
    };

    $scope.master = {};

    $scope.toggleRestart = function () {
        $scope.container.restart = !$scope.container.restart;
    };

    Engines.query({
        name: $routeParams.id
    }, function (data) {
        $scope.hosts = data;
    });

    $scope.select = function (host) {
        $scope.container.host = host;
    };

    $scope.setmode = function (mode) {
        $scope.container.mode = mode;
    };

    $scope.launch = function () {
        /*
        Tasks.add({
            command: "run",
            host: $scope.selectedHost.id,
            image: $scope.image,
            cpus: $scope.cpus,
            memory: $scope.memory,
            instances: $scope.instances
        });
        */
    };

    $scope.container = angular.copy($scope.master);
}