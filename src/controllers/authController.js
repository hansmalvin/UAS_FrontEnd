const app = angular.module("authApp", []);

app.controller("AuthController", function ($scope, $http) {
  // Data untuk Sign Up
  // $scope.signupData = {
  //   username: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: ""
  // };

  // Data untuk Login
  $scope.loginData = {
    email: "",
    password: "",
  };

  // Sign Up Function
  $scope.signup = function () {
    if ($scope.signupData.password !== $scope.signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const signupData = { 
      username: $scope.signupData.username, 
      email: $scope.signupData.email, 
      password: $scope.signupData.password,
      confirmPassword: $scope.signupData.confirmPassword,
    };
    $http
      .post("/signup", signupData)
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

const container = document.getElementById("container");
const formContent = document.getElementById("form-content");
const imageText = document.getElementById("image-text");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

function showLogin() {
  container.classList.add("right-panel-active");
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  imageText.innerText = "Welcome Back!";
}

function showSignup() {
  container.classList.remove("right-panel-active");
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  imageText.innerText = "Let's Get Started!";
}
