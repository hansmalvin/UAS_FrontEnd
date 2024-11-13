const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));

//template ejs
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  // res.sendFile('./index.html', { root: __dirname});
  //res.send('Hello World!')
  res.render('index', {nama:'Marvinn', title:'halaman home'});
})
app.get('/about', (req, res) => {
  // res.send('about')
  // res.sendFile('./about.html', { root: __dirname});
  res.render('about', {title:'halaman about'});
})
app.get('/info', (req, res) => {
  // res.send('about')
  // res.sendFile('./info.html', { root: __dirname});
  res.render('info', {title:'halaman info'});
})

app.use('/', (req, res)=> {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

app.use(express.static(path.join(__dirname, 'public')));
