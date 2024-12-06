const app = angular.module("trainingApp", []);

app.controller("TrainingController", function ($scope, $http) {
  $scope.user = {};
  $scope.trainings = [];

  $http.get("/user").then((response) => {
    $scope.user = response.data;
  });

  // Data pelatihan baru
  $scope.newTraining = {
    title: "",
    description: "",
    link: "",
    img: null,
    rating: 0,
  };

  $scope.getTrainings = function () {
    $http
      .get("/trainings")
      .then((response) => {
        $scope.trainings = response.data;
        console.log("Trainings loaded:", $scope.trainings);

        if (typeof lazySizes !== "undefined") {
          lazySizes.update();
        }
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
      });
  };

  // Menghapus latihan
  $scope.deleteTraining = function (trainingId) {
    $http
      .delete(`/trainings/${trainingId}`)
      .then(() => {
        alert("Training deleted successfully!");
        $scope.getTrainings();
      })
      .catch((error) => {
        alert(
          `Error deleting training: ${error.data.error || error.statusText}`
        );
      });
  };

  // Menambah latihan baru
  $scope.addTraining = function () {
    const formData = new FormData();
    formData.append("title", $scope.newTraining.title);
    formData.append("description", $scope.newTraining.description);
    formData.append("link", $scope.newTraining.link);
    formData.append("rating", $scope.newTraining.rating);
    if ($scope.newTraining.img) {
      formData.append("img", $scope.newTraining.img);
    }

    $http
      .post("/trainings", formData, {
        headers: { "Content-Type": undefined },
      })
      .then((response) => {
        alert("Training added successfully!");
        $scope.getTrainings();
        $scope.resetNewTraining();
      })
      .catch((error) => {
        alert(`Error adding training: ${error.data.error || error.statusText}`);
      });
  };

  $scope.setSelectedTraining = function (training) {
    $scope.selectedTraining = angular.copy(training);
    console.log("Selected training for edit:", $scope.selectedTraining);
  };

  $scope.updateTraining = function () {
    if (!$scope.selectedTraining || !$scope.selectedTraining._id) {
      alert("Invalid training ID");
      $scope.getTrainings();
      return;
    }

    const formData = new FormData();
    formData.append("title", $scope.selectedTraining.title);
    formData.append("description", $scope.selectedTraining.description);
    formData.append("link", $scope.selectedTraining.link);
    formData.append("rating", $scope.selectedTraining.rating);
    if ($scope.selectedTraining.img) {
      formData.append("img", $scope.selectedTraining.img);
    }

    console.log("FormData being sent:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    $http
      .put(`/trainings/${$scope.selectedTraining._id}`, formData, {
        headers: { "Content-Type": undefined },
      })
      .then((response) => {
        alert("Training updated successfully!");
        $scope.getTrainings();
      })
      .catch((error) => {
        alert(
          `Error updating training: ${error.data.error || error.statusText}`
        );
      });
  };

  // Mengupdate rating latihan
  $scope.updateRating = function (trainingId, newRating) {
    if (
      newRating === undefined ||
      newRating === null ||
      newRating < 0 ||
      newRating > 5
    ) {
      alert("Please select a valid rating between 0 and 5.");
      return;
    }

    $http
      .patch(`/trainings/${trainingId}/rating`, { rating: Number(newRating) })
      .then(() => {
        alert("Rating updated successfully!");
        $scope.getTrainings();
      })
      .catch((error) => {
        alert(`Error updating rating: ${error.data.error || error.statusText}`);
      });
  };

  // Reset data latihan baru
  $scope.resetNewTraining = function () {
    $scope.newTraining = {
      title: "",
      description: "",
      link: "",
      img: null,
      rating: 0,
    };
  };

  // Inisialisasi data pelatihan saat aplikasi dimuat
  $scope.getTrainings();
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
