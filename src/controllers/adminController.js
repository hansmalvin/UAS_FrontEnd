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
  $scope.searchQuery = "@";
  $scope.userMessages = [];
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

  // testing
    $scope.loadMessages = function () {
    $http.get("/contacts/all")
      .then((response) => {
        $scope.userMessages = response.data.data;
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
        alert("Error loading messages.");
      });
  };

  // Delete a message
  $scope.deleteMessage = function (id) {
    $http.delete(`/contacts/${id}`)
      .then((response) => {
        alert("Message deleted successfully!");
        $scope.loadMessages();
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
        alert("Error deleting message.");
      });
  };

// Fungsi relevansi untuk sorting
  $scope.calculateRelevance = function (user, query) {
    const usernameIndex = (user.username || "").toLowerCase().indexOf(query);
    const emailIndex = (user.email || "").toLowerCase().indexOf(query);

    // Jika query tidak ditemukan, berikan nilai sangat rendah
    if (usernameIndex === -1 && emailIndex === -1) return Infinity;

    // Prioritaskan username lebih tinggi dari email
    if (usernameIndex !== -1 && emailIndex !== -1) {
      return Math.min(usernameIndex, emailIndex);
    }
    return usernameIndex !== -1 ? usernameIndex : emailIndex;
  };

  // Filter dan sorting data berdasarkan query
  $scope.filterAndSortUsers = function () {
    if (!$scope.searchQuery) {
      return $scope.users; // Tampilkan semua jika query kosong
    }

    const query = $scope.searchQuery.toLowerCase();
    return $scope.users
      .filter((user) =>
        (user.username || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query)
      )
      .sort((a, b) =>
        $scope.calculateRelevance(a, query) - $scope.calculateRelevance(b, query)
      );
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
  $scope.loadMessages();
});