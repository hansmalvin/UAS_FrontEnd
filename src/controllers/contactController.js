angular.module("contactApp", []).controller("contactController", function ($scope, $http) {
  $scope.contactForm = {};
  $scope.userMessages = [];
  $scope.selectedMessage = {};

  $scope.loadMessages = function () {
    $http.get("/contacts")
      .then((response) => {
        $scope.userMessages = response.data.data;
      })
      .catch((error) => {
        console.error("Error loading messages:", error.data.error);
        alert(error.data.error);
      });
  };

  // Send message
  $scope.sendMessage = function () {
    $http.post("/contacts", $scope.contactForm)
      .then((response) => {
        alert("Message sent successfully!");
        $scope.contactForm = {};
        $scope.loadMessages();
      })
      .catch((error) => {
        console.error("Error sending message:", error.data.error);
        alert(error.data.error);
      });
  };

  // Delete message
  $scope.deleteMessage = function (id) {
    $http.delete(`/contacts/${id}`)
      .then((response) => {
        alert("Message deleted successfully!");
        $scope.loadMessages();
      })
      .catch((error) => {
        console.error("Error deleting message:", error.data.error);
        alert(error.data.error);
      });
  };

  $scope.editMessage = function () {
    $http.put(`/contacts/${$scope.selectedMessage._id}`, $scope.selectedMessage)
      .then((response) => {
        alert("Message updated successfully!");
        $scope.loadMessages(); 
      })
      .catch((error) => {
        console.error("Error updating message:", error.data.error);
        alert(error.data.error);
      });
  };

  $scope.openEditModal = function (message) {
    $scope.selectedMessage = angular.copy(message);
    const editModal = new bootstrap.Modal(document.getElementById("editMessageModal"));
    editModal.show();
  };

  $scope.loadMessages();
});
