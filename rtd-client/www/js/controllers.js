function cleanRecords(records) {
  return records.map(function(item) {
    return item.rtd;
  });
}

function cleanRecord(record) {
  return record.rtd;
}

angular.module('starter')

.controller('DashCtrl', ["$scope", "Todo", function($scope, Todo) {
  $scope.todos = [];
  Todo.find()
    .$promise
    .then(function(todos){
      $scope.todos = cleanRecords(todos);
      //console.log($scope.todos);
    });
}])


.controller('ChatsCtrl', ["$scope", "Message", function($scope, Message) {

    $scope.chats = [];
    Message.find()
      .$promise
      .then(function(records){
        $scope.chats = cleanRecords(records);
        // console.log(records);
      });

}])

.controller('ChatDetailCtrl', ["$scope", "Chats", function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
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
