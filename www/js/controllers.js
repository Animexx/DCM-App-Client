"use strict";

angular.module('starter.controllers', [])

    .controller('LoginCtrl', function ($scope, LoginService, $location) {
        $scope.doLogin = function (username, password) {
            if (username == "" || password == "") {
                alert("Bitte gib einen Benutzernamen und Passwort an.");
                return;
            }
            LoginService.login(username, password);
            $location.path('/competitions');
        }
    })

    .controller('CompetitionListCtrl', function ($location, $scope, CompetitionService, LoginService) {
        CompetitionService.query({
            competitionGroupId: window.DCM_COMPETITION_GROUP
        }).$promise.then(function (list) {
                if (typeof(list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der Wettbewerbsliste.");
                else {
                    $scope.competitions = list._embedded.competition;
                }
            });

        $scope.logout = function () {
            LoginService.logout();
            $location.path("/");
        }
    })

    .controller('CompetitionCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService, ParticipantRatingService, LoginService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.is_sysadmin = LoginService.isSysadmin();

        var set_rated = function (ratings) {
            var all_set = true;
            var none_set = true;
            for (var i in ratings.ratings) if (ratings.ratings.hasOwnProperty(i)) {
                console.log(ratings.ratings[i]);
                if (ratings.ratings[i] > 0) none_set = false;
                if (ratings.ratings[i] == 0) all_set = false;
            }
            if (all_set && !none_set) $scope.participants[ratings["participant_id"]]["i_rated"] = 1;
            if (!all_set && !none_set) $scope.participants[ratings["participant_id"]]["i_rated"] = -1;
        };

        ParticipantService.query({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        }).$promise.then(function (list) {
                if (typeof(list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der TeilnehmerInnenliste.");
                else {
                    $scope.participants = {};
                    for (var p in list._embedded.competition_participant) if (list._embedded.competition_participant.hasOwnProperty(p)) {
                        var part = list._embedded.competition_participant[p],
                            partData = JSON.parse(part.data);
                        part.data = partData;
                        $scope.participants[part.user_id] = part;
                        ParticipantRatingService.get({
                            competitionGroupId: window.DCM_COMPETITION_GROUP,
                            competitionId: $stateParams.competitionId,
                            participantId: part.user_id,
                            adjucatorId: LoginService.currentUserId()
                        }).$promise.then(set_rated);
                    }
                }
            });

    })


    .controller('CompetitionAdminoverviewCtrl', function ($scope, $stateParams, CompetitionService, AdjucatorService, ParticipantService, ParticipantRatingService,
                                                          LoginService, RatingCalcService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.is_sysadmin = LoginService.isSysadmin();
        $scope.userRatings = {};

        ParticipantService.query({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        }).$promise.then(function (list) {
                if (typeof(list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der TeilnehmerInnenliste.");
                else {
                    $scope.participants = {};
                    for (var p in list._embedded.competition_participant) if (list._embedded.competition_participant.hasOwnProperty(p)) {
                        var part = list._embedded.competition_participant[p];
                        $scope.participants[part.user_id] = part;
                    }




                    AdjucatorService.query({
                        competitionGroupId: window.DCM_COMPETITION_GROUP,
                        competitionId: $stateParams.competitionId
                    }).$promise.then(function (adjucator_list) {
                            if (typeof(adjucator_list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der Bewerter.");
                            else {
                                $scope.adjucators = adjucator_list._embedded.competition_adjucator;
                                var adjucator_ids = [];
                                for (var i in adjucator_list._embedded.competition_adjucator) if (adjucator_list._embedded.competition_adjucator.hasOwnProperty(i)) {
                                    adjucator_ids.push(adjucator_list._embedded.competition_adjucator[i].adjucator_id);
                                }
                                console.log($scope.adjucators, adjucator_ids);



                                for (var p in list._embedded.competition_participant) if (list._embedded.competition_participant.hasOwnProperty(p)) {
                                    var part = list._embedded.competition_participant[p];
                                    $scope.userRatings[part.user_id] = {};

                                    ParticipantRatingService.get({
                                        competitionGroupId: window.DCM_COMPETITION_GROUP,
                                        competitionId: $stateParams.competitionId,
                                        participantId: part.user_id
                                    }).$promise.then(function (ratings) {
                                            var ratings2 = ratings._embedded.competition_rating;
                                            for (i in ratings2) if (ratings2.hasOwnProperty(i)) {
                                                var votes = ratings2[i],
                                                    participantId = votes["participant_id"];

                                                if (adjucator_ids.indexOf(votes["adjucator_id"]) >= 0) {
                                                    var computed = RatingCalcService.getRatingScores(votes["ratings"]);
                                                    console.log(computed);
                                                    $scope.userRatings[participantId][votes["adjucator_id"]] = computed;
                                                }
                                            }
                                        });
                                }

                            }
                        });
                }
            });

    })


    .controller('CompetitionAdministrationCtrl', function ($scope, $stateParams, CompetitionService, AdjucatorService, UserService, LoginService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.is_sysadmin = LoginService.isSysadmin();

        var loadAdjucatorList = function () {
            AdjucatorService.query({
                competitionGroupId: window.DCM_COMPETITION_GROUP,
                competitionId: $stateParams.competitionId
            }).$promise.then(function (adjucator_list) {
                    adjucator_list = adjucator_list._embedded.competition_adjucator;

                    var adjucator_ids = [];
                    for (var i in adjucator_list) if (adjucator_list.hasOwnProperty(i)) {
                        adjucator_ids.push(parseInt(adjucator_list[i]["adjucator_id"]));
                    }

                    UserService.query().$promise.then(function (users) {
                        users = users._embedded.user;
                        for (i in users) if (users.hasOwnProperty(i)) {
                            users[i]["is_adjucator"] = (adjucator_ids.indexOf(parseInt(users[i]["id"])) >= 0);
                        }
                        console.log(users);
                        $scope.users = users;
                    });
                });
        };
        loadAdjucatorList();

        $scope.doCreateUser = function (username, password, is_adjucator) {
            if (username == "" || password == "") {
                alert("Bitte gib einen Benutzernamen und Passwort ein");
                return;
            }
            var newuser = new UserService({
                "username": username,
                "password": password
            }).$save();
            newuser.then(function (user) {
                if (is_adjucator) {
                    var adj_obj = new AdjucatorService({});
                    adj_obj.adjucator_id = user.id;
                    adj_obj.competition_id = $scope.competition.id;
                    adj_obj.username = username;
                    var adj = adj_obj.$save({
                        "competitionGroupId": window.DCM_COMPETITION_GROUP,
                        "competitionId": $scope.competition.id
                    });
                    adj.then(function () {
                        loadAdjucatorList();
                        $scope.new_user.username = "";
                        $scope.new_user.password = "";
                        $scope.new_user.is_adjucator = false;
                    })
                } else {
                    loadAdjucatorList();
                    $scope.new_user.username = "";
                    $scope.new_user.password = "";
                    $scope.new_user.is_adjucator = false;
                }
            });
        }
    })


    .controller('CompetitionAdministrationAdjucatorCtrl', function ($scope, $location, $stateParams, CompetitionService, AdjucatorService, UserService, LoginService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.is_sysadmin = LoginService.isSysadmin();

        var adjucator_obj = null;
        AdjucatorService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            adjucatorId: $stateParams.adjucatorId
        }).$promise.then(function (adj) {
                adjucator_obj = adj;
                console.log(adj);
                $scope.is_adjucator = (typeof(adj.adjucator_id) != "undefined");
                console.log($scope.is_adjucator);
            });
        var user = UserService.get({
            userId: $stateParams.adjucatorId
        });
        $scope.user = user;

        $scope.doUpdateUser = function (username, password_new, is_adjucator) {
            user.username = username;
            if (password_new != "") user.password = password_new;

            user.$save().then(function (new_user) {
                if (is_adjucator) {
                    var adj_obj = new AdjucatorService({});
                    adj_obj.adjucator_id = user.id;
                    adj_obj.competition_id = $scope.competition.id;
                    adj_obj.username = username;
                    var adj = adj_obj.$save({
                        "competitionGroupId": window.DCM_COMPETITION_GROUP,
                        "competitionId": $scope.competition.id
                    });
                    adj.then(function () {
                        $location.path("/competitions/" + $stateParams.competitionId + "/administration");
                    });
                } else {
                    adjucator_obj.$delete({
                        "competitionGroupId": window.DCM_COMPETITION_GROUP,
                        "competitionId": $scope.competition.id,
                        "adjucatorId": user.id
                    }).then(function () {
                        $location.path("/competitions/" + $stateParams.competitionId + "/administration");
                    });
                }

            });
        }
    })

    .controller('ParticipantOverviewCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService, ParticipantRatingService, LoginService,
                                                     RatingCalcService, AdjucatorService) {
        var ratings_obj = null;

        $scope.ratings = {};
        $scope.ratings_ignore = {};
        $scope.rating_groups_weights = {};
        $scope.rating_groups_scores = {};
        $scope.rating_groups_complete = {};
        $scope.rating_team_score = 0;
        $scope.is_sysadmin = LoginService.isSysadmin();
        $scope.participantId = $stateParams.participantId;
        $scope.competitionId = $stateParams.competitionId;

        var set_ratings2scope = function () {
            console.log("RATINGS:");
            console.log($scope.ratings);
            var data = RatingCalcService.getRatingScores($scope.ratings);
            $scope.rating_groups_weights = data["groups_weights"];
            $scope.rating_groups_scores = data["groups_scores"];
            $scope.rating_groups_complete = data["groups_complete"];
            $scope.team_rating = data["overall_score"];
            $scope.all_complete = true;
            for (var i in data["groups_complete"]) if (data["groups_complete"].hasOwnProperty(i) && !data["groups_complete"][i]) $scope.all_complete = false;
        };

        AdjucatorService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            adjucatorId: LoginService.currentUserId()
        }).$promise.then(function (adj) {
                console.log(adj);
                $scope.is_adjucator = (typeof(adj.adjucator_id) != "undefined");
            });

        ParticipantService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            participantId: $stateParams.participantId
        }).$promise.then(function (participant) {
                $scope.members = [];
                $scope.team_properties = [];
                $scope.group_auftritt = 0;
                try {
                    var data = JSON.parse(participant.data);
                    for (var i in data) if (data.hasOwnProperty(i)) {
                        if (i == "members") {
                            for (var j = 0; j < data[i].length; j++) {
                                var member = {
                                    "name": "[Nicht gefunden]",
                                    "group_kostuem": j + 1,
                                    "props": []
                                };
                                for (var k in data[i][j]) if (data[i][j].hasOwnProperty(k)) {
                                    if (k == "Name") member["name"] = "Teilnehmer " + (j + 1) + ": " + data[i][j][k];
                                    else member["props"].push([k, data[i][j][k]]);
                                }
                                $scope.members[j] = member;
                            }
                        } else $scope.team_properties.push([i, data[i]]);
                    }
                } catch (e) {
                    console.log(e);
                    alert("Keine Eigenschaften gefunden");
                }
            });

        $scope.crit_groups = RatingCalcService.getCriteria();
        var criteria_id = RatingCalcService.getCriteriaIDs();
        set_ratings2scope();

        ParticipantRatingService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            participantId: $stateParams.participantId,
            adjucatorId: LoginService.currentUserId()
        }).$promise.then(function (ratings) {
                for (var j = 0; j < criteria_id.length; j++) {
                    var val = ratings["ratings"][criteria_id[j]];
                    if (typeof(val) == "undefined") val = 0;
                    $scope.ratings[criteria_id[j]] = val;
                    $scope.ratings_ignore[criteria_id[j]] = (val == -1);
                }
                ratings_obj = ratings;
                set_ratings2scope();
            });

        $scope.saveRatings = function () {
            ratings_obj.ratings = $scope.ratings;
            for (var i in $scope.ratings) if ($scope.ratings.hasOwnProperty(i)) {
                if ($scope.ratings_ignore[i]) ratings_obj.ratings[i] = -1;
                else if (ratings_obj.ratings[i] == -1) ratings_obj.ratings[i] = 0;
            }
            set_ratings2scope();

            ratings_obj.$save({
                competitionGroupId: window.DCM_COMPETITION_GROUP,
                competitionId: $stateParams.competitionId,
                participantId: $stateParams.participantId,
                adjucatorId: LoginService.currentUserId()
            });
        };

        $scope.setOpenedCritGroup = function (group_id) {
            $scope.openedCritGroup = group_id;
        };
        $scope.openedCritGroup = 1;
    })

    .controller('ParticipantSummaryCtrl', function ($scope, $interval, $stateParams, ParticipantService, CompetitionService, ParticipantRatingService, AdjucatorService, RatingCalcService) {

        $scope.crit_groups = RatingCalcService.getCriteria();
        var criteria_id = RatingCalcService.getCriteriaIDs();

        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        ParticipantService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            participantId: $stateParams.participantId
        }).$promise.then(function (part) {
                $scope.participant = part;
                var data = JSON.parse(part["data"]),
                    members = data["members"],
                    rating_group_names = {};
                for (var i = 0; i < members.length; i++) {
                    rating_group_names[i * 2 + 0] = members[i]["Name"] + ": Kostüm";
                    rating_group_names[i * 2 + 1] = members[i]["Name"] + ": Auftritt";
                }
                $scope.crit_group_names = rating_group_names;
            });


        var build_rating_table = function (adjucators, ratings_by_adjucator) {
            var adjucators_by_id = {},
                ratings = {},
                rating_warnings = {},
                group_scores_by_adjucator = {},
                overall_scores = {},
                rating_complete = {},
                i, j;

            for (i in adjucators) if (adjucators.hasOwnProperty(i)) {
                adjucators_by_id[adjucators[i]["adjucator_id"]] = adjucators[i];
            }
            for (i in $scope.crit_groups) if ($scope.crit_groups.hasOwnProperty(i)) {
                group_scores_by_adjucator[$scope.crit_groups[i]["group_id"]] = {};
            }

            for (i in ratings_by_adjucator) if (ratings_by_adjucator.hasOwnProperty(i)) {
                var adjucator = ratings_by_adjucator[i];
                for (var crit_id in adjucator.ratings) if (adjucator.ratings.hasOwnProperty(crit_id)) {
                    if (adjucator.ratings[crit_id] != 0) {
                        if (typeof(ratings[crit_id]) == "undefined") ratings[crit_id] = {};
                        ratings[crit_id][adjucator.adjucator_id] = adjucator.ratings[crit_id];
                    }
                }
                var calcdata = RatingCalcService.getRatingScores(adjucator.ratings);
                console.log(calcdata);
                overall_scores[adjucator.adjucator_id] = calcdata["overall_score"];
                for (j in calcdata["groups_complete"]) if (calcdata["groups_complete"].hasOwnProperty(j)) {
                    rating_complete[adjucator.adjucator_id] = calcdata["groups_complete"][j];
                }
                for (j in calcdata["groups_scores"]) if (calcdata["groups_scores"].hasOwnProperty(j)) {
                    group_scores_by_adjucator[j][adjucator.adjucator_id] = calcdata["groups_scores"][j];
                }
            }
            for (i in ratings) if (ratings.hasOwnProperty(i)) {
                var sum = 0, cnt = 0;
                rating_warnings[i] = {};
                for (j in ratings[i]) if (ratings[i].hasOwnProperty(j)) {
                    cnt++;
                    sum += parseInt(ratings[i][j]);
                }
                if (cnt >= 0) {
                    var avg = sum / cnt;
                    for (j in ratings[i]) if (ratings[i].hasOwnProperty(j)) {
                        var diff = parseInt(ratings[i][j]) - avg;
                        if (diff <= -2 || diff >= 2) rating_warnings[i][j] = true;
                    }
                }
            }

            $scope.adjucators = adjucators_by_id;
            $scope.ratings = ratings;
            $scope.rating_warnings = rating_warnings;
            $scope.group_scores_by_adjucator = group_scores_by_adjucator;
            $scope.overall_scores = overall_scores;
            $scope.rating_complete = rating_complete;
        };

        var load_rating_table = function () {
            AdjucatorService.query({
                competitionGroupId: window.DCM_COMPETITION_GROUP,
                competitionId: $stateParams.competitionId
            }).$promise.then(function (adjucator_list) {
                    if (typeof(adjucator_list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der Bewerter.");
                    else {
                        ParticipantRatingService.get({
                            competitionGroupId: window.DCM_COMPETITION_GROUP,
                            competitionId: $stateParams.competitionId,
                            participantId: $stateParams.participantId
                        }).$promise.then(function (ratings) {
                                var adjucator_ids = [],
                                    valid_ratings = [];
                                for (var i in adjucator_list._embedded.competition_adjucator) if (adjucator_list._embedded.competition_adjucator.hasOwnProperty(i)) {
                                    adjucator_ids.push(adjucator_list._embedded.competition_adjucator[i].adjucator_id);
                                }
                                for (i in ratings._embedded.competition_rating) if (ratings._embedded.competition_rating.hasOwnProperty(i)) {
                                    var votes = ratings._embedded.competition_rating[i];
                                    if (adjucator_ids.indexOf(votes["adjucator_id"]) >= 0) valid_ratings.push(votes);
                                }
                                build_rating_table(
                                    adjucator_list._embedded.competition_adjucator,
                                    valid_ratings
                                )
                            });
                    }
                });
        };

        load_rating_table();

        var timer = $interval(function () {
            console.log("Reloading");
            load_rating_table();
        }, 5000);

        $scope.$on('$destroy', function () {
            $interval.cancel(timer);
            timer = undefined;
        });

    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function ($scope) {
    });
