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

    .controller('CompetitionCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService) {
        $scope.competition = CompetitionService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        });
        $scope.participants = ParticipantService.query({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId
        }).$promise.then(function (list) {
                if (typeof(list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der TeilnehmerInnenliste.");
                else {
                    $scope.participants = list._embedded.competition_participant;
                }
            });

        /*
         $scope.saveData = function(name) {
         $scope.competition.name = name;
         $scope.competition.$save({competitionId: $scope.competition.id});
         }
         */
    })

    .controller('ParticipantOverviewCtrl', function ($scope, $stateParams, CompetitionService, ParticipantService, CriterionService, ParticipantRatingService, LoginService) {
        console.log($stateParams);

        $scope.ratings = {};

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
                                $scope.members[j] = [];
                                console.log(data[i][j]);
                                for (var k in data[i][j]) if (data[i][j].hasOwnProperty(k)) {
                                    $scope.members[j].push([k, data[i][j][k]]);
                                }
                            }
                        } else $scope.team_properties.push([i, data[i]]);
                    }
                    console.log($scope);
                } catch (e) {
                    alert("Keine Eigenschaften gefunden");
                }
            });

        CriterionService.query({
            competitionGroupId: window.DCM_COMPETITION_GROUP
        }).$promise.then(function (list) {
                console.log(list);
                if (typeof(list._embedded) != "object") alert("Ein Fehler ist aufgetreten beim Laden der Kriterien.");
                else {
                    for (var i = 0; i < list._embedded.competition_rating_criterion.length; i++) {
                        $scope.ratings[list._embedded.competition_rating_criterion[i].id] = 0;
                    }
                    $scope.criteria = list._embedded.competition_rating_criterion;
                }
            });

        ParticipantRatingService.get({
            competitionGroupId: window.DCM_COMPETITION_GROUP,
            competitionId: $stateParams.competitionId,
            participantId: $stateParams.participantId,
            adjucatorId: LoginService.currentUserId()
        }).$promise.then(function(ratings) {
                console.log(ratings);
            });


        $scope.saveRatings = function() {
            console.log($scope.ratings);
        };
    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function ($scope) {
    });
