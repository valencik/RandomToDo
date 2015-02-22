angular.module('starter')

.controller('DashCtrl', ["$scope", "Todo", function($scope, Todo) {
    $scope.todos = Todo.find();
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

.controller('SubmissionCtrl', ["$scope", "$stateParams", "Todo", "Submission", "Message",
    function($scope, $stateParams, Todo, Submission, Message) {
        console.log("SubmissionCtrl");

        var submissionId = $stateParams.submissionId;

        $scope.submission = Submission.findById({
            id: submissionId
        });
        $scope.messages = Submission.messages({
            id: submissionId
        });

        $scope.todo = Submission.todo({
            id: submissionId
        });


        $scope.submitMessage = function(body) {

            var todoId = $scope.todo.todoId;

            Message.create({
                    body: body,
                    todoId: todoId,
                    submissionId: submissionId
                })
                .$save()
                .then(function() {
                    $scope.messages = Submission.messages({
                        id: submissionId
                    });
                    $scope.body = "";
                });
        };


    }
])

.controller('GalleryCtrl', ["$scope", "$stateParams", "Todo", "Submission",
    function($scope, $stateParams, Todo, Submission) {
        $scope.submissions = Todo.submissions({
            id: $stateParams.todoId
        });
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

        $scope.submission = {
            caption: "Enter caption...",
            medium: $scope.mediums[0],
            resource: "https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg",
            todoId: todoId
        };

        $scope.reset = function() {
            console.log('reset');
        };

        $scope.save = function(submission) {
            console.log('submit', submission);
            var record = Submission.create(submission);
            record.$save();
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
                $scope.messages = Todo.messages({
                    id: $stateParams.todoId
                });
                $scope.body = "";
            });
    };

    $scope.submissionForMessage = function(message) {
        return Message.submission({id: message.id});
    }

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
