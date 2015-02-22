angular.module('starter')

.controller('DashCtrl', ["$scope", "Todo", function($scope, Todo) {
  $scope.todos = [];
  Todo.find()
    .$promise
    .then(function(todos){
      $scope.todos = todos;
      //console.log($scope.todos);
    });
}])


.controller('ChatsCtrl', ["$scope", "Message", function($scope, Message) {

    $scope.chats = [];
    Message.find()
      .$promise
      .then(function(records){
        $scope.chats = records;
        // console.log(records);
      });

}])

.controller('ChatDetailCtrl', ["$scope", "Chats", function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}])

.controller('GalleryCtrl', ["$scope", "Submissions", function($scope, Submissions) {
  $scope.submissions = Submissions.all();
}])

.controller('FriendsCtrl', ["$scope", "Friends", function($scope, Friends) {
  $scope.friends = Friends.all();
}])

.controller('FriendDetailCtrl', ["$scope", "Friends", function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
}])

.controller('AccountCtrl', ["$scope", function($scope) {
  $scope.settings = {
    enableFriends: true
  };
}]);
