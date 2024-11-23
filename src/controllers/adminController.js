const app = angular.module("adminApp", []);

app.controller("AdminController", function ($scope, $http) {
    $scope.loginDataAdmin = {
      email: "",
      password: "",
    };
  
    $scope.loginAdmin = function () {
      $http
        .post("/loginAdmin", $scope.loginDataAdmin)
        .then((response) => {
          alert("Login successful!");
          window.location.href = "/adminDashboard";
        })
        .catch((error) => {
          alert(error.data || "Invalid login credentials.");
        });
    };
  });

app.controller("AdminDashboardController", function ($scope, $http) {
  // get all users
  $scope.getUsers = function () {
    $http.get("/users")
      .then((response) => {
        $scope.users = response.data;
      })
      .catch((error) => {
        alert("Error fetching users.");
      });
  };
  
  // Delete user by admin
  $scope.deleteUser = function (userId) {
    $http.delete(`/users/${userId}`)
      .then((response) => {
        alert("User deleted successfully");
        $scope.getUsers();
      })
      .catch((error) => {
        alert("Error deleting user.");
      });
  };

  $scope.logoutAdmin = function () {
    $http.post("/logoutAdmin")
      .then(() => {
        alert("Logout successful!");
        window.location.href = "/Admin";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Logout failed. Please try again.");
      });
  };
  
  $scope.getUsers();
});
  
  