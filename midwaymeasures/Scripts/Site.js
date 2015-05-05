var TrelloData = {
    webProdMgmtOrg: '504a0eb550849e151f0b3f30',
    webProdOrg: '504a56a70022d3d72e198e98'
};

var dataPointsToPlot = 8;

var workTypes = ['CAP', 'DAP', 'OFI', 'CAR', 'SEO', 'BUG', 'Support'];



//var fbDataNeeded = ['teams', 'iterations'];

var dataItemsNeeded = 0;

var fbDataLoaded = 0;
var trelloDataLoaded = 0;

var trelloDataNeeded = [];

var fbRootRef = new Firebase("https://midway-measures.firebaseio.com/");

var teams;
fbRootRef.child('teams').on('value', function (snapshot) {
    teams = snapshot.val();
})

var currentIteration;
fbRootRef.child('iterations').limitToLast(1).on('value', function (snapshot) {
    currentIteration = snapshot.val();
});

var FB = {
    people: fbRootRef.child('people'),
    bucks: fbRootRef.child('bullseyeBucks'),
    cards: fbRootRef.child('cards'),
    teams: fbRootRef.child('teams')
};

$(document).on('ready', function () {

    Trello.authorize({
        type: 'popup',
        name: 'Midway Measures',
        expiration: 'never'
    });

    if (loggedIn()) {
        logInDisplay('in');
    }

    if (typeof (fbDataNeeded) != 'undefined') {
        fbDataNeeded.forEach(getFbData);
    }

    $('body').on('click.login', '[data-login]', function (e) {
        e.preventDefault();
        $('[data-login-modal]').modal('show');
    });

    $('body').on('submit', '[data-login-form]', function (e) {
        e.preventDefault();
        logIn();
        $('[data-login-modal]').modal('hide');
    });

    $('body').on('click.logout', '[data-logout]', function (e) {
        e.preventDefault();
        fbRootRef.unauth();
        logInDisplay('out');
    });


    $('[data-sub-nav]').on('click', '[data-sub-nav-item]', function (e) {
        e.preventDefault();
        $('[data-sub-nav-item]').removeClass('is-active');
        $(this).addClass('is-active');
        if (typeof showDataFor == 'function') {
            var team = $(this).data('team');
            console.log(team);
            showDataFor(team);
        }
    });

    $('[data-edit-toggle]').on('click', function () {
        $(this).toggleClass('is-open');
        $(this).next('[data-edit-section]').toggleClass('is-visible');
    });

});

$(document).on('fbDataLoaded', function () {
    if (typeof showDataFor == 'function') {
        showDataFor('All');
    }

    //addTrelloIdForNewMembers();
});

function loggedIn() {
    var authData = fbRootRef.getAuth();
    return !!authData;
}


function logIn() {
    fbRootRef.authWithPassword({
        email: $('[data-login-email]').val(),
        password: $('[data-login-password]').val()
    }, function (error, authData) {
        if (error) {
            alert("Login Failed: ", error);
        } else {
            logInDisplay('in');
        }
    });
}

function logInDisplay(inOrOut) {
    if (inOrOut == 'in') {
        $('[data-logout]').removeClass('hidden');
        $('[data-login]').addClass('hidden');
    } else {
        $('[data-logout]').addClass('hidden');
        $('[data-login]').removeClass('hidden');
    }
}

function getFbData(dataItem) {
    var ref = fbRootRef.child(dataItem);

    ref.on('child_added', function (snapshot) {
        window[dataItem].push(snapshot.val());
    }, function (errorObject) {
        console.log("The read for " + dataItem + " failed: " + errorObject.code);
    });

    ref.once('value', function () {
        fbDataLoaded++;
        if (fbDataLoaded == fbDataNeeded.length) {
            $(document).trigger('fbDataLoaded');
        }
    });
}

function getTrelloData() {
    trelloItemsLoaded++;
    if (trelloItemsLoaded == trelloDataNeeded.length) $(document).trigger('trelloDataLoaded');
}



//This is kind of ugly...
function formatDate(dateString) {
    return dateString.substring(0, 10) + 'T06:00:00';
}

function getData(table, storageArray) {
    var ref = fbRootRef.child(table);
    ref.on('value', function (snapshot) {
        var items = snapshot.val();
        $.each(items, function (index) {
            storageArray[index] = this;
        });
        dataItemsLoaded++;
        if (dataItemsLoaded == dataItemsNeeded) {
            $(document).trigger('dataLoaded');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function makeChart(dataArray) {
    var colors = ['rgba(151, 187, 205, 1)', 'rgba(186, 218, 85, 1)', 'rgba(220, 220, 220, 1)'];
    var labelsArray = [];
    for (var j = 0; j < dataPointsToPlot; j++) {
        labelsArray.push('Iteration ' + (j + 1));
    }

    var chartInfo = [];
    for (var i = 0; i < dataArray.length; i++) {
        chartInfo[i] = {
            label: teams[i].name,
            fillColor: colors[i].replace(', 1)', ', 0.2)'),
            strokeColor: colors[i],
            pointColor: colors[i],
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: colors[i],
            data: dataArray[i]
        }
    }

    var data = {
        labels: labelsArray,
        datasets: chartInfo
    };

    var ctx = $('[data-chart]').get(0).getContext("2d");

    var myLineChart = new Chart(ctx).Line(data);
    $('[data-chart]').after(myLineChart.generateLegend());
}

function byTeam(el) {
    return el.team == this;
}

function byIteration(el) {
    var iterationStart = new Date(this.startDate);
    var iterationEnd = new Date(this.endDate);
    //for defects
    if (el.dateFound) {
        var defectDate = new Date(el.dateFound);
        return defectDate > iterationStart && defectDate < iterationEnd;
    }
    //for work items
    else if (el.dateCompleted) {
        var completedDate = el.dateCompleted;
        return el.dateCompleted > Date.parse(iterationStart) && el.dateCompleted < Date.parse(iterationEnd);
    //for Bullseye Bucks
    } else if (el.time) {
        var buckDate = new Date(el.time);
        return buckDate > iterationStart && buckDate < iterationEnd;
    }
    return false;
}

function setData(array, tableName) {
    var dataReference = fbRootRef.child(tableName);

    dataReference.set(array, function (error) {
        if (error) {
            alert("Data not saved. " + error);
        } else {
            location.reload();
        }
    });
}

function addTrelloIdForNewMembers() {
    var newTrelloMembers = people.filter(function (person) {
        return person.trelloId == null;
    });
    if (newTrelloMembers.length < 1) return;

    Trello.organizations.get(TrelloData.webProdOrg, { 'memberships': 'active' }, function (organization) {
        $(organization.memberships).each(function () {
            Trello.members.get(this.idMember, function (member) {
                console.log(member.fullName);
                $(newTrelloMembers).each(function () {
                    var memberName = member.fullName.toLowerCase(),
                        fName = this.firstName.toLowerCase(),
                        lName = this.lastName.toLowerCase();
                    if (memberName.indexOf(fName) < 0 || memberName.indexOf(lName) < 0) return;

                    var ref = FB.people.child(this.firstName.toLowerCase() + this.lastName);
                    ref.update({ 'trelloId': member.id });
                });
            });
        });
    });
}

