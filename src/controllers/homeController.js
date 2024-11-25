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

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true, // Carousel berulang
    margin: 20, // Spasi antar item
    nav: true, // Tombol navigasi
    dots: true, // Titik navigasi
    autoplay: true, // Otomatis bergeser
    autoplayTimeout: 3000, // Interval waktu autoplay (ms)
    autoplayHoverPause: true, // Pause ketika mouse hover
    smartSpeed: 800, // Kecepatan transisi (ms)
    fluidSpeed: true, // Mengikuti fluiditas user scroll
    navSpeed: 800, // Kecepatan navigasi (ms)
    responsive: {
      0: { items: 1 }, // 1 item untuk layar kecil
      768: { items: 2 }, // 2 item untuk tablet
      1200: { items: 3 }, // 3 item untuk layar besar
    },
  });
});

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
    function counter(id, start, end, duration) {
      let obj = document.getElementById(id),
        current = start,
        range = end - start,
        increment = end > start ? 1 : -1,
        step = Math.abs(Math.floor(duration / range)),
        timer = setInterval(() => {
          current += increment;
          obj.textContent = current;
          if (current == end) {
            clearInterval(timer);
          }
        }, step);
    }
  
    // Memanggil fungsi counter untuk elemen-elemen tertentu
    counter("count1", 0, 10, 3000);
    counter("count2", 100, 20, 4000);
    counter("count3", 0, 30, 5000);
    counter("count4", 0, 10, 3000);
  });
  
