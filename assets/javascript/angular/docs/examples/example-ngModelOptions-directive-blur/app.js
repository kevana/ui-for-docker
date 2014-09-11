  function Ctrl($scope) {
    $scope.user = { name: 'say', data: '' };

    $scope.cancel = function (e) {
      if (e.keyCode == 27) {
        $scope.userForm.userName.$cancelUpdate();
      }
    };
  }