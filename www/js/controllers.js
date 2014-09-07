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

    .controller('ParticipantOverviewCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService, CriterionService, ParticipantRatingService, LoginService) {
        var ratings_obj = null;

        $scope.ratings = {};
        $scope.admin = 1; // @TODO
        $scope.participantId = $stateParams.participantId;
        $scope.competitionId = $stateParams.competitionId;

        ParticipantService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            participantId: $stateParams.participantId
        }).$promise.then(function (participant) {
                $scope.members = [];
                $scope.team_properties = [];
                try {
                    var data = JSON.parse(participant.data);
                    for (var i in data) if (data.hasOwnProperty(i)) {
                        if (i == "members") {
                            for (var j = 0; j < data[i].length; j++) {
                                var member = {
                                    "name": "[Nicht gefunden]",
                                    "group_auftritt": j * 2 + 0,
                                    "group_kostuem": j * 2 + 1,
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

        CriterionService.query({
            competitionGroupId: window.DCM_COMPETITION_GROUP
        }).$promise.then(function (list) {
                if (typeof(list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der Kriterien.");
                else {
                    var criteria_id = [],
                        criteria_groups = [];
                    //$scope.criteria = list._embedded.competition_rating_criterion;
                    for (var i = 0; i < list._embedded.competition_rating_criterion.length; i++) {
                        var crit = list._embedded.competition_rating_criterion[i];
                        crit["values"] = [];
                        for (var j = 1; j <= crit["max_rating"]; j++) crit["values"].push(j);
                        criteria_id.push(crit.id);
                        if (typeof(criteria_groups[crit.group_id]) == "undefined") criteria_groups[crit.group_id] = {
                            "group_id": crit.group_id,
                            "name": "@TODO",
                            "crits": []
                        };
                        if (crit.group_id == 0) criteria_groups[crit.group_id]["name"] = "Teilnehmer 1: Auftritt";
                        if (crit.group_id == 1) criteria_groups[crit.group_id]["name"] = "Teilnehmer 1: Kostüm";
                        if (crit.group_id == 2) criteria_groups[crit.group_id]["name"] = "Teilnehmer 2: Auftritt";
                        if (crit.group_id == 3) criteria_groups[crit.group_id]["name"] = "Teilnehmer 2: Kostüm";
                        criteria_groups[crit.group_id].crits.push(crit);
                    }
                    $scope.crit_groups = criteria_groups;

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
                            }
                            ratings_obj = ratings;
                        });
                }
            });

        $scope.saveRatings = function () {
            ratings_obj.ratings = $scope.ratings;
            ratings_obj.$save({
                competitionGroupId: window.DCM_COMPETITION_GROUP,
                competitionId: $stateParams.competitionId,
                participantId: $stateParams.participantId,
                adjucatorId: LoginService.currentUserId()
            });
        };

        $scope.setOpenedCritGroup = function(group_id) {
            $scope.openedCritGroup = group_id;
        }
        $scope.openedCritGroup = 0;
    })

    .controller('ParticipantSummaryCtrl', function ($scope, $interval, $stateParams, ParticipantService, CompetitionService, CriterionService, ParticipantRatingService, AdjucatorService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        ParticipantService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            participantId: $stateParams.participantId
        }).$promise.then(function(part) {
                $scope.participant = part;
                var data = JSON.parse(part["data"]),
                    members = data["members"],
                    rating_group_names = {};
                for (var i = 0; i < members.length; i++) {
                    rating_group_names[i*2 + 0] = members[i]["Name"] + ": Kostüm";
                    rating_group_names[i*2 + 1] = members[i]["Name"] + ": Auftritt";
                }
                console.log("Participant");
                console.log(part);
                $scope.crit_group_names = rating_group_names;
                console.log(rating_group_names);
            });

        var build_rating_table = function (criteria, adjucators, ratings) {
            console.log(criteria);
            console.log(adjucators);
            console.log(ratings);

            var adjucators_by_id = {},
                criteria_by_id = {},
                criteria_by_pos = {},
                i;

            for (i in adjucators) if (adjucators.hasOwnProperty(i)) {
                adjucators_by_id[adjucators[i]["adjucator_id"]] = adjucators[i];
            }
            for (i in criteria) if (criteria.hasOwnProperty(i)) {
                var crit = criteria[i];
                crit["ratings"] = {};
                criteria_by_id[criteria[i]["id"]] = crit;
            }
            for (i in ratings) if (ratings.hasOwnProperty(i)) {
                for (var crit_id in ratings[i].ratings) if (ratings[i].ratings.hasOwnProperty(crit_id)) {
                    criteria_by_id[crit_id]["ratings"][ratings[i].adjucator_id] = ratings[i].ratings[crit_id];
                }
            }
            for (i in criteria_by_id) if (criteria_by_id.hasOwnProperty(i)) {
                crit = criteria_by_id[i];
                if (typeof(criteria_by_pos[crit["group_id"]]) == "undefined") criteria_by_pos[crit["group_id"]] = {
                    "group_id": crit["group_id"],
                    "crits": {}
                };
                criteria_by_pos[crit["group_id"]]["crits"][crit["order"]] = crit;
            }

            $scope.adjucators = adjucators_by_id;
            $scope.criteria = criteria_by_pos;
        };

        var load_rating_table = function () {
            CriterionService.query({
                competitionGroupId: window.DCM_COMPETITION_GROUP
            }).$promise.then(function (criterion_list) {
                    if (typeof(criterion_list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der Kriterien.");
                    else {
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
                                                criterion_list._embedded.competition_rating_criterion,
                                                adjucator_list._embedded.competition_adjucator,
                                                ratings._embedded.competition_rating
                                            )
                                        });
                                }
                            });
                    }
                }
            );
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
