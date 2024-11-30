// const app = angular.module("todoApp", []);

// app.controller("ToDoListController", function ($scope, $http) {
//   // Data untuk training baru
//   $scope.newTraining = {
//     idTraining: "",
//     priority: 0, // Default priority
//   };

//   // Menyimpan semua todo-list
//   $scope.todoList = [];

//   // Mendapatkan semua todo-list
//   $scope.getToDoList = function () {
//     $http
//       .get("/todolist")
//       .then((response) => {
//         console.log("Fetched todo-list:", response.data);
//         $scope.todoList = response.data;
//       })
//       .catch((error) => {
//         console.error("Error fetching todo-list:", error);
//       });
//   };

//   // Menambah training ke todo-list
//   $scope.addToDoList = function (idTraining, priority) {
//     if (!idTraining) {
//       alert("Training ID is missing!");
//       return;
//     }

//     // Membuat objek untuk ditambahkan ke ToDoList
//     const newTraining = { idTraining, priority };

//     // Mengirim data ke backend
//     $http
//       .post("/todolist", newTraining)
//       .then((response) => {
//         alert("Training added to todo-list successfully!");
//         // Memperbarui daftar ToDoList setelah berhasil menambahkan
//         $scope.getToDoList();
//       })
//       .catch((error) => {
//         alert(
//           `Error adding to todo-list: ${error.data.error || error.statusText}`
//         );
//         console.error(error);
//       });
//   };

//   // Menghapus training dari todo-list
//   $scope.deleteToDoList = function (todoId) {
//     $http
//       .delete(`/todolist/${todoId}`)
//       .then(() => {
//         alert("Training removed from todo-list successfully!");
//         $scope.getToDoList();
//       })
//       .catch((error) => {
//         alert(
//           `Error deleting from todo-list: ${
//             error.data.error || error.statusText
//           }`
//         );
//       });
//   };

//   // Mengupdate prioritas
//   $scope.updatePriority = function (todoId, newPriority) {
//     $http
//       .put(`/todolist/${todoId}`, { priority: newPriority })
//       .then(() => {
//         alert("Priority updated successfully!");
//         $scope.getToDoList();
//       })
//       .catch((error) => {
//         alert(
//           `Error updating priority: ${error.data.error || error.statusText}`
//         );
//       });
//   };

//   // Reset data training baru
//   $scope.resetNewTraining = function () {
//     $scope.newTraining = {
//       idTraining: "",
//       priority: 0,
//     };
//   };

//   // Inisialisasi data todo-list saat aplikasi dimuat
//   $scope.getToDoList();
// });
