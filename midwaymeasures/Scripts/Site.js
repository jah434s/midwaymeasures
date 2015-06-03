var TrelloData = {
    webProdMgmtOrg: '504a0eb550849e151f0b3f30',
    webProdOrg: '504a56a70022d3d72e198e98'
};

var dataPointsToPlot = 10;

var workTypes = ['CAP', 'DAP', 'OFI', 'CAR', 'SEO', 'BUG', 'Support'];
var colors = ['rgba(6, 57, 81, 1)', 'rgba(193, 48, 24, 1)', 'rgba(243, 111, 19, 1)', 'rgba(235, 203, 56, 1)', 'rgba(162, 185, 105, 1)', 'rgba(13, 149, 188, 1)', 'rgba(92, 167, 147, 1)'];
var doneLists = [];
var doneListIndex = 0;
doneListsToCheck = 4;

var fbRootRef = new Firebase("https://midway-measures.firebaseio.com/");

var authData = fbRootRef.getAuth();

var FB = {
    people: fbRootRef.child('people'),
    bucks: fbRootRef.child('bullseyeBucks'),
    cards: fbRootRef.child('cards'),
    teams: fbRootRef.child('teams'),
    doneLists: fbRootRef.child('doneLists'),
    iterations: fbRootRef.child('iterations'),
    defects: fbRootRef.child('defects'),
    users: fbRootRef.child('users'),
    names: fbRootRef.child('names')
};

var testCard = {
    dateCompleted: 1432844240301,
    desc: 'test',
    effort: "2",
    team: "north",
    people: {
        "508982c2c9f0bea5630008bf": true,
    },
    workType: "BUG"
}

$(document).on('ready', function () {

    if (loggedIn()) {
        $('body').addClass('logged-in').removeClass('logged-out');
        if (isAdmin) {
            $('body').addClass('admin');
            Trello.authorize({
                type: 'popup',
                name: 'Midway Measures',
                expiration: 'never'
            });
        }
    }

    $('body').on('click.login', '[data-login]', function (e) {
        e.preventDefault();
        $('[data-login-modal]').modal('show');
    });

    $('body').on('click.register', '[data-register]', function (e) {
        e.preventDefault();
        $('[data-register-modal]').modal('show');
    });

    $('body').on('submit', '[data-login-form]', function (e) {
        e.preventDefault();
        logIn($('[data-login-email]').val(), $('[data-login-password]').val());
        $('[data-login-modal]').modal('hide');
    });

    $('body').on('submit', '[data-register-form]', function (e) {
        e.preventDefault();
        register();
        $('[data-register-modal]').modal('hide');
    });

    $('body').on('click.logout', '[data-logout]', function (e) {
        e.preventDefault();
        fbRootRef.unauth();
        $('body').removeClass('logged-in').removeClass('admin').addClass('logged-out');
    });

    $('[data-edit-toggle]').on('click', function () {
        $(this).toggleClass('is-open');
        $(this).next('[data-edit-section]').toggleClass('is-visible');
    });

    //Get Teams from DB
    FB.teams.on('child_added', function (snapshot) {
        var team = snapshot.key();
        $('[data-team-list]').append('<option data-buck-team data-fb-field="team">' + team + '</option>');
});

});

function loggedIn() {
    return !!authData;
}

function isAdmin() {
    FB.users.child(authData.auth.uid).once('value', function (snapshot) {
        return snapshot.val().isAdmin;
    });
}

function logIn(email, password) {
    fbRootRef.authWithPassword({
        email: email,
        password: password
    }, function (error, authData) {
        if (error) {
            alert("Login Failed: ", error);
        } else {
            $('body').addClass('logged-in').removeClass('logged-out');
            if (isAdmin) {
                $('body').addClass('admin');
            }
        }
    });
}

