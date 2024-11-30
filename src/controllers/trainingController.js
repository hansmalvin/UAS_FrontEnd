const app = angular.module("trainingApp", []);

app.controller("TrainingController", function ($scope, $http) {
  // Inisialisasi user
  $scope.user = {};

  $http.get("/user").then((response) => {
    $scope.user = response.data;
  });

  // Data pelatihan baru
  $scope.newTraining = {
    title: "",
    description: "",
    link: "",
    img: null,
    rating: 0, // Default rating
  };

  // Menyimpan semua pelatihan
  $scope.trainings = [];

  // Mendapatkan semua pelatihan
  $scope.getTrainings = function () {
    $http
      .get("/trainings")
      .then((response) => {
        console.log("Fetched trainings:", response.data); // Debug data dari backend
        $scope.trainings = response.data;
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
      });
  };

  // Menghapus pelatihan
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

  // Menambah pelatihan baru
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

    console.log("Image selected for update:", $scope.selectedTraining.img);
    console.log("Sending update for training ID:", $scope.selectedTraining._id);
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

  // Mengupdate rating pelatihan
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

  // Reset data pelatihan baru
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

// TODOLIST

app.controller("ToDoListController", function ($scope, $http) {
  // Data untuk training baru
  $scope.newTraining = {
    idTraining: "",
    priority: 0, // Default priority
  };

  // Menyimpan semua todo-list
  $scope.todolist = [];

  $scope.validateToDo = function (idTraining, priority) {
    if (!idTraining) {
      alert("ID Training tidak boleh kosong.");
      return false;
    }
    if (priority < 1 || priority > 10) {
      alert("Priority harus antara 1 dan 10.");
      return false;
    }
    return true;
  };

  // Mendapatkan semua todo-list
  $scope.getToDoList = function () {
    $http
      .get("/todolist")
      .then((response) => {
        console.log("Fetched todo-list:", response.data);

        // Proses setiap item dari response
        $scope.todoTrainings = response.data.data.map((item) => ({
          id: item._id, // ID dari todo-list
          idTraining: item.idTraining,
          idUser: item.idUser,
          priority: item.priority,
          training: item.training || {}, // Pastikan ada fallback jika `training` kosong
        }));
      })
      .catch((error) => {
        console.error("Error fetching todo-list:", error);
        alert("Error fetching todo-list.");
      });
  };

  // Menambah training ke todo-list
  $scope.addToDoList = function (trainingId) {
    if (!trainingId) {
      alert("Training ID is required to add to the ToDo list!");
      return;
    }
    const userId = $scope.user._id;
    if (!userId) {
      alert("User tidak ditemukan");
      return;
    }
    $http
      .post("/todolist", {
        idTraining: trainingId,
        idUser: userId,
        priority: 1,
      })
      .then((response) => {
        console.log("Response from backend:", response.data); // Debug response
        alert("ToDo added successfully!");
        $scope.getToDoList(); // Refresh data
      })
      .catch((error) => {
        console.error("Error adding ToDo:", error); // Debug error
        alert("Error adding ToDo: " + (error.data?.error || "Unknown error"));
      });
  };

  // Menghapus training dari todo-list
  $scope.deleteToDoList = function (todoId) {
    $http
      .delete(`/todolist/${todoId}`)
      .then(() => {
        alert("Training removed from todo-list successfully!");
        $scope.getToDoList();
      })
      .catch((error) => {
        alert(
          `Error deleting from todo-list: ${
            error.data.error || error.statusText
          }`
        );
      });
  };

  // Mengupdate prioritas
  $scope.updatePriority = function (todoId, newPriority) {
    if (!todoId || newPriority < 1 || newPriority > 10) {
      alert("Priority must be between 1 and 10.");
      return;
    }
    $http
      .put(`/todolist/${todoId}`, { priority: newPriority })
      .then(() => {
        alert("Priority updated successfully!");
        $scope.getToDoList();
      })
      .catch((error) => {
        alert(
          `Error updating priority: ${
            error.data?.error || error.statusText || "Unknown error"
          }`
        );
      });
  };

  // Reset data training baru
  $scope.resetNewTraining = function () {
    $scope.newTraining = {
      idTraining: "",
      priority: 0,
    };
  };

  // Inisialisasi data todo-list saat aplikasi dimuat
  $scope.getToDoList();
});
