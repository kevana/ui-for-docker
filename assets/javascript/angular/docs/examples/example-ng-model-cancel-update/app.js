  angular.module('cancel-update-example', [])

  .controller('CancelUpdateCtrl', function($scope) {
    $scope.resetWithCancel = function (e) {
      if (e.keyCode == 27) {
        $scope.myForm.myInput1.$cancelUpdate();
        $scope.myValue = '';
      }
    };
    $scope.resetWithoutCancel = function (e) {
      if (e.keyCode == 27) {
        $scope.myValue = '';
      }
    };
  });