function register() {
    var user = {
        email: $('[data-register-email]').val(),
        position: $('[data-register-position]').val(),
        team: $('[data-register-team]').val(),
        firstName: $('[data-register-fname]').val(),
        lastName: $('[data-register-lname]').val(),
        fullName: $('[data-register-fname]').val() + ' ' + $('[data-register-lname]').val(),
        status: 'active'
    }
    var pass = $('[data-register-password]').val();

    fbRootRef.createUser({
        email: user.email,
        password: pass
    }, function (error, userData) {
        if (error) {
            switch (error.code) {
                case "EMAIL_TAKEN":
                    alert("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    alert("The specified email is not a valid email.");
                    break;
                default:
                    alert("Error creating user:", error);
            }
        } else {
            fbRootRef.authWithPassword({
                'email': user.email,
                'password': pass
            }, function (err, authData) {
                if (err) {
                    alert("Login Failed: ", err);
                } else {
                    $('body').addClass('logged-in').removeClass('logged-out');
                    if (isAdmin) {
                        $('body').addClass('admin');
                    }
                    //Create user record and name record in DB
                    FB.users.child(fbRootRef.getAuth().uid).update(user, function () {
                        var obj = {};
                        obj[user.fullName] = fbRootRef.getAuth().uid;
                        FB.names.update(obj);
                    });

                }
            });

        }
    });
}

function makeChart(dataArray, container) {
    var labelsArray = [];
    for (var j = 0; j < dataPointsToPlot; j++) {
        labelsArray.push('Iteration ' + (j + 1));
    }

    var chartInfo = [];
    for (var i = 0; i < dataArray.length; i++) {
        chartInfo[i] = {
            label: 'team',
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

    var ctx = container.get(0).getContext("2d");

    var myLineChart = new Chart(ctx).Line(data);
    //$('[data-chart]').after(myLineChart.generateLegend());
}

function makePieChart(labelsArray, dataArray, container) {
    var data = [];
    for (var i = 0; i < dataArray.length; i++) {
        data[i] = {
            color: colors[i],
            label: labelsArray[i],
            value: dataArray[i]
        }
    }

    var ctx = container.get(0).getContext("2d");
    var options = {
        legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%> - <%= Math.round(segments[i].value / total * 100) %>%<%}%></li><%}%></ul>'
    };

    var myPieChart = new Chart(ctx).Pie(data, options);
    container.after(myPieChart.generateLegend());
}

//function addTrelloIdForNewMembers() {
//    var newTrelloMembers = people.filter(function (person) {
//        return person.trelloId == null;
//    });
//    if (newTrelloMembers.length < 1) return;

//    Trello.organizations.get(TrelloData.webProdOrg, { 'memberships': 'active' }, function (organization) {
//        $(organization.memberships).each(function () {
//            Trello.members.get(this.idMember, function (member) {
//                console.log(member.fullName);
//                $(newTrelloMembers).each(function () {
//                    var memberName = member.fullName.toLowerCase(),
//                        fName = this.firstName.toLowerCase(),
//                        lName = this.lastName.toLowerCase();
//                    if (memberName.indexOf(fName) < 0 || memberName.indexOf(lName) < 0) return;

//                    var ref = FB.people.child(this.firstName.toLowerCase() + this.lastName);
//                    ref.update({ 'trelloId': member.id });
//                });
//            });
//        });
//    });
//}

var fbCallback = function (error) {
    if (error) {
        alert(error);
    }
}

$('[data-toggle=collapse]').on('click', function () {
    $(this).find('i').first().toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');
});

$('[data-sync=boards]').on('click', updateBoards);

$('[data-sync=cards]').on('click', updateCards);

function updateBoards() {
    //$('[data-sync=boards]').attr('disabled', 'disabled');
    //var to = setTimeout($('[data-sync=boards]').removeAttr('disabled'), 3000);
    FB.teams.on('child_added', function (snapshot) {
        updateDoneLists(snapshot.val().board, snapshot.key());
    });
}

function updateCards() {
    //TODO: Figure out how to alert when card syncing is done
    var getDoneLists = FB.doneLists.orderByKey().limitToLast(doneListsToCheck).on('child_added', function (snapshot) {
        var obj = {
            'listId': snapshot.key(),
            'team': snapshot.val().team
        }
        doneLists.push(obj);
        //getCardData(snapshot.key(), snapshot.val().team);
    });
    FB.doneLists.once('value', function() {
        FB.doneLists.off('value', getDoneLists);
        var list = doneLists[doneListIndex];
        getCardData(list.listId, list.team);
    });
}

function updateDoneLists(teamBoard, teamName) {
    Trello.boards.get(teamBoard, { 'lists': 'all' }, function (board) {
        var boardDoneLists = [];

        //Grab all of the 'Done' lists
        $(board.lists).each(function () {
            if (this.name.indexOf('Done') >= 0) {
                boardDoneLists.push(this);
            }
        });

        $(boardDoneLists).each(function () {

            //create list object
            var list = {
                team: teamName,
                name: this.name,
                id: this.id
            }
            var dateString = this.name.substr(5);
            list.endDate = Date.parse(dateString);

            //Start data collection from 2015
            var date = new Date(dateString);
            if (date.getFullYear() == 2015) {

                //add reference to team object
                var listObj = {};
                listObj[this.id] = true;
                FB.teams.child(teamName).child('doneLists').update(listObj, fbCallback);

                //add done list to DB
                FB.doneLists.child(list.id).update(list, fbCallback);

                //create new iteration for new done lists
                var iteration = {
                    endDate: list.endDate
                }
                FB.iterations.child(list.endDate).update(iteration, fbCallback);
            }
        });
    });
}

function getCardData(doneList, teamName) {

    Trello.lists.get(doneList, { 'cards': 'open' }, function (list) {

        var cardsToUpdate = list.cards.length;
        var listEffort = 0;

        $.each(list.cards, function (index, currentCard) {

            var cardId = currentCard.id,
                cardName = currentCard.name,
                cardPeople = currentCard.idMembers;

            Trello.cards.get(cardId, { 'actions': 'updateCard:idList' }, function (data) {
                $(data.actions).each(function () {
                    if (this.data.listAfter.id == doneList) {
                        var card = {
                            people: {},
                            team: teamName,
                            dateCompleted: Date.parse(this.date),
                            desc: cardName
                        };

                        //add people references to card
                        $.each(cardPeople, function (index, id) {
                            card.people[id] = true;
                        });

                        //get Effort from card name, e.g. '[5]'
                        var matchesEffort = cardName.match(/\[(.*?)\]/);
                        if (matchesEffort) {
                            var effort = matchesEffort[1];
                            if (effort == '1/2') effort = .5;
                            card.effort = effort;
                            listEffort += parseFloat(effort);
                        }

                        //Get work type from card name (DAP, OFI, etc.)
                        $(workTypes).each(function (index, value) {
                            if (cardName.indexOf(value) >= 0) {
                                card.workType = value;
                            };
                        });
                        if (!card.workType) {
                            card.workType = 'Other';
                        }

                        //Add Card to DB
                        var cardRef = FB.cards.child(cardId);
                        cardRef.set(card, function () { });

                        //Add card reference to iteration
                        var cardObj = {};
                        cardObj[cardId] = true;
                        FB.doneLists.child(doneList).once('value', function (snapshot) {
                            FB.iterations.child(snapshot.val().endDate).child(teamName).child('cards').update(cardObj, fbCallback);
                        });

                        //Add Card reference to team
                        var teamCardsRef = FB.teams.child(teamName).child('cards');
                        var teamCard = {};
                        teamCard[cardId] = true;
                        teamCardsRef.update(teamCard, fbCallback);

                        //Add Card reference to person
                        $(this.idMembers).each(function () {
                            var trelloId = this.toString();
                            var personalCard = {};
                            personalCard[cardId] = true;

                            //TODO: Add new people when they are encountered
                            FB.users.orderByChild('trelloId').equalTo(trelloId).on('child_added', function (snapshot) {
                                FB.users.child(snapshot.key()).child('cards').update(personalCard, fbCallback);
                            });
                        });

                        cardsToUpdate--;
                        if (cardsToUpdate == 0) { //all cards on the list have been checked

                            //add effort to donelist
                            FB.doneLists.child(doneList).update({
                                effort: listEffort
                            }, fbCallback);

                            //add effort to iteration
                            FB.doneLists.child(doneList).once('value', function (snapshot) {
                                FB.iterations.child(snapshot.val().endDate).child(teamName).update({
                                    effort: listEffort
                                }, function(error) {
                                    if (error) {
                                        alert(error);
                                    } else {
                                        //move on to the next list, if necessary
                                        doneListIndex++;
                                        if (doneListIndex < doneListsToCheck) {
                                            var newList = doneLists[doneListIndex];
                                            getCardData(newList.listId, newList.team);
                                        } else {
                                            doneListIndex = 0;
                                            $('[data-card-update-success]').removeClass('hidden');
                                        }
                                    }
                                });
                            });
                        }
                        //stop looping through actions if we've already got a date
                        return false;
                    }
                });
            });
        });
    });

}
