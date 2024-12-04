const app = angular.module("trainingApp", []);

app.controller("TrainingController", function ($scope, $http) {
  // Inisialisasi user
  $scope.user = {};
  // Menyimpan semua pelatihan
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
    rating: 0, // Default rating
  };

  $scope.getTrainings = function () {
    $http
      .get("/trainings")
      .then((response) => {
        $scope.trainings = response.data;
        console.log("Trainings loaded:", $scope.trainings);

        // Perbarui elemen lazy setelah data dimuat
        if (typeof lazySizes !== "undefined") {
          lazySizes.update();
        }
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
    // Pastikan latihan sudah diambil sebelum mencocokkan
    $scope.getTrainings().then(() => {
      $http
        .get("/todolist")
        .then((response) => {
          console.log("Fetched todo-list:", response.data);

          // Ambil semua idTraining dari todo-list
          const todoListData = response.data.data;

          // Cocokkan idTraining dengan daftar latihan
          $scope.todoTrainings = todoListData
            .map((todo) => {
              const matchedTraining = $scope.trainings.find(
                (training) => String(training._id) === String(todo.idTraining) // Pastikan tipe data sama
              );

              return {
                idTraining: todo.idTraining,
                id: todo._id,
                title: matchedTraining
                  ? matchedTraining.title
                  : "Training not found",
                training: matchedTraining || {
                  description: "Please check the training database.",
                  image: "/default.jpg",
                  rating: 0,
                  link: "#",
                },
                priority: todo.priority,
              };
            })
            // Urutkan berdasarkan priority dari yang terbesar ke yang terkecil
            .sort((a, b) => b.priority - a.priority);

          console.log("Mapped and Sorted ToDoList:", $scope.todoTrainings);
        })
        .catch((error) => {
          console.error("Error fetching todo-list:", error);
          alert("Error fetching todo-list. Please try again later.");
        });
    });
  };

  // Perbaikan fungsi getTrainings agar mendukung Promise
  $scope.getTrainings = function () {
    return $http
      .get("/trainings")
      .then((response) => {
        console.log("Fetched trainings:", response.data); // Debug data dari backend
        $scope.trainings = response.data;
      })
      .catch((error) => {
        console.error("Error fetching trainings:", error);
        alert("Error fetching trainings. Please try again later.");
      });
  };

  // Menambah training ke todo-list
  $scope.addToDoList = function (trainingId) {
    const userId = $scope.user._id;
    if (!userId) {
      alert("User not found. Please log in.");
      return;
    }

    const isDuplicate = $scope.todoTrainings.some(
      (item) => item.idTraining === trainingId
    );

    if (isDuplicate) {
      alert("This task is already in your To-Do List.");
      return;
    }

    // Hitung jumlah entri untuk latihan ini di todoTrainings
    const existingEntries = $scope.todoTrainings.filter(
      (item) => item.idTraining === trainingId
    );

    if (existingEntries.length >= 3) {
      alert(
        "Selesaikan dahulu latihan ini pada list, setelah itu dapat menambahkan latihan baru"
      );
      return;
    }

    $http
      .post("/todolist", {
        idTraining: trainingId,
        idUser: userId,
        priority: 1, 
      })
      .then((response) => {
        alert("ToDo added successfully!");
        $scope.getToDoList();
      })
      .catch((error) => {
        console.error("Error adding ToDo:", error);
        alert("Error adding ToDo: " + (error.data?.error || "Unknown error"));
      });
  };

  // Menghapus training dari todo-list
  $scope.deleteToDoList = function (todoId) {
    $http
      .delete(`/todolist/${todoId}`)
      .then(() => {
        alert("Congratulations you have completed the training");
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

  $scope.updatePriority = function (todoId, newPriority) {
    console.log("Received ToDo ID:", todoId, "New Priority:", newPriority); // Debugging nilai todoId

    if (!todoId) {
      alert("SALAH ID: ID yang diberikan tidak valid.");
      console.error("Invalid ToDo ID:", todoId); // Log kesalahan untuk debugging
      return;
    }

    if (newPriority < 1 || newPriority > 10) {
      alert("Priority harus antara 1 dan 10.");
      console.error("Invalid Priority: Out of range (1-10).", newPriority); // Log kesalahan
      return;
    }

    // Lakukan permintaan HTTP PUT untuk memperbarui Priority
    $http
      .put(`/todolist/${todoId}`, { priority: newPriority })
      .then(() => {
        alert("Priority berhasil diperbarui!");
        $scope.getToDoList(); // Perbarui daftar ToDo
      })
      .catch((error) => {
        console.error("Error updating priority:", error); // Log kesalahan untuk debugging
        alert(
          `Error updating priority: ${
            error.data?.error || error.statusText || "Unknown error"
          }`
        );
      });
  };

  // Inisialisasi data todo-list saat aplikasi dimuat
  $scope.getToDoList();
});
