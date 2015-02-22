// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'lbServices'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(
                true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, LoopBackResourceProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup the home dashboard
    .state('dash', {
        url: "/dash",
        templateUrl: "templates/dash.html",
        controller: 'DashCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('todo', {
        url: "/todo/:todoId",
        templateUrl: "templates/todo-tabs.html"
    })

    .state('todo.gallery', {
        url: '/gallery',
        views: {
            'todo-gallery': {
                templateUrl: 'templates/todo-gallery.html',
                controller: 'GalleryCtrl'
            }
        }
    })

    .state('todo.feed', {
        url: '/feed',
        views: {
            'todo-feed': {
                templateUrl: 'templates/todo-feed.html',
                controller: 'FeedCtrl'
            }
        }
    })

    .state('todo.submit', {
        url: '/submit',
        views: {
            'todo-submit': {
                templateUrl: 'templates/todo-submit.html',
                controller: 'SubmitCtrl'
            }
        }
    })

    // .state('tab.account', {
    //     url: '/account',
    //     views: {
    //         'tab-account': {
    //             templateUrl: 'templates/tab-account.html',
    //             controller: 'AccountCtrl'
    //         }
    //     }
    // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/dash');

    // Change the URL where to access the LoopBack REST API server
    LoopBackResourceProvider.setUrlBase('http://172.21.44.141:3000/api');

});
