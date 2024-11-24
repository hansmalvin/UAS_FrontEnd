const app = angular.module("homeApp", []);

app.controller('HomeController', function ($scope, $http) {
  $scope.user = {};

  $scope.updateUser = function () {
    const updatedUser = {
      username: $scope.user.username,
      email: $scope.user.email
    };
  
  $http.put(`/users/${$scope.user._id}`, updatedUser)
    .then((response) => {
      alert("User updated successfully!");
      $scope.user = response.data;
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    });
  };
  

  $http.get('/user')
    .then((response) => {
      $scope.user = response.data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  $scope.logout = function () {
    $http.post("/logout")
      .then(() => {
        window.location.href = "/login-and-signup";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Logout failed. Please try again.");
      });
  };

  //confirm delete terus redirect ke delete http
  $scope.confirmDelete = function (userId) {
    if (confirm("Are you sure you want to delete your account?")) {
      $scope.deleteUser(userId);
    }
  };

  $scope.deleteUser = function (userId) {
    $http.delete(`/users/${userId}`)
      .then((response) => {
        alert("User deleted successfully");
        window.location.href = "/signup";
      })
      .catch((error) => {
        alert("Error deleting user.");
      });
  };
  
});
