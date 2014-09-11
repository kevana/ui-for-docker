var mySceApp = angular.module('mySceApp', ['ngSanitize']);

mySceApp.controller("myAppController", function myAppController($http, $templateCache, $sce) {
  var self = this;
  $http.get("test_data.json", {cache: $templateCache}).success(function(userComments) {
    self.userComments = userComments;
  });
  self.explicitlyTrustedHtml = $sce.trustAsHtml(
      '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
      'sanitization.&quot;">Hover over this text.</span>');
});