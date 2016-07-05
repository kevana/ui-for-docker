describe('ContainerController', function () {
    var $scope, $httpBackend, mockContainer, $routeParams;

    beforeEach(module('uifordocker'));


    beforeEach(inject(function ($rootScope, $controller, _$routeParams_) {

        $scope = $rootScope.$new();
        $routeParams = _$routeParams_;
        $controller('ContainerController', {
            $scope: $scope
        });

        angular.mock.inject(function (_$httpBackend_, _Container_) {
            mockContainer = _Container_;
            $httpBackend = _$httpBackend_;
        });
    }));

    function expectGetContainer() {
        $httpBackend.expectGET('dockerapi/containers/json').respond({
            Created: 1421817232,
            id: 'b17882378cee8ec0136f482681b764cca430befd52a9bfd1bde031f49b8bba9f',
            Image: 'ui-for-docker:latest',
            Name: '/ui-for-docker',
            Config: {},
            HostConfig: {
                Binds: []
            }
        });
    }

    it("a correct rename request to the Docker remote API", function () {

        $routeParams.id = 'b17882378cee8ec0136f482681b764cca430befd52a9bfd1bde031f49b8bba9f';
        $scope.container = {
            'Created': 1421817232,
            'id': 'b17882378cee8ec0136f482681b764cca430befd52a9bfd1bde031f49b8bba9f',
            'Image': 'ui-for-docker:latest',
            'Name': '/ui-for-docker'
        };
        $scope.container.newContainerName = "newName";

        var newContainerName = "newName";
        expectGetContainer();

        $httpBackend.expectGET('dockerapi/containers/changes').respond([{"Kind": 1, "Path": "/docker.sock"}]);

        $httpBackend.expectPOST('dockerapi/containers/' + $routeParams.id + '/rename?name=newName').
            respond({
                'name': newContainerName
            });

        $scope.renameContainer();

        $httpBackend.flush();
        expect($scope.container.Name).toBe(newContainerName);
        expect($scope.container.edit).toBeFalsy();
    });
});