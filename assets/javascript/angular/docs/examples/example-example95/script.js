  function Cntl1($window, $scope){
    $scope.name = 'World';

    $scope.greet = function() {
      $window.alert('Hello ' + $scope.name);
    };
  }