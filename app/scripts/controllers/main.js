'use strict';

/**
 * @ngdoc function
 * @name jschallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jschallengeApp
 */
angular.module('jschallengeApp')

.controller('MainCtrl', function($scope, $http) {

  // Query for a booking in 1 day from now, for 2 hours.
  var start = Date.now() + 24 * 3600 * 1000;
  var end = start + 2 * 3600 * 1000;
  var url = 'http://jschallenge.smove.sg/provider/1/availability?book_start=' + start + '&book_end=' + end;

  $scope.startpos = 0;
  $scope.size = 5;
  $scope.pages = [];
  $scope.parks = [];
  $scope.predicate = '+id';

  $http.get(url).success(function(result) {
    $scope.parks = result;
    for (var i = 0; i < result.length / $scope.size; i++) {
      $scope.pages.push(i);
    }
    
    $scope.parkdetail = $scope.parks[0];
    $scope.map = { center: { latitude: $scope.parkdetail.latitude, longitude: $scope.parkdetail.longitude }, zoom: 16 };
    $scope.marker = {
      id : $scope.parkdetail.id,
      coords: {
        latitude: $scope.parkdetail.latitude,
        longitude: $scope.parkdetail.longitude
      },
      options: { draggable: false },
    };
    console.log('Result from the API call:', result);

  }).error(function(err) {
    // Hum, this is odd ... contact us...
    console.error(err);
  });

  $scope.next = function(){
    if ( $scope.startpos >= $scope.pages.length - 1) {
      return false;
    }
    $scope.startpos += 1; 
  };
  $scope.prev = function(){
    if ($scope.startpos === 0) {
      return false;
    }
    $scope.startpos -= 1; 
  };
  $scope.setPos = function(number){
    $scope.startpos = number;
  };

  $scope.isCurrentTab = function(park){
    return $scope.parkdetail.id === park.id;
  };

  $scope.isActive = function(pos){
    return $scope.startpos === pos;
  };
  $scope.getPoints = function(pt1,pt2){
    var R = 6371; // km Radius of earth
    var dLat = ($scope.toRad(pt2.lat-pt1.lat));
    var dLon = ($scope.toRad(pt2.longi-pt1.longi)); 
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos($scope.toRad(pt1.lat)) * Math.cos($scope.toRad(pt2.lat)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;

  };

  $scope.toRad = function(val){
    return val * (Math.PI / 180);
  };


  $scope.nearme = function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          for (var i = 0; i < $scope.parks.length; i++) {
            var pt1 = {
              lat : $scope.parks[i].latitude,
              longi : $scope.parks[i].longitude
            };
            var pt2 = {
              lat : pos.coords.latitude,
              longi : pos.coords.longitude
            };

            $scope.parks[i].points = ($scope.getPoints(pt1,pt2));

          }
          $scope.$apply(function(){ 
            $scope.predicate = 'points';
          });
        });
    }
 
  };

  $scope.detail = function(park){
    $scope.parkdetail = park;
    $scope.map = { center: { latitude: $scope.parkdetail.latitude, longitude: $scope.parkdetail.longitude }, zoom: 16 };
    $scope.marker = {
      id : $scope.parkdetail.id,
      coords: {
        latitude: $scope.parkdetail.latitude,
        longitude: $scope.parkdetail.longitude
      },
      options: { title : $scope.parkdetail.parking_name },
    };
  };


})
.filter('pagination',function(){

  return function(input,start,size){
    if (input) {
      start = start * size;
      return input.slice(start,start + size);
    }
  };
})
.directive('carBg', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      if (scope.park.cars_available == 0 ) {
        iElement.addClass('bg-danger');
      }else if(scope.park.cars_available > 0 && scope.park.cars_available < 2 ){
        iElement.addClass('bg-warning');
      }else{
        iElement.addClass('bg-info');
      }
    }
  };
}]);