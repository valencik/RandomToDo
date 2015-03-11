angular.module('starter')

.controller('DashCtrl', ["$scope", "$rootScope", "Todo", function($scope,
    $rootScope, Todo) {
    $scope.todos = [];

    function initScope() {
        console.log('initScope');

        Todo.find()
            .$promise
            .then(function(results) {
                console.log(results);
                $scope.todos = results;
            });
    }

    initScope();

    // $scope.$on('$routeChangeUpdate', initScope);
    // $scope.$on('$routeChangeSuccess', initScope);
    //
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState,
            fromParams) {
            // event.preventDefault();
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
            initScope();
        })

}])

.controller('ChatsCtrl', ["$scope", "Message", function($scope, Message) {
    $scope.chats = Message.find();
}])

.controller('TodoCtrl', ["$scope", "$rootScope", "$stateParams", "Todo",
function($scope, $rootScope,
    $stateParams, Todo) {

    var refreshTodo = function(params) {
        $scope.todo = Todo.findById({
            id: params.todoId
        });
    };
    refreshTodo($stateParams);

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState,
            fromParams) {
            // event.preventDefault();
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
            refreshTodo(toParams);
        });

}])

.controller('SubmissionCtrl', ["$scope", "$state", "$stateParams", "$interval", "Todo",
    "Submission",
    "Message",
    function($scope, $state, $stateParams, $interval, Todo, Submission, Message) {
        console.log("SubmissionCtrl", $stateParams);

        var submissionId = $stateParams.submissionId;

        $scope.submission = Submission.findById({
            id: submissionId
        });
        $scope.todo = Submission.todo({
            id: submissionId
        });
        $scope.messages = [];

        var refreshFn = function() {
            try {
                Submission.messages({
                        id: submissionId
                    })
                    .$promise
                    .then(function(messages) {
                        $scope.messages = messages;
                    }, function(error) {
                        console.log('error refreshing messages',
                            JSON.stringify(error));
                    });
            } catch (error) {
                console.error(error);
            }
        };
        $interval(refreshFn, 1000);
        refreshFn();

        $scope.predicate = 'created';


        $scope.submitMessage = function(body) {

            console.log(body, $scope.submission);

            var todoId = $scope.submission.todoId;

            console.log(todoId);

            Message.create({
                body: body,
                todoId: todoId,
                submissionId: submissionId
            }, function() {
                console.log('save finished', JSON.stringify(
                    arguments));

                // clear field
                $scope.body = "";
                var els = document.querySelectorAll('.submission-comment');
                for (i = 0; i < els.length; i++) {
                    els[i].value = '';
                };

                refreshFn();

            });
        };

        $scope.deleteSubmission = function(submission) {
            var todoId = $scope.submission.todoId;

            Submission.deleteById({
                    id: submission.id
                })
                .$promise
                .then(function() {
                    console.log('deleted');
                    $state.go('todo.gallery', {
                        todoId: todoId
                    });
                }, function() {
                    console.log('not deleted');
                    $state.go('todo.gallery', {
                        todoId: todoId
                    });
                });
        };

    }
])

.controller('GalleryCtrl', ["$scope", "$rootScope", "$stateParams", "Todo",
    "Submission",
    function($scope, $rootScope, $stateParams, Todo, Submission) {

        $scope.submissions = [];

        function initScope(params) {
            console.log('initScope');

            Todo.submissions({
                    id: params.todoId
                })
                .$promise
                .then(function(results) {
                    console.log(results);
                    $scope.submissions = results;
                });
        }

        initScope($stateParams);

        // $scope.$on('$routeChangeUpdate', initScope);
        // $scope.$on('$routeChangeSuccess', initScope);
        //
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState,
                fromParams) {
                    console.log('$stateChangeStart');
                    console.log(JSON.stringify(toState, null, 4));
                    console.log(JSON.stringify(toParams, null, 4));
                // event.preventDefault();
                // transitionTo() promise will be rejected with
                // a 'transition prevented' error
                initScope(toParams);
            })
    }
])

.controller('SubmitCtrl', ["$scope", "$stateParams", "$state", "$cordovaCamera",
    "Todo", "Submission",
    function($scope, $stateParams, $state, $cordovaCamera, Todo,
        Submission) {

        var todoId = $stateParams.todoId;

        $scope.mediums = [
            "Photo",
            "Video",
            "Audio"
        ];

        $scope.fileData = "";

        $scope.submission = {
            caption: "",
            medium: $scope.mediums[0],
            resource: null, //"https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg",
            todoId: todoId,
        };

        $scope.save = function(submission) {
            // console.log('submit', submission);

            // submission.resource = $scope.fileData;
            var record = Submission.create(submission)
                .$promise
                .then(function(result) {
                    console.log('then', JSON.stringify(result));

                    $state.go('submission', {
                        submissionId: result.id
                    });

                }, function(error) {
                    console.log('fail', JSON.stringify(error));
                });
        };

        // $scope.storeFile =
        //     function(el) {
        //         console.log('storeFile', el);
        //
        //         var file = el.files[
        //             0];
        //         var reader = new FileReader();
        //
        //         reader.onloadend = function() {
        //             console.log(reader.result);
        //             $scope.fileData = reader.result;
        //             // preview.src = reader.result;
        //             $scope.save($scope.submission);
        //         }
        //
        //         if (file) {
        //             reader.readAsDataURL(file);
        //         } else {
        //             // preview.src = "";
        //         }
        //     };

        $scope.takePhoto = function(submission) {

            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(
                imageData) {
                var image = document.getElementById(
                    'myImage');
                var src = "data:image/jpeg;base64," +
                    imageData;
                // image.src
                //   console.log('imgSrc', src);
                submission.resource = src;
            }, function(err) {
                // error
            });

        };

    }
])

.controller('FeedCtrl', ["$scope", "$stateParams", "$interval", "Todo",
    "Message",
    function(
        $scope, $stateParams, $interval, Todo, Message) {
        var todoId = $stateParams.todoId;
        $scope.messages = [];


        var refreshFn = function() {
            console.log('refreshing');
            Todo.messages({
                    id: todoId,
                })
                .$promise
                .then(function(results) {
                    console.log('refresh');
                    $scope.messages = results;
                });
        };
        $interval(refreshFn, 1000);

        $scope.predicate = 'created';

        $scope.submitMessage = function(body) {

            Message.create({
                body: body,
                todoId: todoId
            }, function() {
                console.log('save finished');

                // clear field
                $scope.body = "";
                var els = document.querySelectorAll('.submission-comment');
                for (i = 0; i < els.length; i++) {
                    els[i].value = '';
                };

                refreshFn();

            });
        };


        $scope.submissionForMessage = function(message) {
            return Message.submission({
                id: message.id
            });
        };

    }
])

// .controller('FriendsCtrl', ["$scope", "Friends", function($scope, Friends) {
//   $scope.friends = Friends.all();
// }])
//
// .controller('FriendDetailCtrl', ["$scope", "Friends", function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// }])
//
// .controller('AccountCtrl', ["$scope", function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// }]);
