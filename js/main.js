'use strict';

angular.module('app', [])
.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
})
.controller('mainCtrl', ['$rootScope', '$scope', '$http', '$compile', '$timeout', '$q', 'Printer', function($rootScope, $scope, $http, $compile, $timeout, $q, Printer){
  var self = this;

  self.init = function(){
    $http.get('datos.json').then(function(response){
      $scope.datos = response.data;
    }, function(err){
      console.log("error");
    })
  }

  self.process = function(template){
    Printer.print(template, $scope.datos);
  }

}]);
