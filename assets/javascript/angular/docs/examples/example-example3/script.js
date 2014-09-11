  function ScrollCtrl($scope, $location, $anchorScroll) {
    $scope.gotoBottom = function (){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('bottom');

      // call $anchorScroll()
      $anchorScroll();
    };
  }