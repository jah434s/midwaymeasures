var app = angular.module('midwayMeasures', ['firebase', 'ngAnimate']);

app.controller('mmCtrl', function ($rootScope, $scope, $firebaseObject, $firebaseArray) {

    var displayRef = new Firebase('https://midway-measures.firebaseio.com/displayData');
    var displayData = $firebaseObject(displayRef);

    displayData.$bindTo($scope, 'display');
    window.data = displayData;

    var teamsRef = new Firebase('https://midway-measures.firebaseio.com/teams');
    $scope.teams = $firebaseArray(teamsRef);

    var peopleRef = new Firebase('https://midway-measures.firebaseio.com/people').orderByChild('status').equalTo('active');
    $scope.people = $firebaseArray(peopleRef);

    var bucksRef = new Firebase('https://midway-measures.firebaseio.com/bullseyeBucks').orderByChild('priority').limitToFirst(30);
    $scope.bucks = $firebaseArray(bucksRef);

    var bugsRef = new Firebase('https://midway-measures.firebaseio.com/defects').orderByChild('order').limitToFirst(30);
    $scope.bugs = $firebaseArray(bugsRef);

    $scope.addPerson = function () {
        $scope.people.$add($scope.newPerson);
    }

    $scope.filterData = function(filter) {
        console.log(filter);
    }
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
                makeChart([scope.display.teams[scope.team][attrs.chartData].slice(0, -1)], scope.display.iterationEndDates.slice(0, -1), elem, { bezierCurve: false });
            });
        }
    }
});