// const express = require('express')
// const path = require('path');
// const app = express()
// const port = 3000

// app.use(express.static(path.join(__dirname, 'public'), {
//   setHeaders: (res, path, stat) => {
//       console.log(`Serving static file: ${path}`);
//   }
// }));


// // Route untuk halaman utama
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'home.html'));
// });

// // Route untuk halaman utama
// app.get('/menu', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'menu.html'));
// });

// // Route untuk halaman utama
// app.get('/training', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'training.html'));
// });


// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'login', 'login-and-signin.html'));
// });

// app.use('/', (req, res)=> {
//     res.status(404)
//     res.send('<h1>404</h1>')
// })

// app.listen(port, () => {
//   console.log(`http://localhost:${port}`)
// })

