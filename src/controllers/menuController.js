const app = angular.module("menuApp", []);

app.controller("MenuController", function ($scope, $http) {
  // Inisialisasi user
  $scope.user = {};

  $http.get("/user").then((response) => {
    $scope.user = response.data;
  });

  // Menyimpan semua menu
  $scope.menus = [];

  // Data menu baru
  $scope.newMenu = {
    name_menu: "",
    description: "",
    category: "",
    link: "",
    availability: 0,
    img: null,
  };

  // Mendapatkan semua menu
  $scope.getMenus = function () {
    $http
      .get("/menus")
      .then((response) => {
        $scope.menus = response.data;
        console.log("Menus loaded:", $scope.menus);

        // Perbarui elemen lazy setelah data dimuat (jika menggunakan LazySizes)
        if (typeof lazySizes !== "undefined") {
          lazySizes.update();
        }
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  // Menghapus menu
  $scope.deleteMenu = function (menuId) {
    $http
      .delete(`/menus/${menuId}`)
      .then(() => {
        alert("Menu deleted successfully!");
        $scope.getMenus();
      })
      .catch((error) => {
        alert(`Error deleting menu: ${error.data.error || error.statusText}`);
      });
  };

  $scope.addMenu = function () {
    const formData = new FormData();
    formData.append("name_menu", $scope.newMenu.name_menu);
    formData.append("description", $scope.newMenu.description);
    formData.append("category", $scope.newMenu.category);
    formData.append("link", $scope.newMenu.link);
    formData.append("availability", $scope.newMenu.availability);
    if ($scope.newMenu.img) {
      formData.append("img", $scope.newMenu.img);
    }

    $http
      .post("/menus", formData, {
        headers: { "Content-Type": undefined },
      })
      .then(() => {
        alert("Menu added successfully!");
        $scope.resetNewMenu();
      })
      .catch((error) => {
        console.error("Error adding menu:", error);
        alert(`Error adding menu: ${error.data?.error || error.statusText}`);
      });
  };

  // Mengatur menu yang dipilih untuk edit
  $scope.setSelectedMenu = function (menu) {
    $scope.selectedMenu = angular.copy(menu);
    console.log("Selected menu for edit:", $scope.selectedMenu);
  };

  // Memperbarui data menu
  $scope.updateMenu = function () {
    if (!$scope.selectedMenu || !$scope.selectedMenu._id) {
      alert("Invalid menu ID");
      return;
    }

    const formData = new FormData();
    formData.append("name_menu", $scope.selectedMenu.name_menu);
    formData.append("description", $scope.selectedMenu.description);
    formData.append("category", $scope.selectedMenu.category);
    formData.append("link", $scope.selectedMenu.link);
    formData.append("availability", $scope.selectedMenu.availability);
    if ($scope.selectedMenu.img) {
      formData.append("img", $scope.selectedMenu.img);
    }

    console.log("Image selected for update:", $scope.selectedMenu.img);
    console.log("Sending update for menu ID:", $scope.selectedMenu._id);
    console.log("FormData being sent:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    $http
      .put(`/menus/${$scope.selectedMenu._id}`, formData, {
        headers: { "Content-Type": undefined },
      })
      .then((response) => {
        alert("Menu updated successfully!");
        $scope.getMenus();
      })
      .catch((error) => {
        alert(`Error updating menu: ${error.data.error || error.statusText}`);
      });
  };

  // Memperbarui ketersediaan menu
  $scope.updateAvailability = function (menuId, newAvailability) {
    if (
      newAvailability === undefined ||
      newAvailability === null ||
      newAvailability < 0
    ) {
      alert("Availability must be a non-negative number.");
      return;
    }

    $http
      .patch(`/menus/${menuId}/availability`, {
        availability: Number(newAvailability),
      })
      .then(() => {
        alert("Availability updated successfully!");
        $scope.getMenus();
      })
      .catch((error) => {
        alert(
          `Error updating availability: ${error.data.error || error.statusText}`
        );
      });
  };

  // Reset data menu baru
  $scope.resetNewMenu = function () {
    $scope.newMenu = {
      name_menu: "",
      description: "",
      category: "",
      link: "",
      availability: 0,
      img: null,
    };
  };

  // Inisialisasi data menu saat aplikasi dimuat
  $scope.getMenus();
});

// Direktif untuk mengunggah file
app.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        const model = $parse(attrs.fileModel);
        const modelSetter = model.assign;
        element.bind("change", function () {
          scope.$apply(() => {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);
