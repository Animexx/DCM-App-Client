// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.competitions', {
                url: '/competitions',
                views: {
                    'tab-competitions': {
                        templateUrl: 'templates/tab-competitions.html',
                        controller: 'CompetitionListCtrl'
                    }
                }
            })

            .state('tab.competition', {
                url: '/competitions/:competitionId',
                views: {
                    'tab-competitions': {
                        templateUrl: 'templates/competition-overview.html',
                        controller: 'CompetitionCtrl'
                    }
                }
            })

            .state('tab.competition_admin', {
                url: '/competitions/:competitionId/administration',
                views: {
                    'tab-competitions': {
                        templateUrl: 'templates/competition-administration.html',
                        controller: 'CompetitionAdministrationCtrl'
                    }
                }
            })

            .state('tab.competition_admin_adjucator', {
                url: '/competitions/:competitionId/administration/:adjucatorId',
                views: {
                    'tab-competitions': {
                        templateUrl: 'templates/competition-administration-adjucator.html',
                        controller: 'CompetitionAdministrationAdjucatorCtrl'
                    }
                }
            })

            .state('tab.participant', {
                url: '/competitions/:competitionId/participant/:participantId',
                views: {
                    'tab-competitions': {
                        templateUrl: 'templates/participant-overview.html',
                        controller: 'ParticipantOverviewCtrl'
                    }
                }
            })

            .state('tab.participant_summary', {
                url: '/competitions/:competitionId/participant/:participantId/summary',
                views: {
                    'tab-competitions': {
                        templateUrl: 'templates/participant_summary.html',
                        controller: 'ParticipantSummaryCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(function() {
            return '/tab/competitions';
        });

    }).run(function($rootScope, $location, LoginService) {
        $rootScope.$on('$locationChangeStart', function(event, nextLoc, currentLoc) {
            if ($location.path() != "/login" && !LoginService.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });

