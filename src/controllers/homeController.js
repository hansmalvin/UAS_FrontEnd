const app = angular.module("homeApp", []);

app.controller("HomeController", function ($scope, $http) {
  $scope.user = {};

  $scope.updateUser = function () {
    const updatedUser = {
      username: $scope.user.username,
      email: $scope.user.email,
    };

    $http
      .put(`/users/${$scope.user._id}`, updatedUser)
      .then((response) => {
        alert("User updated successfully!");
        $scope.user = response.data;
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user. Please try again.");
      });
  };

  $http
    .get("/user")
    .then((response) => {
      $scope.user = response.data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  $scope.logout = function () {
    $http
      .post("/logout")
      .then(() => {
        window.location.href = "/login-and-signup";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Logout failed. Please try again.");
      });
  };

  $scope.confirmDelete = function () {
    const userId = $scope.user._id;
    console.log("Session User ID:", userId);
    if (confirm("Are you sure you want to delete your account?")) {
      $scope.deleteUser(userId);
    }
  };

  $scope.deleteUser = function (userId) {
    $http
      .delete(`/api/users/${userId}`)
      .then((response) => {
        alert("User deleted successfully");
        window.location.href = "/login-and-signup";
      })
      .catch((error) => {
        alert("Error deleting user.");
      });
  };
});

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true, // Carousel berulang
    margin: 20,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 800,
    fluidSpeed: true,
    navSpeed: 800,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1200: { items: 3 },
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

// Start Fungsi untuk ganti Tema
function toggleTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
  const themeIcon = document
    .getElementById("themeToggleIcon")
    .querySelector("i");

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeIcon.classList.remove("bi-moon");
    themeIcon.classList.add("bi-lightbulb-fill"); // Ubah ke ikon light
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeIcon.classList.remove("bi-lightbulb-fill");
    themeIcon.classList.add("bi-moon"); // Ubah ke ikon dark
  }
}

// Cek tema yang tersimpan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const themeIcon = document
    .getElementById("themeToggleIcon")
    .querySelector("i");
  if (savedTheme === "dark") {
    themeIcon.classList.add("bi-moon"); // Ikon mode gelap
  } else {
    themeIcon.classList.add("bi-lightbulb-fill"); // Ikon mode terang
  }
});
// End Fungsi untuk Ganti Tema
