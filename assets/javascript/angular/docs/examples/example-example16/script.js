  angular.module('ngBindHtmlExample', ['ngSanitize'])

  .controller('ngBindHtmlCtrl', ['$scope', function ngBindHtmlCtrl($scope) {
    $scope.myHTML =
       'I am an <code>HTML</code>string with <a href="#">links!</a> and other <em>stuff</em>';
  }]);