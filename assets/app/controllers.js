'use strict';

// Page header that displays the totals for the cluster
function HeaderController($scope, Hosts, Containers) {
    $scope.template = 'partials/header.html';

    Hosts.query({}, function (d) {
        $scope.hosts = d.length;
        var cpus = 0;
        var memory = 0;

        angular.forEach(d, function (v) {
            cpus += v.cpus;
            memory += v.memory;
        });

        $scope.cpus = cpus;
        $scope.memory = memory;
    });

    Containers.query({}, function (d) {
        $scope.containers = d.length;
    });
}

// Dashboard includes overall information with graphs and services 
// for the cluster
function DashboardController($scope, Hosts) { }

function HostsController($scope, $routeParams, Hosts) {
    $scope.template = 'partials/hosts.html';

    Hosts.query({
        name: $routeParams.id
    }, function (data) {
        $scope.hosts = data;
    });
}

function ContainersController($scope, Containers) {
    $scope.template = 'partials/containers.html';
    $scope.predicate = '-instances';

    $scope.deploy = function () {
        $('#deploy-modal').modal('show',{
            onApprove: function() {
                console.log("approve");
            }
        });
    };

    Containers.query({}, function (data) {
        var groups = {};
        angular.forEach(data, function (v) {
            if (groups[v.image] === null || groups[v.image] === undefined) {
                groups[v.image] = [];
            }

            var c = groups[v.image];
            c.push(v);
        });


        var containers = [];
        angular.forEach(groups, function (v, k) {
            var cpus = 0;
            var memory = 0;

            angular.forEach(v, function (c) {
                cpus += c.cpus.length;
                memory += c.memory;
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

function ContainerController($scope, $routeParams, $location, Containers, Tasks) {
    $scope.template = 'partials/container.html';

    $scope.image = $routeParams.name;

    Containers.query({}, function (d) {
        var containers = [];

        angular.forEach(d, function (v) {
            if (v.image == $routeParams.name) {
                containers.push(v);
            }
        });

        $scope.containers = containers;
    });

    $scope.stop = function(container) {
        Tasks.add({
            command: "stop",
            host: container.host_id,
            args: {
                containerId: container.id
            }
        });
        $location.path("/containers");
    };

    $scope.restart = function(container) {
        Tasks.add({
            command: "restart",
            host: container.host_id,
            args: {
                containerId: container.id
            }
        });
        $location.path("/containers");
    };

    $scope.destroy = function(container) {
        Tasks.add({
            command: "destroy",
            host: container.host_id,
            args: {
                containerId: container.id
            }
        });
        $location.path("/containers");
    };
}

function DeployController($scope, $routeParams, Hosts, Tasks) {
    $scope.init = function() {
        $('.ui.dropdown').dropdown();
    };

    $scope.template = 'partials/deploy.html';

    Hosts.query({
        name: $routeParams.id
    }, function (data) {
        $scope.hosts = data;
    });

    $scope.select = function(host) {
        $scope.selectedHost = host;
    };

    $scope.launch = function() {
        Tasks.add({
            command: "run",
            host: $scope.selectedHost.id,
            image: $scope.image,
            cpus: $scope.cpus,
            memory: $scope.memory,
            instances: $scope.instances
        });
    };
}

// this needs to move to some super start init func
function toggleStartSidebar() {
    $('.ui.sidebar').sidebar({
        overlay: true
    })
        .sidebar('toggle');
}
