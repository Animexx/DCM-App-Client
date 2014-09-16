angular.module('starter.services', ['ngResource'])
    .factory('RatingCalcService', [function () {
        var CRITERIA = [
            {
                "name": "Teilnehmer 1: Kostüm",
                "group_id": 0,
                "criteria": [
                    {
                        "id": 1,
                        "name": "Gesamteindruck",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 4,
                        "group_leader": true
                    },
                    {
                        "id": 2,
                        "name": "Näharbeiten",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 3,
                        "name": "Bastelarbeiten",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 4,
                        "name": "Frisur/MakeUp",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 5,
                        "name": "Material",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 6,
                        "name": "Proportionen",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 7,
                        "name": "Farbgenauigkeit",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 8,
                        "name": "Aufwand",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    }
                ]
            },
            {
                "name": "Teilnehmer 1: Auftritt",
                "group_id": 1,
                "criteria": [
                    {
                        "id": 9,
                        "name": "Gesamteindruck",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 3,
                        "group_leader": true
                    },
                    {
                        "id": 10,
                        "name": "Darstellung",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 11,
                        "name": "Auftrittsidee",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 12,
                        "name": "Vertonung/Text",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 13,
                        "name": "Material",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 14,
                        "name": "Publikum",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    }
                ]
            },
            {
                "name": "Teilnehmer 2: Kostüm",
                "group_id": 2,
                "criteria": [
                    {
                        "id": 15,
                        "name": "Gesamteindruck",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 4,
                        "group_leader": true
                    },
                    {
                        "id": 16,
                        "name": "Näharbeiten",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 17,
                        "name": "Bastelarbeiten",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 18,
                        "name": "Frisur/MakeUp",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 19,
                        "name": "Material",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 20,
                        "name": "Proportionen",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 21,
                        "name": "Farbgenauigkeit",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 22,
                        "name": "Aufwand",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    }
                ]
            },
            {
                "name": "Teilnehmer 2: Auftritt",
                "group_id": 3,
                "criteria": [
                    {
                        "id": 23,
                        "name": "Gesamteindruck",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 3,
                        "group_leader": true
                    },
                    {
                        "id": 24,
                        "name": "Darstellung",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 25,
                        "name": "Auftrittsidee",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 26,
                        "name": "Vertonung/Text",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 27,
                        "name": "Material",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    },
                    {
                        "id": 28,
                        "name": "Publikum",
                        "values": [1, 2, 3, 4, 5, 6, 7, 8],
                        "weight_base": 1,
                        "group_leader": false
                    }
                ]
            }
        ];

        return {
            getCriteria: function () {
                return CRITERIA;
            },

            getCriteriaIDs: function () {
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
            },

            getRatingScores: function (crits) {
                var groups_weights = {},
                    groups_scores = {},
                    groups_complete = {},
                    overall_score = 0,
                    i, j;

                for (i in CRITERIA) if (CRITERIA.hasOwnProperty(i)) {
                    var ignores = 0,
                        weight = 0,
                        complete = true;

                    for (j in CRITERIA[i]["criteria"]) if (CRITERIA[i]["criteria"].hasOwnProperty(j)) {
                        if (CRITERIA[i]["criteria"][j]["group_leader"]) {
                            weight = CRITERIA[i]["criteria"][j]["weight_base"];
                        } else {
                            if (typeof(crits[CRITERIA[i]["criteria"][j]["id"]]) != "undefined" && crits[CRITERIA[i]["criteria"][j]["id"]] == -1) ignores++;
                        }
                    }
                    groups_weights[i] = weight + ignores;

                    groups_scores[i] = 0;
                    for (j in CRITERIA[i]["criteria"]) if (CRITERIA[i]["criteria"].hasOwnProperty(j)) {
                        if (typeof(crits[CRITERIA[i]["criteria"][j]["id"]]) == "undefined" || crits[CRITERIA[i]["criteria"][j]["id"]] == 0) {
                            complete = false;
                            continue;
                        }
                        var curr_rat = parseInt(crits[CRITERIA[i]["criteria"][j]["id"]]);
                        if (CRITERIA[i]["criteria"][j]["group_leader"]) {
                            groups_scores[i] += groups_weights[i] * curr_rat;
                        } else {
                            if (curr_rat >= 0) groups_scores[i] += curr_rat;
                        }
                    }

                    overall_score += groups_scores[i];
                    groups_complete[i] = complete;
                }
                return {
                    "groups_weights": groups_weights,
                    "groups_scores": groups_scores,
                    "groups_complete": groups_complete,
                    "overall_score": overall_score
                };
            },

            calcGesamteindruckWeight: function (criteria, ratings) {
                console.log(criteria);
                console.log(ratings);
            }
        }
    }])

    .factory('LoginService', ['Base64', '$http', '$location', function (Base64, $http, $location) {
        var currentUsername = (typeof(localStorage.dcm_username) != "undefined" ? localStorage.dcm_username : null),
            currentPassword = (typeof(localStorage.dcm_password) != "undefined" ? localStorage.dcm_password : null),
            currentId = (typeof(localStorage.dcm_user_id) != "undefined" ? localStorage.dcm_user_id : null);

        if (currentUsername && currentPassword && currentId) {
            var encoded = Base64.encode(currentUsername + ':' + currentPassword);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        }

        return {
            login: function (username, password) {
                localStorage.dcm_username = currentUsername = username;
                localStorage.dcm_password = currentPassword = password;
                localStorage.dcm_user_id = null;

                var encoded = Base64.encode(username + ':' + password);
                $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

                var onFail = function () {
                    localStorage.dcm_username = currentUsername = null;
                    localStorage.dcm_password = currentPassword = null;
                    localStorage.dcm_user_id = currentId = null;
                    $location.path('/');
                    alert("Ein Fehler beim Login");
                };

                $http({
                    method: "get",
                    url: window.DCM_REST_BASE + "me",
                    params: {},
                    data: {}
                }).then(function (data) {
                    var ret = data["data"];
                    if (ret["success"]) {
                        localStorage.dcm_user_id = currentId = ret["id"];
                    } else {
                        onFail();
                    }
                }, onFail);
            },
            logout: function () {
                currentUsername = localStorage.dcm_username = null;
                currentPassword = localStorage.dcm_password = null;
            },
            isLoggedIn: function () {
                return (currentUsername !== null && currentPassword !== null);
            },
            currentUsername: function () {
                return currentUsername;
            },
            currentUserId: function () {
                return currentId;
            }
        }
    }])

    .factory('CompetitionService', ['$resource',
        function ($resource) {
            return $resource(window.DCM_REST_BASE + 'group/:competitionGroupId/competition/:competitionId', {}, {
                query: {method: 'GET', params: {}, isArray: false}
            });
        }])

    .factory('ParticipantService', ['$resource',
        function ($resource) {
            return $resource(window.DCM_REST_BASE + 'group/:competitionGroupId/competition/:competitionId/participant/:participantId', {}, {
                query: {method: 'GET', params: {}, isArray: false}
            });
        }])

    .factory('AdjucatorService', ['$resource',
        function ($resource) {
            return $resource(window.DCM_REST_BASE + 'group/:competitionGroupId/competition/:competitionId/adjucator/:adjucatorId', {}, {
                query: {method: 'GET', params: {}, isArray: false}
            });
        }])

    .factory('CriterionService', [function () {

    }])

    /*
     .factory('CriterionService', ['$resource',
     function ($resource) {
     return $resource(window.DCM_REST_BASE + 'group/:competitionGroupId/criterion/:criterionId', {}, {
     query: {method: 'GET', params: {}, isArray: false}
     });
     }])
     */

    .factory('ParticipantRatingService', ['$resource',
        function ($resource) {
            return $resource(window.DCM_REST_BASE + 'group/:competitionGroupId/competition/:competitionId/participant/:participantId/rating/:adjucatorId', {competitionGroupId: '@id'}, {
                query: {method: 'GET', params: {}, isArray: false}
            });
        }])

    .factory('Base64', function () {
        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    });
;
