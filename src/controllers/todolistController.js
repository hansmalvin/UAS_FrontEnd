app.controller("ToDoListController", function ($scope, $http) {
    // Data untuk training baru
    $scope.newTraining = {
      idTraining: "",
      priority: 0, 
    };
  
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
                  (training) => String(training._id) === String(todo.idTraining) 
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
  
    $scope.getTrainings = function () {
      return $http
        .get("/trainings")
        .then((response) => {
          console.log("Fetched trainings:", response.data); 
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
      // Validasi ID
      if (!todoId) {
        alert("SALAH ID: ID yang diberikan tidak valid.");
        console.error("Invalid ToDo ID:", todoId); 
        return;
      }
  
      if (newPriority < 1 || newPriority > 10) {
        alert("Priority harus antara 1 dan 10.");
        console.error("Invalid Priority: Out of range (1-10).", newPriority);
        return;
      }
  
      // update priority
      $http
        .put(`/todolist/${todoId}`, { priority: newPriority })
        .then(() => {
          alert("Priority berhasil diperbarui!");
          $scope.getToDoList(); 
        })
        .catch((error) => {
          console.error("Error updating priority:", error); 
          alert(
            `Error updating priority: ${
              error.data?.error || error.statusText || "Unknown error"
            }`
          );
        });
    };
  
    $scope.getToDoList();
  });
  