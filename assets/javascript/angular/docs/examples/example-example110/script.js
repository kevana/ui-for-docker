  function EventController($scope) {
    $scope.count = 0;
    $scope.$on('MyEvent', function() {
      $scope.count++;
    });
  }