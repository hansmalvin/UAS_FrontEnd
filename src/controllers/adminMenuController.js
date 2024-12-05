const app = angular.module("menuApp", []);

app.controller("MenuController", function ($scope, $http) {
  $scope.newMenu = {
    title: "",
    description: "",
    link: "",
    img: null,
    rating: 0, 
  };

  $scope.menus = [];

  // Mendapatkan semua latihan
  $scope.getMenus = function () {
    $http
      .get("/menus")
      .then((response) => {
        console.log("Fetched menus:", response.data); 
        $scope.menus = response.data;
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  // Menghapus latihan
  $scope.deleteMenu = function (menuId) {
    $http
      .delete(`/menus/${menuId}`)
      .then(() => {
        alert("Menu deleted successfully!");
        $scope.getMenus();
      })
      .catch((error) => {
        alert(
          `Error deleting menu: ${error.data.error || error.statusText}`
        );
      });
  };

  // Menambah latihan baru
  $scope.addMenu = function () {
    const formData = new FormData();
    formData.append("title", $scope.newMenu.title);
    formData.append("description", $scope.newMenu.description);
    formData.append("link", $scope.newMenu.link);
    formData.append("rating", $scope.newMenu.rating);
    if ($scope.newMenu.img) {
      formData.append("img", $scope.newMenu.img);
    }

    $http
      .post("/menus", formData, {
        headers: { "Content-Type": undefined },
      })
      .then((response) => {
        alert("Menu added successfully!");
        $scope.getMenus();
        $scope.resetNewMenu();
      })
      .catch((error) => {
        alert(`Error adding menu: ${error.data.error || error.statusText}`);
      });
  };

  $scope.setSelectedMenu = function (menu) {
    $scope.selectedMenu = angular.copy(menu);
    console.log("Selected menu for edit:", $scope.selectedMenu);
  };

  $scope.updateMenu = function () {
    if (!$scope.selectedMenu || !$scope.selectedMenu._id) {
      alert("Invalid menu ID");
      return;
    }

    const formData = new FormData();
    formData.append("title", $scope.selectedMenu.title);
    formData.append("description", $scope.selectedMenu.description);
    formData.append("link", $scope.selectedMenu.link);
    formData.append("rating", $scope.selectedMenu.rating);
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
        alert(
          `Error updating menu: ${error.data.error || error.statusText}`
        );
      });
  };

  // Mengupdate rating pelatihan
  $scope.updateRating = function (menuId, newRating) {
    $http
      .patch(`/menus/${menuId}/rating`, { rating: newRating })
      .then(() => {
        alert("Rating updated successfully!");
        $scope.getMenus();
      })
      .catch((error) => {
        alert(`Error updating rating: ${error.data.error || error.statusText}`);
      });
  };

  // Reset data pelatihan baru
  $scope.resetNewMenu = function () {
    $scope.newMenu = {
      title: "",
      description: "",
      link: "",
      img: null,
      rating: 0,
    };
  };

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
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);

