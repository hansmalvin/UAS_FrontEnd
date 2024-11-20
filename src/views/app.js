const app = angular.module("authApp", []);

app.controller("AuthController", function ($scope, $http) {
  // Data untuk Sign Up
  $scope.signupData = {
    username: "",
    email: "",
    password: "",
  };

  // Data untuk Login
  $scope.loginData = {
    email: "",
    password: "",
  };

  // Sign Up Function
  $scope.signup = function () {
    $http
      .post("/signup", $scope.signupData)
      .then((response) => {
        alert(response.data);
        $scope.signupData = {};
      })
      .catch((error) => {
        alert(error.data);
      });
  };

  // Login Function
  $scope.login = function () {
    $http
      .post("/login", $scope.loginData)
      .then((response) => {
        alert(response.data);
        $scope.loginData = {};
        window.location.href="/menu"
      })
      .catch((error) => {
        alert(error.data);
      });
  };
});
