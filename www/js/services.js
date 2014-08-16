angular.module('starter.services', ['ngResource'])

    .factory('LoginService', ['Base64', '$http', function (Base64, $http) {
        var currentUsername = (typeof(localStorage.dcm_username) != "undefined" ? localStorage.dcm_username : null),
            currentPassword = (typeof(localStorage.dcm_password) != "undefined" ? localStorage.dcm_password : null);

        if (currentUsername && currentPassword) {
            var encoded = Base64.encode(currentUsername + ':' + currentPassword);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
        }

        return {
            login: function (username, password) {
                localStorage.dcm_username = currentUsername = username;
                localStorage.dcm_password = currentPassword = password;
                var encoded = Base64.encode(username + ':' + password);
                $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            },
            logout: function () {
                currentUsername = localStorage.dcm_username = null;
                currentPassword = localStorage.dcm_password = null;
            },
            isLoggedIn: function () {
                return (currentUsername !== null && currentPassword !== null);
            },
            currentUser: function () {
                return currentUsername;
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

    .factory('CriterionService', ['$resource',
        function ($resource) {
            return $resource(window.DCM_REST_BASE + 'group/:competitionGroupId/criterion/:criterionId', {}, {
                query: {method: 'GET', params: {}, isArray: false}
            });
        }])

/**
 * A simple example service that returns some data.
 */
    .
    factory('Friends', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var friends = [
            { id: 0, name: 'Scruff McGruff' },
            { id: 1, name: 'G.I. Joe' },
            { id: 2, name: 'Miss Frizzle' },
            { id: 3, name: 'Ash Ketchum' }
        ];

        return {
            all: function () {
                return friends;
            },
            get: function (friendId) {
                // Simple index lookup
                return friends[friendId];
            }
        }
    })
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
