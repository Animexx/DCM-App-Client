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

    .controller('CompetitionCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService, ParticipantRatingService, LoginService, UserService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.admin = 1; // @TODO

        var x = UserService.get();

        var set_rated = function (ratings) {
            console.log("======== " + ratings["participant_id"]);
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
                        var part = list._embedded.competition_participant[p];
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


    .controller('CompetitionAdministrationCtrl', function ($scope, $stateParams, CompetitionService, AdjucatorService, UserService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.admin = 1; // @TODO

        var loadAdjucatorList = function() {
            AdjucatorService.query({
                competitionGroupId: window.DCM_COMPETITION_GROUP,
                competitionId: $stateParams.competitionId
            }).$promise.then(function (adjucator_list) {
                    $scope.adjucators = adjucator_list._embedded.competition_adjucator;
                    console.log($scope.adjucators);
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
            newuser.then(function(user) {
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


    .controller('CompetitionAdministrationAdjucatorCtrl', function ($scope, $stateParams, CompetitionService, AdjucatorService, UserService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.admin = 1; // @TODO
        AdjucatorService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            adjucatorId: $stateParams.adjucatorId
        }).$promise.then(function(adj) {
            console.log(adj);
            $scope.is_adjucator = (typeof(adj.adjucator_id) != "undefined");
            console.log($scope.is_adjucator);
        });
        $scope.user = UserService.get({
            userId: $stateParams.adjucatorId
        });
    })

    .controller('ParticipantOverviewCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService, ParticipantRatingService, LoginService, RatingCalcService) {
        var ratings_obj = null;

        $scope.ratings = {};
        $scope.ratings_ignore = {};
        $scope.rating_groups_weights = {};
        $scope.rating_groups_scores = {};
        $scope.rating_groups_complete = {};
        $scope.rating_team_score = 0;
        $scope.admin = 1; // @TODO
        $scope.participantId = $stateParams.participantId;
        $scope.competitionId = $stateParams.competitionId;

        var set_ratings2scope = function () {
            var data = RatingCalcService.getRatingScores($scope.ratings);
            $scope.rating_groups_weights = data["groups_weights"];
            $scope.rating_groups_scores = data["groups_scores"];
            $scope.rating_groups_complete = data["groups_complete"];
            $scope.team_rating = data["overall_score"];
            $scope.all_complete = true;
            for (var i in data["groups_complete"]) if (data["groups_complete"].hasOwnProperty(i) && !data["groups_complete"][i]) $scope.all_complete = false;
        };

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
        $scope.openedCritGroup = 0;
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
                console.log("Participant");
                console.log(part);
                $scope.crit_group_names = rating_group_names;
                console.log(rating_group_names);
            });

        var build_rating_table = function (adjucators, ratings_unsorted) {
            var adjucators_by_id = {},
                ratings = {},
                rating_warnings = {},
                i;

            for (i in adjucators) if (adjucators.hasOwnProperty(i)) {
                adjucators_by_id[adjucators[i]["adjucator_id"]] = adjucators[i];
            }

            for (i in ratings_unsorted) if (ratings_unsorted.hasOwnProperty(i)) {
                for (var crit_id in ratings_unsorted[i].ratings) if (ratings_unsorted[i].ratings.hasOwnProperty(crit_id)) {
                    if (ratings_unsorted[i].ratings[crit_id] != 0) {
                        if (typeof(ratings[crit_id]) == "undefined") ratings[crit_id] = {};
                        ratings[crit_id][ratings_unsorted[i].adjucator_id] = ratings_unsorted[i].ratings[crit_id];
                    }
                }
            }
            console.log("Ratings:");
            console.log(ratings);

            for (i in ratings) if (ratings.hasOwnProperty(i)) {
                var sum = 0, cnt = 0;
                rating_warnings[i] = {};
                for (var j in ratings[i]) if (ratings[i].hasOwnProperty(j)) {
                    cnt++;
                    sum += parseInt(ratings[i][j]);
                }
                if (cnt >= 0) {
                    var avg = sum / cnt;
                    console.log("Avg: " + avg);
                    for (j in ratings[i]) if (ratings[i].hasOwnProperty(j)) {
                        var diff = parseInt(ratings[i][j]) - avg;
                        if (diff <= -2 || diff >= 2) rating_warnings[i][j] = true;
                    }
                }
            }
            console.log(rating_warnings);

            $scope.adjucators = adjucators_by_id;
            $scope.ratings = ratings;
            $scope.rating_warnings = rating_warnings;
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
                                build_rating_table(
                                    adjucator_list._embedded.competition_adjucator,
                                    ratings._embedded.competition_rating
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
