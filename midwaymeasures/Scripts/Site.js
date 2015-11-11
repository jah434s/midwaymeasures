﻿var TrelloData = {
    webProdMgmtOrg: '504a0eb550849e151f0b3f30',
    webProdOrg: '504a56a70022d3d72e198e98',
    appKey: 'aaaccf39e74da6f15762c374cbcb5888',
};

var Board = function (id, team) {
    this.id = id;
    this.team = team;
}

var List = function (id, name, team, board) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.board = board;
    this.effort = 0;
    this.effortPromised = getEffortPromised(name);
    this.endDate = getEndDate(name);
};

var Card = function (desc, team, list, board, people, actions) {
    this.desc = desc;
    this.team = team;
    this.list = list;
    this.board = board;
    this.people = getPeople(people);
    this.dateCompleted = getDateCompleted(actions, list);
    this.workType = getWorkType(desc);
    this.effort = getCardEffort(desc);
}

var Iteration = function (endDate) {
    this.endDate = endDate;
}

var dataPointsToPlot = 12;

var colors = ['rgba(6, 57, 81, 1)', 'rgba(193, 48, 24, 1)', 'rgba(243, 111, 19, 1)', 'rgba(235, 203, 56, 1)', 'rgba(162, 185, 105, 1)', 'rgba(13, 149, 188, 1)', 'rgba(92, 167, 147, 1)', 'rgba(217, 78, 31, 1)'];
var doneLists = [];
var doneListIndex = 0;
doneListsToCheck = 4;

var fbRootRef = new Firebase("https://midway-measures.firebaseio.com/");

var authData = fbRootRef.getAuth();

var FB = function(childName) {
    return fbRootRef.child(childName);
};

if (jQuery.when.all === undefined) {
    jQuery.when.all = function (deferreds) {
        var deferred = new jQuery.Deferred();
        $.when.apply(jQuery, deferreds).then(
            function () {
                deferred.resolve(Array.prototype.slice.call(arguments));
            },
            function () {
                deferred.fail(Array.prototype.slice.call(arguments));
            });

        return deferred;
    }
}

$(document).on('ready', function () {

    if (loggedIn()) {
        $('body').addClass('logged-in').removeClass('logged-out');
        displayUserData();
        if (isAdmin) {
            $('body').addClass('admin');
            Trello.authorize({
                type: 'popup',
                name: 'Midway Measures',
                expiration: 'never',
                success: function () {
                    TrelloData.credentials = 'key=' + TrelloData.appKey + '&token=' + Trello.token();
                }
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
        $('[data-success-message]').text('You are logged out.');
        $('[data-success]').removeClass('hidden');
        $('body').removeClass('logged-in').removeClass('admin').addClass('logged-out');
    });

    $('body').on('click.resetPass', '[data-reset-pass]', function (e) {
        e.preventDefault();
        $('[data-login-modal]').modal('hide');
        fbRootRef.resetPassword({
            email: $('[data-login-email]').val()
        }, function (error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_USER":
                        $('[data-error-message]').text('No account with that email exists');
                        $('[data-error]').removeClass('hidden');
                        break;
                    default:
                        $('[data-error-message]').text(error);
                        $('[data-error]').removeClass('hidden');
                }
            } else {
                $('[data-success-message]').text('An email has been sent to ' + $('[data-login-email]').val());
                $('[data-success]').removeClass('hidden');
            }
        });
    });

    $('[data-edit-toggle]').on('click', function () {
        $(this).toggleClass('is-open');
        $(this).next('[data-edit-section]').toggleClass('is-visible');
    });

    //Get Teams from DB
    FB('teams').on('child_added', function (snapshot) {
        var team = snapshot.key();
        $('[data-team-list]').append('<option data-buck-team data-fb-field="team">' + team + '</option>');
    });

});

function loggedIn() {
    return !!authData;
}

function isAdmin() {
    FB('users').child(authData.auth.uid).once('value', function (snapshot) {
        return snapshot.val().role == 'admin';
    });
}

function logIn(email, password) {
    fbRootRef.authWithPassword({
        email: email,
        password: password
    }, function (error, authData) {
        if (error) {
            $('[data-error-message]').text(error);
            $('[data-error]').removeClass('hidden');
        } else {
            $('[data-success-message]').text('You are logged in.');
            $('[data-success]').removeClass('hidden');
            $('body').addClass('logged-in').removeClass('logged-out');
            if (isAdmin) {
                $('body').addClass('admin');
            }
            displayUserData();
        }
    });
}

