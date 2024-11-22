const app = angular.module("homeApp", []);

app.controller('HomeController', function ($scope, $http) {
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
});
