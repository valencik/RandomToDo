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

.controller('TodoCtrl', ["$scope", "$stateParams", "Todo", function($scope,
    $stateParams, Todo) {
    $scope.todo = Todo.findById({
        id: $stateParams.todoId
    });
}])

.controller('SubmissionCtrl', ["$scope", "$state", "$stateParams", "Todo",
    "Submission",
    "Message",
    function($scope, $state, $stateParams, Todo, Submission, Message) {
        console.log("SubmissionCtrl");

        var submissionId = $stateParams.submissionId;

        $scope.submission = Submission.findById({
            id: submissionId
        });
        $scope.messages = [];

        Submission.messages({
                id: submissionId
            })
            .$promise
            .then(function(messages) {
                $scope.messages = messages;
            });

        $scope.todo = Submission.todo({
            id: submissionId
        });

        $scope.submitMessage = function(body) {

            console.log(body, $scope.submission);

            var todoId = $scope.submission.todoId;

            console.log(todoId);

            Message.create({
                body: body,
                todoId: todoId,
                submissionId: submissionId
            }, function() {
                console.log('save finished');

                // clear field
                $scope.body = "";
                document.getElementById(
                    'submission-comment').value = '';

                Submission.messages({
                        id: submissionId
                    })
                    .$promise
                    .then(function(messages) {
                        $scope.messages = messages;
                    });

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

        function initScope() {
            console.log('initScope');

            Todo.submissions({
                    id: $stateParams.todoId
                })
                .$promise
                .then(function(results) {
                    console.log(results);
                    $scope.submissions = results;
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
    }
])

.controller('SubmitCtrl', ["$scope", "$stateParams", "Todo", "Submission",
    function($scope, $stateParams, Todo, Submission) {

        var todoId = $stateParams.todoId;

        $scope.mediums = [
            "Photo",
            "Video",
            "Audio"
        ];

        $scope.fileData = "";

        $scope.submission = {
            caption: "Enter caption...",
            medium: $scope.mediums[0],
            resource: null, //"https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg",
            todoId: todoId,
        };

        $scope.save = function(submission) {
            console.log('submit', submission);
            submission.resource = $scope.fileData;
            var record = Submission.create(submission);
            record.$save()
            .then(function(){
                console.log('then', arguments);
            },function(){
                console.log('fail', arguments);
            });
        };

        $scope.storeFile =
            function(el) {
                console.log('storeFile', el);

                var file = el.files[
                    0];
                var reader = new FileReader();

                reader.onloadend = function() {
                    console.log(reader.result);
                    $scope.fileData = reader.result;
                    // preview.src = reader.result;
                    $scope.save($scope.submission);
                }

                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    // preview.src = "";
                }
            };

    }
])

.controller('FeedCtrl', ["$scope", "$stateParams", "Todo", "Message", function(
    $scope, $stateParams, Todo, Message) {
    var todoId = $stateParams.todoId;
    $scope.messages = Todo.messages({
        id: $stateParams.todoId
    });

    $scope.submitMessage = function(body) {

        Message.create({
                body: body,
                todoId: todoId
            })
            .$save()
            .then(function() {
                Todo.messages({
                        id: $stateParams.todoId
                    })
                    .$promise
                    .then(function(result) {
                        $scope.messages = result;
                    });
                $scope.body = "";
            });
    };

    $scope.submissionForMessage = function(message) {
        return Message.submission({
            id: message.id
        });
    };

}])

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