function displayUserData() {
    FB('users').child(fbRootRef.getAuth().uid).once('value', function (snapshot) {
        var me = snapshot.val();
        $('[data-firstname]').text(me.firstName);
        $('[data-fullname]').text(me.fullName);
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
                    $('[data-error-message]').text("This email is already in use.");
                    $('[data-error]').removeClass('hidden');
                    break;
                case "INVALID_EMAIL":
                    $('[data-error-message]').text("That is not a valid email.");
                    $('[data-error]').removeClass('hidden');
                    break;
                default:
                    $('[data-error-message]').text(error);
                    $('[data-error]').removeClass('hidden');
            }
        } else {
            fbRootRef.authWithPassword({
                'email': user.email,
                'password': pass
            }, function (err, authData) {
                if (err) {
                    $('[data-error-message]').text('Account was created, but you were unable to be logged in: ' + err);
                    $('[data-error]').removeClass('hidden');
                } else {
                    $('[data-success-message]').text('Account created. You are now logged in.');
                    $('[data-success]').removeClass('hidden');
                    $('body').addClass('logged-in').removeClass('logged-out');
                    if (isAdmin) {
                        $('body').addClass('admin');
                    }
                    //Create user record and name record in DB
                    FB('users').child(fbRootRef.getAuth().uid).update(user, function () {
                        var obj = {};
                        obj[user.fullName] = fbRootRef.getAuth().uid;
                        FB('names').update(obj);
                    });

                }
            });

        }
    });
}

function makeChart(dataArray, labels, container, options) {

    FB('iterations').once('value', function () {

        var chartInfo = [];
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].length > dataPointsToPlot) {
                dataArray[i] = dataArray[i].slice(Math.max(dataArray[i].length - dataPointsToPlot, 1));
                labels = labels.slice(Math.max(labels.length - dataPointsToPlot, 1));
            }
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
            labels: labels,
            datasets: chartInfo
        };

        var ctx = container.get(0).getContext("2d");

        var myLineChart = new Chart(ctx).Line(data, options);
        //$('[data-chart]').after(myLineChart.generateLegend());

    });
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

//$('[data-sync=boards]').on('click', updateBoards);

$('[data-sync=cards]').on('click', updateCards);


//update cards every 30 mins.
//var cardSchedule = later.parse.text('every 30 mins');
//later.setInterval(updateCards, cardSchedule);

//update boards every day
//var boardSchedule = later.parse.cron('00 7 * * ? *');
//later.setInterval(updateBoards, boardSchedule);

//function updateBoards() {
//    //$('[data-sync=boards]').attr('disabled', 'disabled');
//    //var to = setTimeout($('[data-sync=boards]').removeAttr('disabled'), 3000);
//    FB.teams.on('child_added', function (snapshot) {
//        updateDoneLists(snapshot.val().board, snapshot.key());
//    });
//}

function updateCards() {
    //The updateData object will hold all data that we will be sending to the DB (Firebase)
    var boards = {},
        updateData = {
            doneLists: {},
            cards: {},
            iterations: {}
        };

    // get the Trello board ids and team names for each team from Firebase DB
    FB('teams').once('value', function (snapshot) {
        var teams = snapshot.val();

        //Add board objects to updateData
        Object.keys(teams).forEach(function (key) {
            var boardId = teams[key].board;
            boards[boardId] = new Board(boardId, key);
        });

        //Get open lists from boards
        var boardRequests = [];
        Object.keys(boards).forEach(function (key) {
            
            //Push board ajax requests and done functions to array, so we can act when all requests are done
            boardRequests.push($.ajax('https://api.trello.com/1/boards/' + key + '?lists=open&list_fields=id,name,idBoard&cards=open&card_fields=id,name,idList,idBoard,idMembers&actions=updateCard:idList&' + TrelloData.credentials).done(function (boardData) {

                boardData.lists.forEach(function (list) {
                    //Create List object for every open list
                    var newList = new List(list.id, list.name, boards[list.idBoard].team, list.idBoard);
                    //If it's a 'Done' list, add it to the updateData object
                    if (isDoneList(newList)) {
                        updateData.doneLists[list.id] = newList;

                        //Set up iteration object
                        var iteration = new Iteration(newList.endDate);
                        if (typeof updateData.iterations[iteration.endDate] === 'undefined') {
                            updateData.iterations[iteration.endDate] = iteration;
                        }
                        updateData.iterations[iteration.endDate][newList.team] = {
                            effortPromised: newList.effortPromised,
                            cards: {},
                            effort: 0,
                            percentComplete: 0
                        }
                    }
                });

                var doneLists = updateData.doneLists,
                    iterations = updateData.iterations;

                //filter out unfinished cards
                var cards = getFinishedCards(boardData.cards, Object.keys(doneLists));

                cards.forEach(function (card) {
                    //boardData.actions contains all actions for the board, so filter out actions unrelated to the current card
                    var cardActions = boardData.actions.filter(function (a) {
                        return a.data.card.id == card.id;
                    });

                    var newCard = new Card(card.name, boards[card.idBoard].team, card.idList, card.idBoard, card.idMembers, cardActions);

                    updateData.cards[card.id] = newCard;
                    doneLists[newCard.list].effort += parseFloat(newCard.effort);

                    var endDate = doneLists[newCard.list].endDate,
                        iteration = iterations[endDate][newCard.team];

                    iteration.cards[card.id] = true;
                    iteration.effort += parseFloat(newCard.effort);
                    iteration.percentComplete = parseInt((iteration.effort / iteration.effortPromised).toFixed(2) * 100);

                });
            }));
        });

        //When all requests to Trello are done...
        $.when.all(boardRequests).done(function () {
            //update the data in the DB
            FB('doneLists').update(updateData.doneLists, fbCallback);
            FB('cards').update(updateData.cards, fbCallback);
            //iterations must be updated separately to prevent data loss
            Object.keys(updateData.iterations).forEach(function (iterationKey) {
                var iteration = updateData.iterations[iterationKey];
                FB('iterations/' + iterationKey).update(iteration);
            });
        });
    });
}

