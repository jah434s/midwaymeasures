var app = angular.module('midwayMeasures', ['firebase']);

app.controller('mmCtrl', function($scope, $firebaseObject, $firebaseArray) {

    var displayRef = new Firebase('https://midway-measures.firebaseio.com/displayData');
    var displayData = $firebaseObject(displayRef);

    displayData.$bindTo($scope, 'display');

    var teamsRef = new Firebase('https://midway-measures.firebaseio.com/teams');
    $scope.teams = $firebaseArray(teamsRef);

});