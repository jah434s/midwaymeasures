var app = angular.module('midwayMeasures', ['firebase']);

app.controller('mmCtrl', function ($rootScope, $scope, $firebaseObject, $firebaseArray) {

    var displayRef = new Firebase('https://midway-measures.firebaseio.com/displayData');
    var displayData = $firebaseObject(displayRef);

    displayData.$bindTo($scope, 'display');

    var teamsRef = new Firebase('https://midway-measures.firebaseio.com/teams');
    $scope.teams = $firebaseArray(teamsRef);

    var peopleRef = new Firebase('https://midway-measures.firebaseio.com/people').orderByChild('status').equalTo('active');
    $scope.people = $firebaseArray(peopleRef);
})
.directive('trendChart', function () {
    return {
        restrict: 'A',
        scope: {
            display: '=display',
            team: '=team'
        },
        link: function (scope, elem, attrs) {
            scope.$watch('display', function (newValue, oldValue) {
                makeChart([scope.display[scope.team][attrs.chartData]], scope.display.iterationEndDates, elem, {});
            });
        }
    }
});