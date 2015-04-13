angular.module('CardReader', ['ionic', 'CardReader.controllers', 'CardReader.directives', 'ngCordova'])

.run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {

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

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        //
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/menu/main.html",
            controller: 'MainController'
        })

        .state('menu.card', {
            url: "/card",
            views: {
                'menuContent': {
                    templateUrl: "templates/menu/card.html",
                    controller: 'CardsMenuController'
                }
            }
        })

        .state('menu.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/menu/settings.html"
                }
            }
        })

        .state('menu.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "templates/menu/about.html"
                }
            }
        });

    // Дефалтовая вьюха если нет совпадений по url
    $urlRouterProvider.otherwise('/menu/card');
});