function getCardEffort(desc) {
    var matchesEffort = desc.match(/\[(.*?)\]/),
        effort;
    if (matchesEffort) {
        effort = matchesEffort[1];
        if (effort == '1/2') effort = .5;
    } else {
        effort = 0;
    }
    return effort;
}

function getPeople(members) {
    var people = {}
    if (members) {
        members.forEach(function (member) {
            people[member] = true;
        });
    }
    return people;
}

function getWorkType(desc) {
    var workTypes = ['CAP', 'DAP', 'OFI', 'CAR', 'SEO', 'BUG', 'Support', 'RAP'],
            workType;
    workTypes.forEach(function (type) {
        if (desc.indexOf(type) >= 0) {
            workType = type;
            return false;
        };
        return true;
    });
    return workType ? workType : 'Other';
}

function getDateCompleted(actions, list) {
    if (actions) {
        var dateComplete;
        actions.forEach(function (action) {
            if (action.data.listAfter.id == list) {
                dateComplete = Date.parse(action.date);
                return false;
            }
            return true;
        });
    }
    return dateComplete ? dateComplete : null;
}

function getEndDate(listName) {
    var dateString = listName.substr(5, 10);
    return Date.parse(dateString);
}

function getEffortPromised(listName) {
    var effortPromised;
    if (listName.indexOf('[') >= 0) {
        effortPromised = parseFloat(listName.substring((listName.indexOf('[') + 1), listName.indexOf(']')));
    }
    return effortPromised ? effortPromised : 0;
}

function isDoneList(list) {
    return list.name.indexOf('Done') >= 0;
};

function getFinishedCards(cards, doneLists) {
    cards = cards.filter(function (card) {
        var isDone = false;
        doneLists.forEach(function (doneList) {
            if (card.idList == doneList) {
                isDone = true;
                return false;
            }
            return true;
        });
        return isDone;
    });
    return cards;
}

//Update Velocity
FB('iterations').on('value', function (snapshot) {
    var iterations = snapshot.val();
    FB('teams').once('value', function (snapshot) {
        var teams = snapshot.val();  
        Object.keys(teams).forEach(function (team) {
            var velocities = [];
            Object.keys(iterations).forEach(function (iterationKey) {
                var effort = iterations[iterationKey][team].effort;
                if (iterations[iterationKey].endDate < Date.parse(new Date())) {
                    velocities.push(effort);
                } else {
                    //Update current progress
                    var currentProgress = parseInt((effort / iterations[iterationKey][team].effortPromised).toFixed(2) * 100);
                    FB('displayData').child(team).update({ currentProgress: currentProgress });
                }
            });
            var velocitySum = velocities.reduce(function (a, b) {
                return a + b;
            });
            var velocityAvg = (velocitySum / velocities.length).toFixed(2);
            FB('displayData').child(team).update({averageVelocity: velocityAvg}, fbCallback);
        });
    })
});

//function updateDoneLists(teamBoard, teamName) {
//    Trello.boards.get(teamBoard, { 'lists': 'all' }, function (board) {
//        var boardDoneLists = [];

//        //Grab all of the 'Done' lists
//        $(board.lists).each(function () {
//            if (this.name.indexOf('Done') >= 0) {
//                boardDoneLists.push(this);
//            }
//        });

//        $(boardDoneLists).each(function () {

//            //create list object
//            var list = {
//                team: teamName,
//                name: this.name,
//                id: this.id
//            }
//            var dateString = this.name.substr(5, 10);
//            list.endDate = Date.parse(dateString);

//            if (this.name.indexOf('[') >= 0) {
//                list.effortPromised = parseFloat(this.name.substring((this.name.indexOf('[') + 1), this.name.indexOf(']')));
//            }

//            //Start data collection from 2015
//            var date = new Date(dateString);
//            if (date.getFullYear() == 2015) {

//                //add reference to team object
//                var listObj = {};
//                listObj[this.id] = true;
//                FB.teams.child(teamName).child('doneLists').update(listObj, fbCallback);

//                //add done list to DB
//                FB.doneLists.child(list.id).update(list, fbCallback);

//                //create new iteration for new done lists
//                var iteration = {
//                    endDate: list.endDate
//                }
//                FB.iterations.child(list.endDate).update(iteration, fbCallback);

//                if (typeof list.effortPromised != 'undefined') {
//                    FB.iterations.child(list.endDate).child(teamName).update({ effortPromised: list.effortPromised });
//                }
//            }
//        });
//    });
//}

//function getCardData(doneList, teamName) {

//    Trello.lists.get(doneList, { 'cards': 'open' }, function (list) {

//        var cardsToUpdate = list.cards.length;
//        var listEffort = 0;

//        $.each(list.cards, function (index, currentCard) {

//            var cardId = currentCard.id,
//                cardName = currentCard.name,
//                cardPeople = currentCard.idMembers;

//            Trello.cards.get(cardId, { 'actions': 'updateCard:idList' }, function (data) {
//                $(data.actions).each(function () {
//                    if (this.data.listAfter.id == doneList) {
//                        var card = {
//                            people: {},
//                            team: teamName,
//                            dateCompleted: Date.parse(this.date),
//                            desc: cardName
//                        };

//                        //add people references to card
//                        $.each(cardPeople, function (index, id) {
//                            card.people[id] = true;
//                        });

//                        //get Effort from card name, e.g. '[5]'
//                        var matchesEffort = cardName.match(/\[(.*?)\]/);
//                        if (matchesEffort) {
//                            var effort = matchesEffort[1];
//                            if (effort == '1/2') effort = .5;
//                            card.effort = effort;
//                            listEffort += parseFloat(effort);
//                        }

//                        //Get work type from card name (DAP, OFI, etc.)
//                        $(workTypes).each(function (index, value) {
//                            if (cardName.indexOf(value) >= 0) {
//                                card.workType = value;
//                            };
//                        });
//                        if (!card.workType) {
//                            card.workType = 'Other';
//                        }

//                        //Add Card to DB
//                        var cardRef = FB.cards.child(cardId);
//                        cardRef.set(card, function () { });

//                        //Add card reference to iteration
//                        var cardObj = {};
//                        cardObj[cardId] = true;
//                        FB.doneLists.child(doneList).once('value', function (snapshot) {
//                            FB.iterations.child(snapshot.val().endDate).child(teamName).child('cards').update(cardObj, fbCallback);
//                        });

//                        //Add Card reference to team
//                        var teamCardsRef = FB.teams.child(teamName).child('cards');
//                        var teamCard = {};
//                        teamCard[cardId] = true;
//                        teamCardsRef.update(teamCard, fbCallback);

//                        //Add Card reference to person
//                        $(this.idMembers).each(function () {
//                            var trelloId = this.toString();
//                            var personalCard = {};
//                            personalCard[cardId] = true;

//                            //TODO: Add new people when they are encountered
//                            FB.users.orderByChild('trelloId').equalTo(trelloId).on('child_added', function (snapshot) {
//                                FB.users.child(snapshot.key()).child('cards').update(personalCard, fbCallback);
//                            });
//                        });

//                        cardsToUpdate--;
//                        if (cardsToUpdate == 0) { //all cards on the list have been checked

//                            //add effort to donelist
//                            FB.doneLists.child(doneList).update({
//                                effort: listEffort
//                            }, fbCallback);

//                            //add effort to iteration
//                            FB.doneLists.child(doneList).once('value', function (snapshot) {
//                                var iterationObj = {
//                                    effort: listEffort
//                                }
//                                if (typeof snapshot.val().effortPromised != 'undefined') {
//                                    iterationObj.percentComplete = parseInt((listEffort / snapshot.val().effortPromised).toFixed(2) * 100);
//                                }

//                                FB.iterations.child(snapshot.val().endDate).child(teamName).update(iterationObj, function (error) {
//                                    if (error) {
//                                        alert(error);
//                                    } else {
//                                        //move on to the next list, if necessary
//                                        doneListIndex++;
//                                        if (doneListIndex < doneListsToCheck) {
//                                            var newList = doneLists[doneListIndex];
//                                            getCardData(newList.listId, newList.team);
//                                        } else {
//                                            doneListIndex = 0;
//                                            $('[data-card-update-success]').removeClass('hidden');
//                                        }
//                                    }
//                                });
//                            });
//                        }
//                        //stop looping through actions if we've already got a date
//                        return false;
//                    }
//                });

//            });
//        });

//    });

//}
